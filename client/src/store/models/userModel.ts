import { Action, action, Thunk, thunk } from 'easy-peasy'

interface User {
  id: string
  name: string
  email: string
}

export interface UserModel {
  user: User | null
  loading: boolean
  setLoading: Action<UserModel>
  setUser: Action<UserModel, User>
  fetchUser: Thunk<UserModel, User>
}

export const userModel: UserModel = {
  user: null,
  loading: false,
  setLoading: action(state => {
    state.loading = !state.loading
  }),
  setUser: action((state, payload) => {
    state.user = payload
  }),
  fetchUser: thunk((actions, payload) => {
    actions.setUser(payload)
  }),
}
