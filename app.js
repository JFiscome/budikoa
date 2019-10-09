const Koa = require('koa')
const app = new Koa()

const Core = require('./core/core')

Core.initProject(app)

app.use(async ctx => {
  ctx.body = 'Hello World'
})

const port = global.config.get('server.port') || 3000
const host = global.config.get('server.host') || 'localhoust'

console.log('budi koa is running at :', [host, port].join(':'))

app.listen(port)
