const router = require('koa-router')();
const userService = require('../controllers/mysqlConfig');
const JwtUtil = require('../public/utils/jwt');
// 用户登录接口
router.post('/login', async (ctx, next)=> {
  const user = ctx.request.body;  
  const userInfo = await userService.validateUser(user);
  if(userInfo.length === 0){
      return ctx.body = {
          msg: "不存在该用户",
          error: -1,
      }
  }else{
      const password = userInfo[0].password;
      if(password === user.password) {
          let jwt = new JwtUtil(userInfo[0]);
          let token = jwt.generateToken();
          return ctx.body = {
            msg: "成功登录",
            error: 0,
            token:token
          }
      }else {
       return ctx.body = {
            msg: "密码错误",
            error: -2,
        }
      }
  }
});
//用户注册接口
router.post('/register',async(ctx)=>{
  const signInUser = ctx.request.body;
  const result = await userService.RegisterUser(signInUser);
  console.log(result);
  return ctx.body = {
  }
})

router.get('/test', async ctx => {
  return ctx.body = {
    message: '你好啥',
  }
})
module.exports = router