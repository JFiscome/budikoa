const {getHttpSalt} = require('../tools/utils');

//存在问题哦如果query参数中加这个呢？
const noNeedCheckApi = [
    'wxpay/notify',
    'alipay/notify'
];

const checkSalt = async (ctx, next) => {
    const lfk = ctx.header.lfk;
    const timestamp = ctx.header.timestamp;

    /**
     * 排除检验的接口
     */
    let noNeed = false;
    for (let apiUrl of noNeedCheckApi) {
        if (ctx.path.indexOf(apiUrl) > -1) {
            noNeed = true;
            console.warn('the ask api with no check salt and the href is:', ctx.href);
            break;
        }
    }

    if (!noNeed) {
        /**
         * lfk检验请求的准确性
         */

        if (!lfk || !timestamp || lfk !== getHttpSalt(timestamp)) {
            global.fail('WITHOUT_SALT');
        }

        /**
         * timestamp检验请求的时效性
         */
        if (Date.now() - timestamp > 5 * 60 * 1000) {
            global.fail('REQUEST_EXPIRED');
        }
    }
    await next()
};

module.exports = {
    checkSalt
};