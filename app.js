const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
// const cors = require('koa2-cors');

const index = require('./routes/index')
// const users = require('./routes/users')

// error handler
onerror(app)

// app.use(cors);
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

app.use(async function (ctx, next) {
  // 我这里知识把登陆和注册请求去掉了，其他的多有请求都需要进行token校验 
  let url = ctx.url;
  url = url.split('?');
  if (url[0] != '/login' && url[0] != '/register') {
      let token = ctx.request.header.authorization;
      let jwt = new JwtUtil(token);
      let result = jwt.verifyToken();
      // 如果考验通过就next，否则就返回登陆信息不正确
      if (result === 'err') {
          ctx.body = {
            status: 403,
            msg: '登录已过期,请重新登录'
          }
      } else {
         await next();
      }
  } else {
      await next();
  }
});
module.exports = app
