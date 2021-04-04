import { Action, action, Thunk, thunk } from 'easy-peasy'
import axios from 'axios'

interface Kriteria {
  namaKriteria: string
  pertanyaan: Array<{
    namaPertanyaan: string
    bobot: number | string
    option: Array<{
      namaOption: string
      skor: number | string
    }>
  }>
  total?: number | string
  rekomendasiKelulusan: number | string
}

export interface FormPenilaian {
  namaFormPenilaian: string
  kriterias: Array<Kriteria>
}

interface Alert {
  message: string
  type: 'danger' | 'success'
}

export interface FormPenilaianModel {
  forms: FormPenilaian[]
  loading: boolean
  alert: Alert | null
  setLoading: Action<FormPenilaianModel, boolean>
  setAlert: Action<FormPenilaianModel, Alert | null>
  addFormPenilaian: Thunk<
    FormPenilaianModel,
    { form: FormPenilaian; clearForm: () => void }
  >
}

export const formPenilaianModel: FormPenilaianModel = {
  forms: [],
  loading: false,
  alert: null,
  setLoading: action((state, payload) => {
    state.loading = payload
  }),
  setAlert: action((state, payload) => {
    state.alert = payload
  }),
  addFormPenilaian: thunk(async (state, payload) => {
    try {
      state.setLoading(true)
      const res = await axios.post('/api/form-penilaian', payload.form)
      state.setAlert({ ...res.data, type: 'success' })
      state.setLoading(false)
      payload.clearForm()
    } catch (error) {
      state.setAlert({ ...error.response.data, type: 'danger' })
      state.setLoading(false)
    }
  }),
}
