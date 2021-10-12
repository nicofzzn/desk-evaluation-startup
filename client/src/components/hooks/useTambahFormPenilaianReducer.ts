import { useReducer } from 'react'

export interface Option {
  _id: string
  namaOption: string
  skor: string | number
}

export interface Subkriteria {
  _id: string
  namaSubkriteria: string
  bobot: string | number
  option: Array<Option>
}

export interface Kriteria {
  namaKriteria: string
  subkriteria: Array<Subkriteria>
}

const kriteria = {
  namaKriteria: '',
  subkriteria: [
    {
      _id: '',
      namaSubkriteria: '',
      bobot: '',
      option: [
        {
          _id: '',
          namaOption: '',
          skor: '',
        },
      ],
    },
  ],
}

export interface FormPenilaian {
  namaFormPenilaian: string
  kriterias: Kriteria[]
  rekomendasiKelulusan: string
}

const initialState: FormPenilaian = {
  namaFormPenilaian: '',
  kriterias: [kriteria],
  rekomendasiKelulusan: '',
}

export interface Action {
  type:
    | 'CHANGE_NAMA_FORM'
    | 'CHANGE_NAMA_KRITERIA'
    | 'CHANGE_SUBKRITERIA'
    | 'CHANGE_BOBOT'
    | 'CHANGE_OPTION'
    | 'CHANGE_SKOR'
    | 'CHANGE_REKOMENDASI_KELULUSAN'
    | 'TAMBAH_OPTION'
    | 'TAMBAH_SUBKRITERIA'
    | 'TAMBAH_KRITERIA'
    | 'HAPUS_OPTION'
    | 'HAPUS_SUBKRITERIA'
    | 'HAPUS_KRITERIA'
    | 'CLEAR_FORM'
  payload?: any
}

function formReducer(state: FormPenilaian, action: Action) {
  const { value, idxKriteria, idxSubkriteria, idxOption } = action.payload || {}

  switch (action.type) {
    case 'CHANGE_NAMA_FORM':
      return { ...state, namaFormPenilaian: action.payload }

    case 'CHANGE_NAMA_KRITERIA':
      state.kriterias[idxKriteria].namaKriteria = value
      return { ...state }

    case 'CHANGE_SUBKRITERIA':
      state.kriterias[idxKriteria].subkriteria[idxSubkriteria].namaSubkriteria = value
      return { ...state }

    case 'CHANGE_BOBOT':
      state.kriterias[idxKriteria].subkriteria[idxSubkriteria].bobot = value
      return { ...state }

    case 'CHANGE_OPTION':
      state.kriterias[idxKriteria].subkriteria[idxSubkriteria].option[
        idxOption
      ].namaOption = value
      return { ...state }

    case 'CHANGE_SKOR':
      state.kriterias[idxKriteria].subkriteria[idxSubkriteria].option[idxOption].skor =
        value
      return { ...state }

    case 'CHANGE_REKOMENDASI_KELULUSAN':
      state.rekomendasiKelulusan = value
      return { ...state }

    case 'TAMBAH_KRITERIA':
      state.kriterias.push({
        namaKriteria: '',
        subkriteria: [
          {
            _id: '',
            namaSubkriteria: '',
            bobot: '',
            option: [
              {
                _id: '',
                namaOption: '',
                skor: '',
              },
            ],
          },
        ],
      })
      return { ...state }

    case 'HAPUS_KRITERIA':
      state.kriterias.splice(idxKriteria, 1)
      return { ...state }

    case 'TAMBAH_SUBKRITERIA':
      state.kriterias[idxKriteria].subkriteria.push({
        _id: '',
        namaSubkriteria: '',
        bobot: '',
        option: [
          {
            _id: '',
            namaOption: '',
            skor: '',
          },
        ],
      })
      return { ...state }

    case 'HAPUS_SUBKRITERIA':
      state.kriterias[idxKriteria].subkriteria.splice(idxSubkriteria, 1)
      return { ...state }

    case 'TAMBAH_OPTION':
      state.kriterias[idxKriteria].subkriteria[idxSubkriteria].option.push({
        _id: '',
        namaOption: '',
        skor: '',
      })
      return { ...state }

    case 'HAPUS_OPTION':
      state.kriterias[idxKriteria].subkriteria[idxSubkriteria].option.splice(idxOption, 1)
      return { ...state }

    case 'CLEAR_FORM':
      state.namaFormPenilaian = ''
      state.rekomendasiKelulusan = ''
      state.kriterias.splice(0, state.kriterias.length)
      state.kriterias.push({
        namaKriteria: '',
        subkriteria: [
          {
            _id: '',
            namaSubkriteria: '',
            bobot: '',
            option: [
              {
                _id: '',
                namaOption: '',
                skor: '',
              },
            ],
          },
        ],
      })
      return state

    default:
      return { ...initialState }
  }
}

function useTambahFormPenilaianReducer() {
  const [form, formDispatch] = useReducer(formReducer, initialState)

  return { form, formDispatch }
}

export default useTambahFormPenilaianReducer
