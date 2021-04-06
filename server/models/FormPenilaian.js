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
  {
    timestamps: true,
  }
)

const FormPenilaian = mongoose.model('FormPenilaian', FormPenilaianSchema)
module.exports = FormPenilaian
