import { Action, action, Thunk, thunk } from 'easy-peasy'
import axios from 'axios'

interface User {
  id: string
  name: string
  email: string
}

interface LoginField {
  email: string
  password: string
}

interface Error {
  message: string
}

export interface UserModel {
  user: User | null
  loading: boolean
  error: Error | null
  setError: Action<UserModel, Error>
  setLoading: Action<UserModel, boolean>
  setUser: Action<UserModel, User>
  fetchUser: Thunk<UserModel>
  fetchUserLogin: Thunk<UserModel, LoginField>
  logout: Thunk<UserModel>
}

export const userModel: UserModel = {
  user: null,
  loading: true,
  error: null,
  setError: action((state, payload) => {
    state.error = payload
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
    } catch (error) {
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
    } catch (error) {
      actions.setError(error.response.data)
      actions.setLoading(false)
    }
  }),
  logout: thunk(async actions => {
    try {
      actions.setLoading(true)
      const res = await axios.get('/api/auth/logout')
      actions.setUser(res.data)
      actions.setLoading(false)
    } catch (error) {
      actions.setError(error.response.data)
      actions.setLoading(false)
    }
  }),
}
