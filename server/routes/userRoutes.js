const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

// regster user
router.post('/', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  if (!password || !name || !email)
    return res.status(400).json({ message: 'Invalid input' })

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'Password did not match' })

  try {
    const isUserExist = await User.findOne({ email })
    if (isUserExist)
      return res.status(400).json({ message: 'User already exist' })

    const hash = await bcrypt.hash(password, 10)

    await User.create({
      name,
      email,
      role: 'default',
      password: hash,
    })

    res.json({ message: 'Register success' })
  } catch (error) {
    console.log(error.errors)
    res.status(500).json({ message: 'Server error' })
  }
})

// register admin
router.post('/admin', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  if (password !== confirmPassword)
    res.status(400).json({ message: 'Password did not match' })

  try {
    const isUserExist = await User.findOne({ email })
    if (isUserExist)
      return res.status(400).json({ message: 'User already exist' })

    const hash = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      role: 'admin',
      password: hash,
    })

    res.json({ message: 'Register success' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    res.json(user.name)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
