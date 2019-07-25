const { LinValidator, Rule } = require('../../core/validatorHelper')

class AddUserValidator extends LinValidator {
  constructor() {
    super()
    this.age = [new Rule('isInt', '必须为正整数', { min: 1 })]
    this.name = [new Rule('isLength', '至少一个字符', { min: 1 })]
    this.gender = [new Rule('isInt', '只能为1 | 2', { min: 1, max: 2 })]
  }
}

class UpdateUserValidator extends LinValidator {
  constructor() {
    super()
  }
}


module.exports = {
  AddUserValidator,
  UpdateUserValidator
}