const express = require('express')
const role = require('../middlewares/role')
const FormPenilaian = require('../models/FormPenilaian')
const router = express.Router()

router.post('/', role('admin'), async (req, res) => {
  if (!req.body.namaFormPenilaian)
    res.status(400).json({ message: 'Invalid inputs' })

  try {
    const formPenilaian = await FormPenilaian.create(req.body)
    console.log(formPenilaian)
    res.json({ message: 'Form added' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Invalid inputs' })
  }
})

module.exports = router
