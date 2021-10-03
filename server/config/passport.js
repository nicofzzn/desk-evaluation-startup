const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')
const User = require('../models/User')

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email })
      if (!user) {
        return done(null, false, {
          message: 'Email atau password salah',
          type: 'danger',
        })
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password)
      if (!isPasswordMatch) {
        return done(null, false, {
          message: 'Email atau password salah',
          type: 'danger',
        })
      }

      done(null, user)
    } catch (error) {
      console.log(error.message)
      res.status(500).json({ message: 'Server error', type: 'danger' })
    }
  })
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user)
  })
})
