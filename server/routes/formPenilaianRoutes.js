const express = require('express')
const role = require('../middlewares/role')
const allRole = require('../middlewares/allRole')
const FormPenilaian = require('../models/FormPenilaian')
const router = express.Router()

router.post('/', role('admin'), async (req, res) => {
  if (!req.body.namaFormPenilaian)
    res.status(400).json({ message: 'Invalid inputs' })

  try {
    await FormPenilaian.create(req.body)
    res.json({ message: 'Form added' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Invalid inputs' })
  }
})

router.get('/', role('admin'), async (req, res) => {
  try {
    const forms = await FormPenilaian.find().sort({ createdAt: 'desc' })
    res.json(forms)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.delete('/:id', role('admin'), async (req, res) => {
  try {
    const form = await FormPenilaian.findByIdAndDelete(req.params.id)
    if (!form) return res.status(404).json({ message: 'Form tidak ditemukan' })
    res.json({ message: 'Form berhasil dihapus' })
  } catch (error) {
    res.status(404).json({ message: 'Form tidak ditemukan' })
  }
})

module.exports = router
