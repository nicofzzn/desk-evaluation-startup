const mongoose = require('mongoose')

const StartupSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, 'Nama startup is required'],
  },
  tahun_pendanaan: {
    type: String,
    required: [true, 'Tahun pendanaan is required'],
  },
  versi_profil_pendanaan: {
    type: String,
    required: [true, 'Versi profil pendanaan is required'],
  },
  form_penilaian: {
    type: String,
    // required: [true, 'Form penilaian is required'],
  },
  file_proposal: {
    type: String,
    required: [true, 'File proposal is required'],
  },
})

const Startup = mongoose.model('Startup', StartupSchema)
module.exports = Startup
