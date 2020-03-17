const router = require('koa-router')();
const userService = require('../controllers/mysqlConfig');

//获得登录用户信息
router.prefix('/login')

router.post('/', async (ctx, next)=> {
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
router.post('/add',async (ctx,next) =>{
  let arr = [];

  arr.push(ctx.request.body['username']);
  arr.push(ctx.request.body['password']);
  
  await userService.addUserData(arr).then((data)=>{
    let r = '';
    if(data.affectedRows != 0){
      r = 'ok';
    }
    ctx.body = {
      data:r
    }
  }).catch(()=>{
    ctx.body = {
      data:'err'
    }
  })
});
router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
