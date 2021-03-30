import { UserModel, userModel } from './userModel'

export interface StoreModel {
  userModel: UserModel
}

const storeModel: StoreModel = {
  userModel: userModel,
}

export default storeModel
