const mongoose = require('mongoose')

const StartupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  funding_year: {
    type: String,
    required: true,
  },
  funding_profile_version: {
    type: String,
    required: true,
  },
  proposal_file: {
    type: String,
  },
})

const Startup = mongoose.model('Startup', StartupSchema)
module.exports = Startup
