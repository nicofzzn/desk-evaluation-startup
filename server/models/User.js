const mongoose = require('mongoose')
const Nilai = require('./Nilai')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

UserSchema.pre('findOneAndDelete', async function (next) {
  const user = await this.findOne()
  await Nilai.deleteMany({ userId: user._id })
  next()
})

const User = mongoose.model('User', UserSchema)
module.exports = User
