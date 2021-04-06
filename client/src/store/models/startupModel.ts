import { Action, action, Thunk, thunk } from 'easy-peasy'
import axios from 'axios'
import { FormField } from '../../components/TambahStartup'
import { FormPenilaian } from '../../components/hooks/useTambahFormPenilaianReducer'

interface Startup {
  _id: string
  nama: string
  tahunPendanaan: string
  versiProfilPendanaan: string
  formPenilaian: FormPenilaian
  fileProposal: string
}

interface Alert {
  message: string
  type: 'danger' | 'success'
}

export interface StartupModel {
  startups: Startup[]
  loading: boolean
  alert: Alert | null
  setAlert: Action<StartupModel, Alert | null>
  setLoading: Action<StartupModel, boolean>
  setStartup: Action<StartupModel, Startup[]>
  addStartup: Thunk<
    StartupModel,
    { formData: FormData; formField: FormField; clearForm: () => void }
  >
  getStartups: Thunk<StartupModel>
  deleteStartup: Thunk<StartupModel, string>
}

export const startupModel: StartupModel = {
  startups: [],
  loading: false,
  alert: null,
  setAlert: action((state, payload) => {
    state.alert = payload
  }),
  setLoading: action((state, payload) => {
    state.loading = payload
  }),
  setStartup: action((state, payload) => {
    state.startups = payload
  }),
  addStartup: thunk(async (actions, payload) => {
    actions.setAlert(null)
    try {
      actions.setLoading(true)
      const res = await axios.post('/api/startup', payload.formData, {
        headers: {
          ...payload.formField,
          'Content-Type': 'multipart/form-data',
        },
      })
      payload.clearForm()
      const res2 = await axios.get('/api/startup')
      actions.setStartup(res2.data)
      actions.setAlert({ ...res.data, type: 'success' })
      actions.setLoading(false)
    } catch (error) {
      actions.setAlert({ ...error.response.data, type: 'danger' })
      actions.setLoading(false)
    }
  }),
  getStartups: thunk(async actions => {
    try {
      actions.setLoading(true)
      const res = await axios.get('/api/startup')
      actions.setStartup(res.data)
      actions.setLoading(false)
    } catch (error) {
      actions.setLoading(false)
    }
  }),
  deleteStartup: thunk(async (actions, payload) => {
    try {
      actions.setLoading(true)
      const res = await axios.delete(`/api/startup/${payload}`)
      const res2 = await axios.get('/api/startup')
      actions.setStartup(res2.data)
      actions.setAlert({ ...res.data, type: 'success' })
      actions.setLoading(false)
    } catch (error) {
      actions.setAlert({ ...error.response.data, type: 'danger' })
      actions.setLoading(false)
    }
  }),
}
