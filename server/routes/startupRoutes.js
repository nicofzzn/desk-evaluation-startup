const express = require('express')
const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const multer = require('multer')
const multerS3 = require('multer-s3')
const S3 = require('aws-sdk/clients/s3')
const role = require('../middlewares/role')
const router = express.Router()

const Startup = require('../models/Startup')
const Nilai = require('../models/Nilai')
const FormPenilaian = require('../models/FormPenilaian')

const s3 = new S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket:
      process.env.NODE_ENV === 'production'
        ? process.env.AWS_BUCKET_PROD
        : process.env.AWS_BUCKET_DEV,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, `${uuidv4()}.pdf`)
    },
  }),
  limits: {
    fileSize: 2000000,
  },
})

router.get('/test2', async (req, res) => {
  try {
    const startups = await Startup.aggregate()
      .lookup({
        from: 'nilais',
        localField: '_id',
        foreignField: 'startupId',
        as: 'nilais',
      })
      .sort({ createdAt: 'desc' })
    res.json(startups)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/test', async (req, res) => {
  try {
    const startups = await Startup.aggregate()
      .lookup({
        from: 'nilais',
        localField: '_id',
        foreignField: 'startupId',
        as: 'nilais',
      })
      .addFields({
        penilaiCount: { $size: '$nilais' },
      })
    res.json(startups)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/', role(['peserta']), async (req, res) => {
  const nama = req.get('nama').trim()
  const tahunPendanaan = req.get('tahunPendanaan').trim()
  const versiProfilPendanaan = req.get('versiProfilPendanaan').trim()
  const formPenilaianId = req.get('formPenilaian').trim()
  const inputs = { nama, tahunPendanaan, versiProfilPendanaan }

  if (!nama || !tahunPendanaan || !versiProfilPendanaan || !formPenilaianId)
    return res.status(400).json({ message: 'Invalid inputs' })

  try {
    const formPenilaian = await FormPenilaian.findById(formPenilaianId)
    if (!formPenilaianId) return res.status(400).json({ message: 'Form tidak ditemukan' })

    inputs.formPenilaian = formPenilaian
  } catch (error) {
    return res.status(400).json({ message: 'Invalid inputs' })
  }

  upload.single('file_proposal')(req, res, async function (err) {
    if (err) return res.status(400).json({ message: 'Server error' })
    if (!req.file) return res.status(400).json({ message: 'File proposal is required' })

    try {
      await Startup.create({
        nama: inputs.nama,
        userId: req.user.id,
        tahunPendanaan: inputs.tahunPendanaan,
        versiProfilPendanaan: inputs.versiProfilPendanaan,
        formPenilaian: inputs.formPenilaian,
        fileProposal: { key: req.file.key, location: req.file.location },
      })
      res.json({ message: 'Startup berhasil di tambah' })
    } catch (err) {
      res.status(400).json({ message: 'Invalid inputs' })
    }
  })
})

router.get('/', role('all'), async (req, res) => {
  const startups = await Startup.aggregate()
    .match({
      userId: { $ne: mongoose.Types.ObjectId(req.user.id) },
    })
    .lookup({
      from: 'nilais',
      localField: '_id',
      foreignField: 'startupId',
      as: 'nilais',
    })
    .addFields({
      penilaiCount: { $size: '$nilais' },
    })
    .sort({ createdAt: 'desc' })
  res.json(startups)
})

router.get('/mystartup', role(['peserta']), async (req, res) => {
  const startups = await Startup.aggregate()
    .match({
      userId: mongoose.Types.ObjectId(req.user.id),
    })
    .lookup({
      from: 'nilais',
      localField: '_id',
      foreignField: 'startupId',
      as: 'nilais',
    })
    .addFields({
      penilaiCount: { $size: '$nilais' },
    })
    .sort({ createdAt: 'desc' })

  return res.json(startups)
})

router.get('/:startupId', role(['admin', 'penilai', 'peserta']), async (req, res) => {
  // const startup = await Startup.aggregate()
  //   .match({
  //     _id: mongoose.Types.ObjectId(req.params.startupId),
  //   })
  //   .lookup({
  //     from: 'nilais',
  //     localField: '_id',
  //     foreignField: 'startupId',
  //     as: 'nilais',
  //   })

  const startup = await Startup.aggregate([
    {
      $match: { _id: { $eq: mongoose.Types.ObjectId(req.params.startupId) } },
    },
    {
      $lookup: {
        from: 'nilais',
        let: { startup_id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$startupId', '$$startup_id'],
                // $eq: ['$startupId', mongoose.Types.ObjectId(req.params.startupId)],
              },
            },
          },
          {
            $lookup: {
              from: 'users',
              let: { user_id: '$userId' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$_id', '$$user_id'],
                    },
                  },
                },
                {
                  $project: {
                    name: 1,
                    email: 1,
                  },
                },
              ],
              as: 'user',
            },
          },
          {
            $unwind: '$user',
          },
          {
            $sort: { createdAt: -1 },
          },
        ],
        as: 'nilais',
      },
    },
  ])

  res.json(startup[0])
})

router.delete('/:startupId', role(['admin']), async (req, res) => {
  if (!req.params.startupId)
    return res.status(404).json({ message: 'Startup tidak ditemukan' })

  try {
    const startup = await Startup.findByIdAndDelete(req.params.startupId)
    if (!startup) return res.json({ message: 'Startup berhasil di hapus' })

    const params = {
      Bucket:
        process.env.NODE_ENV === 'production'
          ? process.env.AWS_BUCKET_PROD
          : process.env.AWS_BUCKET_DEV,
      Key: startup.fileProposal.key,
    }
    s3.deleteObject(params, (err, data) => {
      if (err) console.log(err)

      return res.json({ message: 'Startup berhasil dihapus' })
    })
  } catch (error) {
    return res.status(404).json({ message: 'Startup tidak ditemukan' })
  }
})

router.post('/nilai', role(['penilai']), async (req, res) => {
  const { startupId, nilai: nilaiValue, totalNilai } = req.body
  if (
    !startupId ||
    nilaiValue.every(a => a.length === 0) ||
    totalNilai === null ||
    totalNilai === undefined
  )
    return res.status(400).json({ message: 'Invalid inputs' })

  // try {
  //   const startup = await Startup.findById(startupId)

  //   // return undefined if there is no nilai found
  //   const checkNilai = startup.penilai.find(nilai => nilai.userId == req.user.id)
  //   if (checkNilai) return res.status(400).json({ message: 'Startup sudah dinilai' })

  //   startup.penilai.push({
  //     userId: req.user.id,
  //     nama: req.user.name,
  //     nilai,
  //     totalNilai,
  //   })
  //   startup.nilaiRataRata =
  //     startup.penilai.reduce((acc, value) => acc + value.totalNilai, 0) /
  //     startup.penilai.length
  //   await startup.save()

  //   res.json({ message: 'Startup berhasil dinilai' })
  // } catch (error) {
  //   return res.status(500).json({ message: 'Server error' })
  // }

  try {
    const checkNilai = await Nilai.findOne({ userId: req.user.id, startupId: startupId })
    if (checkNilai) return res.status(400).json({ message: 'Startup sudah dinilai' })

    const nilai = new Nilai({
      userId: req.user.id,
      startupId: startupId,
      nilai: nilaiValue,
      total: totalNilai,
    })

    await nilai.save()
    res.json({ message: 'Startup berhasil dinilai' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
