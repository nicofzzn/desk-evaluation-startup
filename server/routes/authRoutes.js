const express = require('express')
const router = express.Router()
const passport = require('passport')

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) return res.status(401).json(info)

    req.logIn(user, err => {
      if (err) return next(err)

      return res.json({ name: user.name, email: user.email })
    })
  })(req, res, next)
})

module.exports = router
