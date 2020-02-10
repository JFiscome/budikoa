const {HttpException} = require('../../core/exception');
const catchError = async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        const isHttpError = error instanceof HttpException;

        /**
         * 生产环境抛出异常
         */
        if (!global.env && !isHttpError) {
            throw error
        }

        if (isHttpError) {
            // 可控异常，服务端主观抛出
            ctx.body = {
                errorCode: error.errorCode,
                message: error.message
            };

            if (JSON.stringify(error.data) !== '{}' && error.data !== '' && error.data !== undefined) {
                ctx.body.response = error.data
            }

            ctx.status = error.statusCode
        } else {
            // 不可把控异常
            ctx.body = {errorCode: 500, message: '服务器开小差了~'};
            ctx.status = 500;

            console.error(`urgency error need to solve : ${ctx.method} : ${ctx.path}`, error)
        }
    }
};

module.exports = {catchError};
