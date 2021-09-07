import { Action, action, Thunk, thunk } from 'easy-peasy'
import axios from 'axios'

interface User {
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

interface Alert {
  message: string
  type: string
}

export interface UserModel {
  user: User | null
  loading: boolean
  alert: Alert | null
  setAlert: Action<UserModel, Alert | null>
  setLoading: Action<UserModel, boolean>
  setUser: Action<UserModel, User>
  fetchUser: Thunk<UserModel>
  fetchUserLogin: Thunk<UserModel, LoginField>
  logout: Thunk<UserModel>
  register: Thunk<UserModel, RegisterField>
}

export const userModel: UserModel = {
  user: null,
  loading: true,
  alert: null,
  setAlert: action((state, payload) => {
    state.alert = payload
  }),
  setLoading: action((state, payload) => {
    state.loading = payload
  }),
  setUser: action((state, payload) => {
    state.user = payload
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
}
