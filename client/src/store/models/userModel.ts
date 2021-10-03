import { Action, action, Thunk, thunk } from 'easy-peasy'
import axios from 'axios'

export interface User {
  id: string
  name: string
  email: string
  role: string
}

interface LoginField {
  email: string
  password: string
}

interface RegisterField {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface PenilaiField {
  _id?: string
  name: string
  email: string
  password: string
}

interface Alert {
  message: string
  type: string
}

export interface UserModel {
  user: User | null
  penilai: PenilaiField[] | null
  loading: boolean
  loadingPenilai: boolean
  alert: Alert | null
  setAlert: Action<UserModel, Alert | null>
  setLoading: Action<UserModel, boolean>
  setLoadingPenilai: Action<UserModel, boolean>
  setUser: Action<UserModel, User>
  setPenilai: Action<UserModel, PenilaiField[]>
  fetchUser: Thunk<UserModel>
  fetchUserLogin: Thunk<UserModel, LoginField>
  logout: Thunk<UserModel>
  register: Thunk<UserModel, RegisterField>
  addPenilai: Thunk<UserModel, { formField: PenilaiField; clearForm: () => void }>
  getPenilai: Thunk<UserModel>
  updatePenilaiPassword: Thunk<
    UserModel,
    { id: string; password: string; clearForm: () => void }
  >
  deletePenilai: Thunk<UserModel, { id: string }>
}

export const userModel: UserModel = {
  user: null,
  penilai: null,
  loading: true,
  loadingPenilai: false,
  alert: null,
  setAlert: action((state, payload) => {
    state.alert = payload
  }),
  setLoading: action((state, payload) => {
    state.loading = payload
  }),
  setLoadingPenilai: action((state, payload) => {
    state.loadingPenilai = payload
  }),
  setUser: action((state, payload) => {
    state.user = payload
  }),
  setPenilai: action((state, payload) => {
    state.penilai = payload
  }),
  fetchUser: thunk(async actions => {
    try {
      actions.setLoading(true)
      const res = await axios.get('/api/auth')
      actions.setUser(res.data)
      actions.setLoading(false)
    } catch (error: any) {
      actions.setUser(error.response.data)
      actions.setLoading(false)
    }
  }),
  fetchUserLogin: thunk(async (actions, payload) => {
    try {
      actions.setLoading(true)
      const res = await axios.post('/api/auth/login', payload)
      actions.setUser(res.data)
      actions.setLoading(false)
    } catch (error: any) {
      actions.setAlert(error.response.data)
      actions.setLoading(false)
    }
  }),
  logout: thunk(async actions => {
    try {
      actions.setLoading(true)
      const res = await axios.get('/api/auth/logout')
      actions.setUser(res.data)
      actions.setLoading(false)
    } catch (error: any) {
      actions.setAlert(error.response.data)
      actions.setLoading(false)
    }
  }),
  register: thunk(async (actions, payload) => {
    try {
      actions.setLoading(true)
      const res = await axios.post('/api/user', payload)
      actions.setAlert(res.data)
      actions.setLoading(false)
    } catch (error: any) {
      actions.setAlert(error.response.data)
      actions.setLoading(false)
    }
  }),
  addPenilai: thunk(async (actions, payload) => {
    try {
      actions.setLoadingPenilai(true)
      actions.setAlert(null)
      const res = await axios.post('/api/user/penilai', payload.formField)
      actions.getPenilai()
      actions.setAlert(res.data)
      payload.clearForm()
    } catch (error: any) {
      actions.setAlert(error.response.data)
      actions.setLoadingPenilai(false)
    }
  }),
  getPenilai: thunk(async actions => {
    try {
      actions.setLoadingPenilai(true)
      const res = await axios.get('/api/user/penilai')
      actions.setPenilai(res.data)
      actions.setLoadingPenilai(false)
    } catch (error: any) {
      actions.setLoadingPenilai(false)
    }
  }),
  updatePenilaiPassword: thunk(async (actions, payload) => {
    try {
      actions.setLoadingPenilai(true)
      const res = await axios.patch(`/api/user/penilai/${payload.id}`, {
        password: payload.password,
      })
      actions.getPenilai()
      actions.setAlert(res.data)
      payload.clearForm()
    } catch (error: any) {
      actions.setAlert(error.response.data)
      actions.setLoadingPenilai(false)
    }
  }),
  deletePenilai: thunk(async (actions, payload) => {
    try {
      actions.setLoadingPenilai(true)
      const res = await axios.delete(`/api/user/penilai/${payload.id}`)
      actions.getPenilai()
      actions.setAlert(res.data)
    } catch (error: any) {
      actions.setAlert(error.response.data)
      actions.setLoadingPenilai(false)
    }
  }),
}
