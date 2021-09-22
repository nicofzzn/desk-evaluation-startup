const mongoose = require('mongoose')

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

const NilaiSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      require: true,
    },
    nama: String,
    nilai: { type: [[Number]], require: true },
    totalNilai: { type: Number, require: true },
  },
  {
    timestamps: true,
  }
)

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
    penilai: [NilaiSchema],
    nilaiRataRata: {
      type: Number,
      default: 0,
    },
    fileProposal: {
      key: String,
      location: String,
    },
  },
  {
    timestamps: true,
  }
)

const Startup = mongoose.model('Startup', StartupSchema)
module.exports = Startup
