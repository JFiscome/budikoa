const ElephantController = {}
const validators = require('../validators')

// 洋葱模型最底层 -- 没有next()
ElephantController.elephant = async (ctx, next) => {
  const v = await new validators.elephant_vali.PageParamsValidator().validate(ctx)
  let page = v.get('query.page')
  let size = v.get('query.size')
  global.success({
    msg: 'this is the elephant function',
    page, size
  })
}

module.exports = ElephantController