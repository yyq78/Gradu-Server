const router = require('koa-router')();
const userService = require('../controllers/mysqlConfig');
const JwtUtil = require('../public/utils/jwt');
// 用户登录接口
router.post('/login', async (ctx, next)=> {
  const form = ctx.request.body;  
  const userInfo = await userService.validateUser(form);
  if(userInfo.length === 0){
      return ctx.body = {
          msg: "不存在该用户",
          error: -1,
      }
  }else{
      let [user] = userInfo;
      const password = form.password;
      if(password === user.psw) {
          let jwt = new JwtUtil(user);
          let token = jwt.generateToken();
          //登录成功后，为用户设置session
          ctx.session.userId = user.userId;
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
  let userId = ctx.query.userId;
  const result = await userService.getUseRequests(userId);
  return ctx.body = {
    data:result
  }
});

router.get('/getReturnRequests',async ctx =>{
  let userId = ctx.query.userId;
  const result = await userService.getReturnRequests(userId);
  return ctx.body = {
    data:result
  }
})
module.exports = router