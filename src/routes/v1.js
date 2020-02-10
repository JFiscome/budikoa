const Router = require('koa-router');
const Auth = require('../middleware/auth');

const VirusCtrl = require('../controllers/VirusCtrl');

/**
 * 路由前缀
 */
const router = new Router({prefix: '/'});

// virus
router.get('virus/area', VirusCtrl.getAreaList);


module.exports = router;
