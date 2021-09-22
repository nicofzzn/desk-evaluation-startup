const express = require('express')
const { v4: uuidv4 } = require('uuid')
const multer = require('multer')
const multerS3 = require('multer-s3')
const S3 = require('aws-sdk/clients/s3')
const role = require('../middlewares/role')
const router = express.Router()

const Startup = require('../models/Startup')
const FormPenilaian = require('../models/FormPenilaian')
const allRole = require('../middlewares/allRole')

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

router.post('/', role('peserta'), async (req, res) => {
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

router.get('/', allRole, async (req, res) => {
  const startups = await Startup.find({ userId: { $ne: req.user.id } }).sort({
    createdAt: 'desc',
  })
  res.json(startups)
})

router.get('/mystartup', role('peserta'), async (req, res) => {
  const startups = await Startup.find({ userId: req.user.id }).sort({ createdAt: 'desc' })
  res.json(startups)
})

router.get('/:startupId', allRole, async (req, res) => {
  const startup = await Startup.findById(req.params.startupId)
  res.json(startup)
})

router.delete('/:startupId', role('admin'), async (req, res) => {
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

      return res.json({ message: 'Startup berhasil di hapus' })
    })
  } catch (error) {
    return res.status(404).json({ message: 'Startup tidak ditemukan' })
  }
})

router.post('/nilai', allRole, async (req, res) => {
  const { startupId, nilai, totalNilai } = req.body
  if (
    !startupId ||
    nilai.every(a => a.length === 0) ||
    totalNilai === null ||
    totalNilai === undefined
  )
    return res.status(400).json({ message: 'Invalid inputs' })
  try {
    const startup = await Startup.findById(startupId)

    // return undefined if there is no nilai found
    const checkNilai = startup.penilai.find(nilai => nilai.userId == req.user.id)
    if (checkNilai) return res.status(400).json({ message: 'Startup sudah dinilai' })

    startup.penilai.push({
      userId: req.user.id,
      nama: req.user.name,
      nilai,
      totalNilai,
    })
    startup.nilaiRataRata =
      startup.penilai.reduce((acc, value) => acc + value.totalNilai, 0) /
      startup.penilai.length
    await startup.save()

    res.json({ message: 'Startup berhasil dinilai' })
  } catch (error) {
    return res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
