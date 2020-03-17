const router = require('koa-router')()
const userService = require('../controllers/mysqlConfig');

router.prefix('/users')

router.get('/', async (ctx, next)=> {
  ctx.body = await userService.findUserData();
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
