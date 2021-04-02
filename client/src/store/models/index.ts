import { UserModel, userModel } from './userModel'
import { StartupModel, startupModel } from './startupModel'
import { FormPenilaianModel, formPenilaianModel } from './formPenilaianModel'

export interface StoreModel {
  userModel: UserModel
  startupModel: StartupModel
  formPenilaianModel: FormPenilaianModel
}

const storeModel: StoreModel = {
  userModel: userModel,
  startupModel: startupModel,
  formPenilaianModel: formPenilaianModel,
}

export default storeModel
