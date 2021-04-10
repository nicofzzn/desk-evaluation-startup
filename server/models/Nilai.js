const mongoose = require('mongoose')

const NilaiSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      require: true,
    },
    startupId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Startup',
      require: true,
    },
    nilai: { type: [[Number]], require: true },
    total: { type: Number, require: true },
    rekomendasiKelulusan: { type: Number, require: true },
  },
  {
    timestamps: true,
  }
)

const Nilai = mongoose.model('Nilai', NilaiSchema)
module.exports = Nilai
