import { Action, action, Thunk, thunk } from 'easy-peasy'
import axios from 'axios'

interface Kriteria {
  namaKriteria: string
  subkriteria: Array<{
    namaSubkriteria: string
    bobot: number | string
    option: Array<{
      namaOption: string
      skor: number | string
    }>
  }>
}

export interface FormPenilaian {
  _id?: string
  namaFormPenilaian: string
  kriterias: Array<Kriteria>
  rekomendasiKelulusan: number | string
  createdAt?: string
}

interface Alert {
  message: string
  type: 'danger' | 'success'
}

export interface FormPenilaianModel {
  forms: FormPenilaian[]
  loading: boolean
  alert: Alert | null
  setForm: Action<FormPenilaianModel, FormPenilaian[]>
  setLoading: Action<FormPenilaianModel, boolean>
  setAlert: Action<FormPenilaianModel, Alert | null>
  addFormPenilaian: Thunk<
    FormPenilaianModel,
    { form: FormPenilaian; clearForm: () => void }
  >
  getForms: Thunk<FormPenilaianModel>
  deleteForms: Thunk<FormPenilaianModel, string | undefined>
}

export const formPenilaianModel: FormPenilaianModel = {
  forms: [],
  loading: false,
  alert: null,
  setForm: action((state, payload) => {
    state.forms = payload
  }),
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
      const res2 = await axios.get('/api/form-penilaian')
      state.setForm(res2.data)
      state.setAlert({ ...res.data, type: 'success' })
      payload.clearForm()
      state.setLoading(false)
    } catch (error) {
      state.setAlert({ ...error.response.data, type: 'danger' })
      state.setLoading(false)
    }
  }),
  getForms: thunk(async state => {
    try {
      state.setLoading(true)
      const res = await axios.get('/api/form-penilaian')
      state.setForm(res.data)
      state.setLoading(false)
    } catch (error) {
      state.setLoading(false)
    }
  }),
  deleteForms: thunk(async (state, payload) => {
    try {
      state.setLoading(true)
      const res = await axios.delete(`/api/form-penilaian/${payload}`)
      const res2 = await axios.get('/api/form-penilaian')
      state.setForm(res2.data)
      state.setAlert({ ...res.data, type: 'success' })
      state.setLoading(false)
    } catch (error) {
      state.setAlert({ ...error.response.data, type: 'danger' })
      state.setLoading(false)
    }
  }),
}
