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
          return ctx.body = {
            msg: "成功登录",
            error: 0,
            token:token,
            permissionId:user.permissionId
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
});
router.get('/getAllDevices',async ctx =>{
  const result = await userService.getAllDevices();
  return ctx.body = {
    data:result
  }
});
router.get('/getAllRentedDevices',async ctx=>{
  const result = await userService.getAllRentedDevices();
  return ctx.body = {
    data:result
  }
});
router.get('/getAllUseRequests',async ctx =>{
  const result = await userService.getAllUseRequests();
  return ctx.body = {
    data:result
  }
});
router.get('/getAllReturnRequests',async ctx =>{
  const result = await userService.getAllReturnRequests();
  return ctx.body = {
    data:result
  }
});
router.post('/reduceUseApprove',async ctx=>{
  const data = ctx.request.body;
  const result = await userService.reduceUseApprove(data);
  return ctx.body = {
    data:result
  }
});
router.get('/getDevicesStorage',async ctx =>{
  const result = await userService.getDevicesStorage();
  return ctx.body = {
    data:result
  }
});
router.get('/getCountofRentedDevices',async ctx=>{
  const result = await userService.getCountofRentedDevices();
  return ctx.body = {
    data:result
  }
});
router.get('/getAllReturnedDevices',async ctx=>{
  const result =await userService.getAllReturnedDevices();
  return ctx.body = {
    data:result
  }
});
router.post('/reduceReturnRequests',async ctx=>{
  const data = ctx.request.body;
  const result = await userService.reduceReturnRequests(data);
  return ctx.body = {
    data:result
  }
});
router.post('/addDevices',async ctx=>{
  const data = ctx.request.body;
  const result = await userService.addDevices(data);
  if(result){
    return ctx.body = {
      data:result
    }
  }else{
    return ctx.body = {
      error:'必须是新的设备名，才能添加'
    }
  }
});
router.post('/modifySomeDevice',async ctx=>{
  const data = ctx.request.body;
  const result = await userService.modifySomeDevice(data);
  return ctx.body = {
    data:result
  }
});
router.post('/deleteSomeDevice',async ctx =>{
  const data = ctx.request.body;
  const result = await userService.deleteSomeDevice(data);
  return ctx.body = {
    data:result
  }
})
module.exports = router