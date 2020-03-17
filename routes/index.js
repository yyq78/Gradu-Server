const router = require('koa-router')();
const userService = require('../controllers/mysqlConfig');

// 用户登录接口
router.post('/login', async (ctx, next)=> {
  const user = ctx.request.body;  
  console.log(user);
  const userInfo = await userService.validateUser(user);
  if(userInfo.length === 0){
      return ctx.body = {
          msg: "不存在该用户",
          error: -1,
      }
  }else{
      const password = userInfo[0].password;
      if(password === user.password) {
          return ctx.body = {
            msg: "成功登录",
            error: 0,
          }
      }else {
       return ctx.body = {
            msg: "密码错误",
            error: -2,
        }
      }
  }
});
module.exports = router
