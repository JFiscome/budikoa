const Router = require('koa-router')
const A = require('../middleware/auth')
const C = require('../controllers')
/**
 * 路由前缀
 */
const router = new Router({ prefix: '/v1/' })

router.get('elephant', C.elephant_ctrl.elephant)

/**
 * 新增用户信息
 */
router.post('user', C.user_ctrl.addUser)

/**
 * 获取用户信息
 */
router.get('user', A.auth, C.user_ctrl.getUser)

/**
 * 更新用户信息
 */
router.put('user', A.auth, C.user_ctrl.updateUser)

/**
 * 删除用户信息
 */
router.delete('user', A.auth, C.user_ctrl.deleteUser)



module.exports = router
