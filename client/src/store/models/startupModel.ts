import { Action, action, Thunk, thunk } from 'easy-peasy'
import axios from 'axios'

interface Startup {
  nama: string
  tahunPendanaan: string
  versiProfilPendanaan: string
  formPenilaian: string
  fileProposal: string
}

interface Alert {
  message: string
  type: 'danger' | 'success'
}

export interface StartupModel {
  loading: boolean
  alert: Alert | null
  setAlert: Action<StartupModel, Alert | null>
  setLoading: Action<StartupModel, boolean>
  addStartup: Thunk<StartupModel, FormData>
}

export const startupModel: StartupModel = {
  loading: false,
  alert: null,
  setAlert: action((state, payload) => {
    state.alert = payload
  }),
  setLoading: action((state, payload) => {
    state.loading = payload
  }),
  addStartup: thunk(async (actions, payload) => {
    actions.setAlert(null)
    try {
      actions.setLoading(true)
      const res = await axios.post('/api/startup', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      actions.setAlert({ ...res.data, type: 'success' })
      actions.setLoading(false)
    } catch (error) {
      actions.setAlert({ ...error.response.data, type: 'danger' })
      actions.setLoading(false)
    }
  }),
}
