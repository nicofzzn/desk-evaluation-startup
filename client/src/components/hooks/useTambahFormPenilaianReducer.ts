import { useReducer } from 'react'

export interface Pertanyaan {
  namaPertanyaan: string
  bobot: string
  option: Array<{
    namaOption: string
    skor: string
  }>
}

export interface Kriteria {
  namaKriteria: string
  pertanyaan: Array<{
    namaPertanyaan: string
    bobot: string
    option: Array<{
      namaOption: string
      skor: string
    }>
  }>
  rekomendasiKelulusan: string
}

const kriteria = {
  namaKriteria: '',
  pertanyaan: [
    {
      namaPertanyaan: '',
      bobot: '',
      option: [
        {
          namaOption: '',
          skor: '',
        },
      ],
    },
  ],
  rekomendasiKelulusan: '',
}

interface FormPenilaian {
  namaFormPenilaian: string
  kriterias: Kriteria[]
}

const initialState: FormPenilaian = {
  namaFormPenilaian: '',
  kriterias: [kriteria],
}

export interface Action {
  type:
    | 'CHANGE_NAMA_FORM'
    | 'CHANGE_NAMA_KRITERIA'
    | 'CHANGE_PERTANYAAN'
    | 'CHANGE_BOBOT'
    | 'CHANGE_OPTION'
    | 'CHANGE_SKOR'
    | 'TAMBAH_OPTION'
    | 'TAMBAH_PERTANYAAN'
    | 'TAMBAH_KRITERIA'
    | 'HAPUS_OPTION'
    | 'HAPUS_PERTANYAAN'
    | 'HAPUS_KRITERIA'
    | 'CLEAR_FORM'
  payload?: any
}

function formReducer(state: FormPenilaian, action: Action) {
  const { value, idxKriteria, idxPertanyaan, idxOption } = action.payload

  switch (action.type) {
    case 'CHANGE_NAMA_FORM':
      return { ...state, namaFormPenilaian: action.payload }

    case 'CHANGE_NAMA_KRITERIA':
      state.kriterias[idxKriteria].namaKriteria = value
      return { ...state }

    case 'CHANGE_PERTANYAAN':
      state.kriterias[idxKriteria].pertanyaan[
        idxPertanyaan
      ].namaPertanyaan = value
      return { ...state }

    case 'CHANGE_BOBOT':
      state.kriterias[idxKriteria].pertanyaan[idxPertanyaan].bobot = value
      return { ...state }

    case 'CHANGE_OPTION':
      state.kriterias[idxKriteria].pertanyaan[idxPertanyaan].option[
        idxOption
      ].namaOption = value
      return { ...state }

    case 'CHANGE_SKOR':
      state.kriterias[idxKriteria].pertanyaan[idxPertanyaan].option[
        idxOption
      ].skor = value
      return { ...state }

    case 'TAMBAH_KRITERIA':
      state.kriterias.push({
        namaKriteria: '',
        pertanyaan: [
          {
            namaPertanyaan: '',
            bobot: '',
            option: [
              {
                namaOption: '',
                skor: '',
              },
            ],
          },
        ],
        rekomendasiKelulusan: '',
      })
      return { ...state }

    case 'HAPUS_KRITERIA':
      state.kriterias.splice(idxKriteria, 1)
      return { ...state }

    case 'TAMBAH_PERTANYAAN':
      state.kriterias[idxKriteria].pertanyaan.push({
        namaPertanyaan: '',
        bobot: '',
        option: [
          {
            namaOption: '',
            skor: '',
          },
        ],
      })
      return { ...state }

    case 'HAPUS_PERTANYAAN':
      state.kriterias[idxKriteria].pertanyaan.splice(idxPertanyaan, 1)
      return { ...state }

    case 'TAMBAH_OPTION':
      state.kriterias[idxKriteria].pertanyaan[idxPertanyaan].option.push({
        namaOption: '',
        skor: '',
      })
      return { ...state }

    case 'HAPUS_OPTION':
      state.kriterias[idxKriteria].pertanyaan[idxPertanyaan].option.splice(
        idxOption,
        1
      )
      return { ...state }

    case 'CLEAR_FORM':
      return {
        namaFormPenilaian: '',
        kriterias: [
          {
            namaKriteria: '',
            pertanyaan: [
              {
                namaPertanyaan: '',
                bobot: '',
                option: [
                  {
                    namaOption: '',
                    skor: '',
                  },
                ],
              },
            ],
            rekomendasiKelulusan: '',
          },
        ],
      }

    default:
      return state
  }
}

function useTambahFormPenilaianReducer() {
  const [form, formDispatch] = useReducer(formReducer, initialState)

  return { form, formDispatch }
}

export default useTambahFormPenilaianReducer
