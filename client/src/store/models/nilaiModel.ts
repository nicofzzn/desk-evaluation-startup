import { Action, action, Thunk, thunk } from 'easy-peasy'
import axios from 'axios'

export interface Nilai {
  userId: string
  startupId: string
  nilai: Array<
    Array<{
      optionId: string
      skor: number
    }>
  >
  total: number
}

interface Alert {
  message: string
  type: 'danger' | 'success'
}

export interface NilaiModel {
  nilai: Nilai | null
  nilais: Nilai[]
  loading: boolean
  alert: Alert | null
  setAlert: Action<NilaiModel, Alert | null>
  setLoading: Action<NilaiModel, boolean>
  setNilai: Action<NilaiModel, Nilai>
  setNilais: Action<NilaiModel, Nilai[]>
  getNilai: Thunk<NilaiModel, { startupId: string; userId: string }>
  getNilais: Thunk<NilaiModel, { startupId: string }>
}

export const nilaiModel: NilaiModel = {
  nilai: null,
  nilais: [],
  loading: false,
  alert: null,
  setAlert: action((state, payload) => {
    state.alert = payload
  }),
  setLoading: action((state, payload) => {
    state.loading = payload
  }),
  setNilai: action((state, payload) => {
    state.nilai = payload
  }),
  setNilais: action((state, payload) => {
    state.nilais = payload
  }),
  getNilai: thunk(async (actions, payload) => {
    try {
      actions.setLoading(true)
      const res = await axios.get(`/api/nilai/${payload.startupId}/${payload.userId}`)
      actions.setNilai(res.data)
      actions.setLoading(false)
    } catch (error: any) {
      actions.setAlert({ ...error.response.data, type: 'danger' })
      actions.setLoading(false)
    }
  }),
  getNilais: thunk(async (actions, payload) => {
    try {
      actions.setLoading(true)
      const res = await axios.get(`/api/nilais/${payload.startupId}`)
      actions.setNilais(res.data)
      actions.setLoading(false)
    } catch (error: any) {
      actions.setAlert({ ...error.response.data, type: 'danger' })
      actions.setLoading(false)
    }
  }),
}
