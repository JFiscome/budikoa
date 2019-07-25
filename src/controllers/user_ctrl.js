const validators = require('../validators')
const User = require('../models/UserModel')
const UserModel = new User()
const TokenService = require('../services/token')
// 洋葱模型最底层 -- 没有next()
UserController = {

  /**
   * 新增用户信息
   */
  async addUser(ctx) {
    const v = await new validators.user_vali.AddUserValidator().validate(ctx)
    let name = v.get('body.name'), age = v.get('body.age'), gender = v.get('body.gender')
    let uid = await UserModel.addNewUser(name, age, gender)
    let token = await TokenService.generateToken({ uid, name, age, gender })
    global.success({ token })
  },

  async getUser(ctx) {
    let userInfo = await UserModel.getUserInfo(ctx.user.uid)
    global.success({ userInfo: userInfo })
  },

  async updateUser(ctx) {
    const v = await new validators.common_vali.PositiveIntergerValidator().validate(ctx, { id: 'age' })
    await UserModel.updateUserAge(ctx.user.uid, v.get('body.age'))
    global.success()
  },

  async deleteUser(ctx) {
    await UserModel.deleteUser(ctx.user.uid)
    global.success()
  },

}

module.exports = UserController