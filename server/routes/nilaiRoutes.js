const express = require('express')
const router = express.Router()
const Nilai = require('../models/Nilai')
const allRole = require('../middlewares/allRole')

// get nilai
router.get('/:startupId', allRole, async (req, res) => {
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
