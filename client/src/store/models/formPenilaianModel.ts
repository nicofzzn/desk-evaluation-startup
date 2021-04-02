import { Action, action, Thunk, thunk } from 'easy-peasy'
// import axios from 'axios'

interface Kriteria {
  namaKriteria: string
  pertanyaan: Array<{
    namaPertanyaan: string
    bobot: number
    option: Array<{
      namaOption: string
      skor: number
    }>
    catatan: string
  }>
  total?: number
  rekomendasiKelulusan: number
}

export interface FormPenilaian {
  namaFormPenilaian: string
  kriteria: Array<Kriteria>
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
  setAlert: Action<FormPenilaianModel, Alert>
  addFormPenilaian: Thunk<FormPenilaianModel, FormPenilaian>
  //
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
  addFormPenilaian: thunk(async (state, payload) => {}),
}
