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
  return ctx.body = {
    msg:result,
  }
})

router.post('/addUseRequest', async ctx => {
  const form = ctx.request.body;
  const result = await userService.addUseRequests(form);
  return ctx.body = {
    msg: result,
  }
});

router.post('/addReturnRequest', async ctx => {
  const form = ctx.request.body;
  const result = await userService.addReturnRequests(form);
  return ctx.body = {
    msg: result,
  }
});

router.get('/getDeviceCategoryList',async ctx =>{

  const result = await userService.getDeviceCategoryList();
  return ctx.body = {
    data:result
  }
});

router.get('/getUseRequests',async ctx =>{
  const userId = ctx.query;
  const result = await userService.getUseRequests(userId);
  return ctx.body = {
    data:result
  }
});

router.get('/getReturnRequests',async ctx =>{
  const userId = ctx.query;
  const result = await userService.getReturnRequests(userId);
  return ctx.body = {
    data:result
  }
})
module.exports = router