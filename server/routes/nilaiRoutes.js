const express = require('express')
const router = express.Router()
const Nilai = require('../models/Nilai')

// get nilai
router.get('/:startupId', role('all'), async (req, res) => {
  try {
    const nilais = await Nilai.find({
      userId: req.user.id,
      startupId: req.params.startupId,
    })
    return res.json(nilais)
  } catch (error) {
    return res.status(500).json({ message: 'Server error' })
  }
})
