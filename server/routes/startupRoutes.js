const express = require('express')
const Startup = require('../models/Startup')
const { v4: uuidv4 } = require('uuid')
const multer = require('multer')
const multerS3 = require('multer-s3')
const S3 = require('aws-sdk/clients/s3')
const validator = require('validator')
const role = require('../middlewares/role')
const router = express.Router()

const s3 = new S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'deskevaluationstartup',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, `${uuidv4()}.pdf`)
    },
  }),
  limits: {
    fileSize: 100000,
  },
})

router.post('/', role('admin'), (req, res) => {
  upload.single('file_proposal')(req, res, async function (err) {
    const inputs = sanitizeInput(req.body)
    const errors = handleValidation(inputs)
    if (errors) return res.status(400).json({ errors })

    if (err) return res.status(400).json({ message: err.message })
    if (!req.file)
      return res.status(400).json({ message: 'File proposal is required' })

    try {
      await Startup.create({
        nama: inputs.nama,
        tahun_pendanaan: inputs.tahunPendanaan,
        versi_profil_pendanaan: inputs.versiProfilPendanaan,
        form_penilaian: inputs.formPenilaian,
        file_proposal: req.file.location,
      })
      res.json({ message: 'Startup berhasil di tambah' })
    } catch (err) {
      res.status(400).json(err)
    }
  })
})

function sanitizeInput(body) {
  let inputs = {}

  for (const item in body) {
    inputs = { ...inputs, [item]: validator.trim(body[item]) }
  }

  return inputs
}

function handleValidation(body) {
  let errors = {}

  for (const item in body) {
    if (!body[item]) errors = { ...errors, [item]: 'Invalid input' }
  }

  if (Object.keys(errors).length === 0 && errors.constructor === Object)
    return null

  return errors
}

module.exports = router
