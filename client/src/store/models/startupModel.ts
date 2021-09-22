import { Action, action, Thunk, thunk } from 'easy-peasy'
import axios from 'axios'
import { FormField } from '../../components/TambahStartup'
import { FormPenilaian } from '../../components/hooks/useTambahFormPenilaianReducer'

export interface Nilai {
  userId: string
  nama: string
  nilai: Array<Array<number>>
  total: number
}

export interface Startup {
  _id: string
  nama: string
  tahunPendanaan: string
  versiProfilPendanaan: string
  formPenilaian: FormPenilaian
  fileProposal: {
    location: string
    key: string
  }
  nilais: Array<Nilai>
  nilaiRataRata?: number
}

interface Alert {
  message: string
  type: 'danger' | 'success'
}

export interface StartupModel {
  startups: Startup[]
  myStartups: Startup[]
  startup: Startup | null
  loading: boolean
  alert: Alert | null
  setAlert: Action<StartupModel, Alert | null>
  setLoading: Action<StartupModel, boolean>
  setStartups: Action<StartupModel, Startup[]>
  setMyStartups: Action<StartupModel, Startup[]>
  setStartup: Action<StartupModel, Startup | null>
  addStartup: Thunk<
    StartupModel,
    { formData: FormData; formField: FormField; clearForm: () => void }
  >
  getStartups: Thunk<StartupModel>
  getMyStartups: Thunk<StartupModel>
  getStartup: Thunk<StartupModel, string>
  deleteStartup: Thunk<StartupModel, string>
  nilaiStartup: Thunk<
    StartupModel,
    {
      startupId: string
      nilai: Array<Array<number>>
      totalNilai: number
    }
  >
}

export const startupModel: StartupModel = {
  startups: [],
  myStartups: [],
  startup: null,
  loading: false,
  alert: null,
  setAlert: action((state, payload) => {
    state.alert = payload
  }),
  setLoading: action((state, payload) => {
    state.loading = payload
  }),
  setStartups: action((state, payload) => {
    state.startups = payload
  }),
  setMyStartups: action((state, payload) => {
    state.myStartups = payload
  }),
  setStartup: action((state, payload) => {
    state.startup = payload
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
      const res2 = await axios.get('/api/startup')
      actions.setStartups(res2.data)
      actions.setAlert({ ...res.data, type: 'success' })
      payload.clearForm()
      actions.setLoading(false)
    } catch (error: any) {
      actions.setAlert({ ...error.response.data, type: 'danger' })
      actions.setLoading(false)
    }
  }),
  getStartups: thunk(async actions => {
    try {
      actions.setLoading(true)
      const res = await axios.get('/api/startup')
      actions.setStartups(res.data)
      actions.setLoading(false)
    } catch (error: any) {
      actions.setLoading(false)
    }
  }),
  getMyStartups: thunk(async actions => {
    try {
      actions.setLoading(true)
      const res = await axios.get('/api/startup/mystartup')
      actions.setMyStartups(res.data)
      actions.setLoading(false)
    } catch (error: any) {
      actions.setLoading(false)
    }
  }),
  getStartup: thunk(async (actions, payload) => {
    try {
      actions.setLoading(true)
      const res = await axios.get(`/api/startup/${payload}`)
      actions.setStartup(res.data)
      actions.setLoading(false)
    } catch (error: any) {
      actions.setLoading(false)
    }
  }),
  deleteStartup: thunk(async (actions, payload) => {
    try {
      actions.setLoading(true)
      const res = await axios.delete(`/api/startup/${payload}`)
      const res2 = await axios.get('/api/startup')
      actions.setStartups(res2.data)
      actions.setAlert({ ...res.data, type: 'success' })
      actions.setLoading(false)
    } catch (error: any) {
      actions.setAlert({ ...error.response.data, type: 'danger' })
      actions.setLoading(false)
    }
  }),
  nilaiStartup: thunk(async (actions, payload) => {
    try {
      actions.setLoading(true)
      const res = await axios.post('/api/startup/nilai', payload)
      const res2 = await axios.get(`/api/startup/${payload.startupId}`)
      actions.setStartup(res2.data)
      actions.setAlert({ ...res.data, type: 'success' })
      actions.setLoading(false)
    } catch (error: any) {
      actions.setAlert({ ...error.response.data, type: 'danger' })
      actions.setLoading(false)
    }
  }),
}
