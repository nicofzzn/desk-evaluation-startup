const mongoose = require('mongoose')
const Nilai = require('./Nilai')

const FormPenilaianSchema = new mongoose.Schema({
  namaFormPenilaian: {
    type: String,
    required: true,
  },
  kriterias: [
    {
      namaKriteria: String,
      subkriteria: [
        {
          namaSubkriteria: String,
          bobot: Number,
          option: [
            {
              namaOption: String,
              skor: Number,
            },
          ],
        },
      ],
    },
  ],
  rekomendasiKelulusan: Number,
})

const StartupSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      require: true,
    },
    tahunPendanaan: {
      type: String,
      required: true,
    },
    versiProfilPendanaan: {
      type: String,
      required: true,
    },
    formPenilaian: FormPenilaianSchema,
    fileProposal: {
      key: String,
      location: String,
    },
  },
  {
    timestamps: true,
  }
)

StartupSchema.pre('findOneAndDelete', async function (next) {
  const startup = await this.findOne()
  Nilai.deleteMany({ startupId: startup._id }).exec()
  next()
})

const Startup = mongoose.model('Startup', StartupSchema)
module.exports = Startup
