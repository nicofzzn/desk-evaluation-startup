const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const role = require('../middlewares/role')

// regster user
router.post('/', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  if (!password || !name || !email)
    return res.status(400).json({ message: 'Invalid input', type: 'danger' })

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'Password tidak sama', type: 'danger' })

  try {
    const isUserExist = await User.findOne({ email })
    if (isUserExist)
      return res.status(400).json({ message: 'Email sudah terdaftar', type: 'danger' })

    const hash = await bcrypt.hash(password, 10)

    await User.create({
      name,
      email,
      role: 'peserta',
      password: hash,
    })

    res.json({ message: 'Register success', type: 'success' })
  } catch (error) {
    console.log(error.errors)
    res.status(500).json({ message: 'Server error', type: 'danger' })
  }
})

// register admin
router.post('/admin', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  if (password !== confirmPassword)
    res.status(400).json({ message: 'Password did not match', type: 'danger' })

  try {
    const isUserExist = await User.findOne({ email })
    if (isUserExist)
      return res.status(400).json({ message: 'User already exist', type: 'danger' })

    const hash = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      role: 'admin',
      password: hash,
    })

    res.json({ message: 'Register success', type: 'success' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', type: 'danger' })
  }
})

// add penilai
router.post('/penilai', role('admin'), async (req, res) => {
  const { name, email, password } = req.body
  if (!password || !name || !email)
    return res.status(400).json({ message: 'Invalid input', type: 'danger' })

  try {
    const isUserExist = await User.findOne({ email })
    if (isUserExist)
      return res.status(400).json({ message: 'Email sudah terdaftar', type: 'danger' })

    const hash = await bcrypt.hash(password, 10)

    await User.create({
      name,
      email,
      role: 'penilai',
      password: hash,
    })

    res.json({ message: 'User added', type: 'success' })
  } catch (error) {
    console.log(error.errors)
    res.status(500).json({ message: 'Server error', type: 'danger' })
  }
})

// get penilai
router.get('/penilai', role('admin'), async (req, res) => {
  try {
    const penilai = await User.find({ role: 'penilai' }).select('-password')
    res.json(penilai)
  } catch (error) {
    res.status(500).json({ message: 'Server error', type: 'danger' })
  }
})

// delete penilai
router.delete('/penilai/:id', role('admin'), async (req, res) => {
  try {
    const penilai = await User.findOneAndDelete({ _id: req.params.id, role: 'penilai' })
    if (penilai) return res.json({ message: 'User berhasil dihapus', type: 'success' })

    return res.status(400).json({ message: 'User tidak ditemukan', type: 'danger' })
  } catch (error) {
    return res.status(500).json({ error: 'Server error', type: 'danger' })
  }
})

// update penilai password
router.patch('/penilai/:id', role('admin'), async (req, res) => {
  try {
    const { password } = req.body
    if (!password || password.trim() == '') {
      return res.status(400).json({ message: 'Invalid input', type: 'danger' })
    }

    const penilai = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'penilai' },
      { password: password }
    )
    if (!penilai)
      return res.status(400).json({ message: 'User tidak ditemukan', type: 'danger' })

    return res.json({ message: 'Password berhasil diupdate', type: 'success' })
  } catch (error) {
    return res.status(500).json({ error: 'Server error', type: 'danger' })
  }
})

router.delete('/:id', role('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    return res.json({ message: 'User deleted', type: 'success' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Server error', type: 'danger' })
  }
})

module.exports = router
