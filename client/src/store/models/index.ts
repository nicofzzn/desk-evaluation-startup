import { UserModel, userModel } from './userModel'
import { StartupModel, startupModel } from './startupModel'

export interface StoreModel {
  userModel: UserModel
  startupModel: StartupModel
}

const storeModel: StoreModel = {
  userModel: userModel,
  startupModel: startupModel,
}

export default storeModel
