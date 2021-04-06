const mongoose = require('mongoose')

const FormPenilaianSchema = new mongoose.Schema(
  {
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
  },
  { _id: false }
)

const StartupSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
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
})

const Startup = mongoose.model('Startup', StartupSchema)
module.exports = Startup
