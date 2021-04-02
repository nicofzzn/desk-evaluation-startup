import { useReducer } from 'react'

interface Kriteria {
  namaKriteria: string
  pertanyaan: Array<{
    namaPertanyaan: string
    bobot: number
    option: Array<{
      namaOption: string
      skor: number
    }>
    catatan: string
  }>
  rekomendasiKelulusan: number
}

const kriteria = {
  namaKriteria: '',
  pertanyaan: [
    {
      namaPertanyaan: '',
      bobot: 0,
      option: [
        {
          namaOption: '',
          skor: 0,
        },
      ],
      catatan: '',
    },
  ],
  rekomendasiKelulusan: 0,
}

interface FormPenilaian {
  namaFormPenilaian: string
  kriteria: Kriteria[]
}

const initialState: FormPenilaian = {
  namaFormPenilaian: '',
  kriteria: [kriteria],
}

interface Action {
  type:
    | 'CHANGE_NAMA_FORM'
    | 'CHANGE_NAMA_KRITERIA'
    | 'CHANGE_PERTANYAAN'
    | 'CHANGE_BOBOT'
    | 'CHANGE_OPTION'
    | 'CHANGE_SKOR'
    | 'TAMBAH_OPTION'
    | 'TAMBAH_PERTANYAAN'
  payload?: any
}

function formReducer(state: FormPenilaian, action: Action) {
  const newKriteria = [...state.kriteria]
  const { value, idxKriteria, idxPertanyaan, idxOption } = action.payload
  switch (action.type) {
    case 'CHANGE_NAMA_FORM':
      return { ...state, namaFormPenilaian: action.payload }
    case 'CHANGE_NAMA_KRITERIA':
      newKriteria[idxKriteria].namaKriteria = value
      return { ...state, kriteria: newKriteria }
    case 'CHANGE_PERTANYAAN':
      newKriteria[idxKriteria].pertanyaan[idxPertanyaan].namaPertanyaan = value
      return { ...state, kriteria: newKriteria }
    case 'CHANGE_BOBOT':
      newKriteria[idxKriteria].pertanyaan[idxPertanyaan].bobot = value
      return { ...state, kriteria: newKriteria }
    case 'CHANGE_OPTION':
      newKriteria[idxKriteria].pertanyaan[idxPertanyaan].option[
        idxOption
      ].namaOption = value
      return { ...state, kriteria: newKriteria }
    case 'CHANGE_SKOR':
      newKriteria[idxKriteria].pertanyaan[idxPertanyaan].option[
        idxOption
      ].skor = value
      return { ...state, kriteria: newKriteria }
    case 'TAMBAH_OPTION':
      newKriteria[idxKriteria].pertanyaan[idxPertanyaan].option.push({
        namaOption: '',
        skor: 0,
      })
      return { ...state, kriteria: newKriteria }
    case 'TAMBAH_PERTANYAAN':
      newKriteria[idxKriteria].pertanyaan.push({
        namaPertanyaan: '',
        bobot: 0,
        option: [
          {
            namaOption: '',
            skor: 0,
          },
        ],
        catatan: '',
      })
      return { ...state, kriteria: newKriteria }
    default:
      return state
  }
}

function useTambahFormPenilaianReducer() {
  const [form, formDispatch] = useReducer(formReducer, initialState)

  return { form, formDispatch }
}

export default useTambahFormPenilaianReducer
