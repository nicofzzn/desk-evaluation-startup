const express = require('express')
const router = express.Router()
const passport = require('passport')

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) return res.status(401).json(info)

    req.logIn(user, err => {
      if (err) return next(err)

      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: req.user.role,
      })
    })
  })(req, res, next)
})

router.get('/', (req, res) => {
  if (!req.user) return res.status(401).json(null)
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  res.json(null)
})

module.exports = router
