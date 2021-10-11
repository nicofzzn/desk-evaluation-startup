const express = require('express')
const role = require('../middlewares/role')
const FormPenilaian = require('../models/FormPenilaian')
const router = express.Router()

router.post('/', role(['admin']), async (req, res) => {
  if (!req.body.namaFormPenilaian) res.status(400).json({ message: 'Invalid inputs' })

  // remove _id on every subkriteria and option so it can be generated automatically by mongodb
  const kriterias = req.body.kriterias.map(kriteria => {
    return {
      namaKriteria: kriteria.namaKriteria,
      subkriteria: kriteria.subkriteria.map(subkriteria => {
        return {
          namaSubkriteria: subkriteria.namaSubkriteria,
          bobot: subkriteria.bobot,
          option: subkriteria.option.map(option => ({
            namaOption: option.namaOption,
            skor: option.skor,
          })),
        }
      }),
    }
  })

  try {
    await FormPenilaian.create({ ...req.body, kriterias: kriterias })
    res.json({ message: 'Form berhasil ditambah' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Invalid inputs' })
  }
})

router.get('/', role('all'), async (req, res) => {
  try {
    const forms = await FormPenilaian.find().sort({ createdAt: 'desc' })
    res.json(forms)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/:id', role(['admin']), async (req, res) => {
  try {
    const form = await FormPenilaian.findByIdAndDelete(req.params.id)
    if (!form) return res.status(404).json({ message: 'Form tidak ditemukan' })
    res.json({ message: 'Form berhasil dihapus' })
  } catch (error) {
    res.status(404).json({ message: 'Form tidak ditemukan' })
  }
})

module.exports = router
