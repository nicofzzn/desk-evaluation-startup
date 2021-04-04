const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const path = require('path')

require('dotenv').config()

mongoose.connect(process.env.MONGO_URI2, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
})

const app = express()
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
)

app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny'))

app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')

app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/startup', require('./routes/startupRoutes'))
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/form-penilaian', require('./routes/formPenilaianRoutes'))

app.use(express.static(path.join(__dirname, '../client/build')))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'))
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started at port ${PORT} `))
