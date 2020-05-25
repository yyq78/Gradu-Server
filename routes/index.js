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
router.get('/getAllDevices',async ctx =>{
  const {currentPage,pageSize,search} = ctx.query;
  const result = await userService.getAllDevices(Number(currentPage),Number(pageSize),search);
  const res_total = await userService.getAllDevicesCount(search);
  const total = res_total[0]['count(*)'];
  return ctx.body = {
    data:result,
    total:total,
    page:Number(currentPage),
    size:Number(pageSize),
    totalPage:Math.ceil(total/pageSize)
  }
});
router.get('/getAllRentedDevices',async ctx=>{
  if(ctx.query){
    const {currentPage,pageSize,search} = ctx.query;
    const result = await userService.getAllRentedDevices(Number(currentPage),Number(pageSize),search);
    const res_total = await userService.getAllRentedDevicesCount(search);
    const total = res_total[0]['count(*)'];
    return ctx.body = {
      data:result,
      total:total,
      page:Number(currentPage),
      size:Number(pageSize),
      totalPage:Math.ceil(total/pageSize)
    }
  }else{
    const result = await userService.getAllRentedDevices();
    return ctx.body = {
      data:result
    }
  }

});
router.get('/getAllUseRequests',async ctx =>{
  const {currentPage,pageSize,search} = ctx.query;
  const result = await userService.getAllUseRequests(Number(currentPage),Number(pageSize),search);
  const res_total = await userService.getAllUseRequestsCount(search);
  const total = res_total[0]['count(*)'];
  return ctx.body = {
    data:result,
    total:total,
    page:Number(currentPage),
    size:Number(pageSize),
    totalPage:Math.ceil(total/pageSize)
  }
});
router.get('/getAllReturnRequests',async ctx =>{
  const {currentPage,pageSize,search} = ctx.query;
  const result = await userService.getAllReturnRequests(Number(currentPage),Number(pageSize),search);
  const res_total = await userService.getAllReturnRequestsCount(search);
  const total = res_total[0]['count(*)'];
  return ctx.body = {
    data:result,
    total:total,
    page:Number(currentPage),
    size:Number(pageSize),
    totalPage:Math.ceil(total/pageSize)
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
  if(ctx.query){
    const {currentPage,pageSize,search} = ctx.query;
    const result = await userService.getAllReturnedDevices(Number(currentPage),Number(pageSize),search);
    const res_total = await userService.getAllReturnedDevicesCount(search);
    const total = res_total[0]['count(*)'];
    return ctx.body = {
      data:result,
      total:total,
      page:Number(currentPage),
      size:Number(pageSize),
      totalPage:Math.ceil(total/pageSize)
    }
  }else{
    const result = await userService.getAllReturnedDevices();
    return ctx.body = {
      data:result
    }
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
});
router.post('/getUsersBasic',async ctx=>{
  const id = ctx.request.body.id;
  const result = await userService.getUsersBasic(id);
  return ctx.body = {
    data:result
  }
});
router.post('/refuseUseApprove',async ctx=>{
  const data= ctx.request.body;
  const result = await userService.refuseUseApprove(data);
  return ctx.body = {
    data:result
  }
});
router.get('/getStaffUseRequests',async ctx=>{
  const {userId,currentPage,pageSize,search} = ctx.query;
  const result = await userService.getStaffUseRequests(userId,currentPage,pageSize,search);
  const res_total = await userService.getStaffUseRequestsCount(userId,search);
  const total = res_total[0]['count(*)'];
  return ctx.body = {
    data:result,
    total:total,
    page:Number(currentPage),
    size:Number(pageSize),
    totalPage:Math.ceil(total/pageSize)
  }
});
router.get('/getStaffReturnRequests',async ctx=>{
  const {userId,currentPage,pageSize,search} = ctx.query;
  const result = await userService.getStaffReturnRequests(userId,currentPage,pageSize,search);
  const res_total = await userService.getStaffReturnRequestsCount(userId,search);
  const total = res_total[0]['count(*)'];
  return ctx.body = {
    data:result,
    total:total,
    page:Number(currentPage),
    size:Number(pageSize),
    totalPage:Math.ceil(total/pageSize)
  }
});
router.get('/getDamagesCounts',async ctx=>{
  const result = await userService.getDamagesCounts();
  return ctx.body = {
    data:result
  }
});
router.get('/getFeedBack',async ctx=>{
  const result = await userService.getFeedBack();
  return ctx.body = {
    data:result
  }
});
router.get('/getStaffUseDevices',async ctx=>{
  const userId = ctx.query.userId;
  const result = await userService.getStaffUseDevices(userId);
  return ctx.body = {
    data:result
  }
})
module.exports = router