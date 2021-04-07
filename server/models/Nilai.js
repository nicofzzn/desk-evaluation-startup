const mongoose = require('mongoose')

const NilaiSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Startup',
    },
    startupId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Startup',
    },
    nilai: {
      kriterias: [
        {
          subkriterias: [{ options: Array }],
        },
      ],
      total: Number,
    },
    rekomendasiKelulusan: String,
  },
  {
    timestamps: true,
  }
)

const Nilai = mongoose.model('Nilai', NilaiSchema)
module.exports = Nilai
