var mysql = require('mysql');
var config = require('./defaultConfig');
var async = require('async');

var pool = mysql.createPool({
    host:config.database.HOST,
    user:config.database.USERNAME,
    password:config.database.PASSWORD,
    database:config.database.DATABASE,
    multipleStatements: true 
});

let allServices = {
    query: function(sql,values) {
        return new Promise((resolve,reject) =>{
            pool.getConnection(function(err,connection){
                if(err){
                    reject(err)
                }else{
                    connection.query(sql,values,(err,rows)=>{
                        if(err){
                            reject(err);
                        }else{
                            resolve(rows);
                        }
                        connection.release()
                    })
                }
            })
        })
    },
    transaction: function(sqlparamsEntities) {
        return new Promise((resolve, reject) => {
          pool.getConnection((err, connection) => {
            if(err) {
             reject(err);
            }
            connection.beginTransaction((err) => {
              if(err) {
                reject(err);
              }
              const funcAry = [];
              sqlparamsEntities.forEach((sql_param) => {
                const tem = (cb) => {
                  connection.query(sql_param,null, (tErr, row, fields) => {
                    if(tErr) {
                      connection.rollback(() => {
                        reject(tErr);
                      });
                    }else  {
                      return cb(null, 'ok');
                    }
                  })
                };
                funcAry.push(tem);
              });
      
              async.series(funcAry, (err, result) => {
                if(err) {
                  connection.rollback(err => {
                    connection.release();
                    reject(err);
                  })
                }else {
                  connection.commit((err, info) => {
                    if(err) {
                        connection.rollback(err => {
                          connection.release();
                          reject(err);
                        })
                    }else {
                      connection.release();
                      resolve(info);
                    }
                  })
                }
              })
            })
          })
        })
      },
    validateUser:function(user){
        let _sql = `select * from Users where userId = "${user.account}";`;
        return allServices.query(_sql);
    },
    //添加使用申请
    addUseRequests:function(form){
        let _sql = `insert into UseRequests (userId,userName,userDepartment,deviceCategoryName,useDescription,useDateTime) 
        values 
        (${form.personId},'${form.personName}','${form.personDepartment}','${form.deviceCategoryName}','${form.useAim}','${form.dateTime}');`

        return allServices.query(_sql);
    },
    //获得设备列表
    getDeviceCategoryList:function(){
        let _sql = `select deviceName,count from devices`;
        return allServices.query(_sql);
    },
    //添加归还申请
    addReturnRequests:function(form){
        let _sql = `insert into ReturnRequests 
        (userId,userName,userDepartment,deviceCategoryName,deviceDamage,deviceDamageDes,deviceFeedback,returnDateTime) 
        values 
        (${form.personId},'${form.personName}','${form.personDepartment}',${form.deviceCategoryName},'${form.isDamage}','${form.damageDes}','${form.feedback}','${form.dateTime}');`
        return allServices.query(_sql);
    },
    //查询个人所有使用申请
    getUseRequests:function(userId){
        let _sql = `select * from UseRequests where userId = ${userId};`;
        return allServices.query(_sql);
    },
    //查询个人所有返回申请
    getReturnRequests:function(userId){
        let _sql = `select * from ReturnRequests where userId = ${userId};`;
        return allServices.query(_sql);
    },
    //查询所有设备
    getAllDevices:function(){
        let _sql = `select * from devices;`;
        return allServices.query(_sql);
    },
    //查询所有租借设备
    getAllRentedDevices:function(){
        let _sql = `select * from rentedDevices;`;
        return allServices.query(_sql);
    },
    //查询所有归还设备
    getAllReturnedDevices:function(){
        let _sql = `select * from returnedDevices;`;
        return allServices.query(_sql);
    },
    //查询所有出库（使用）申请
    getAllUseRequests:function(){
        let _sql = `select * from UseRequests;`;
        return allServices.query(_sql);
    },
    //查询所有入库（归还）申请
    getAllReturnRequests:function(){
        let _sql = `select * from ReturnRequests;`;
        return allServices.query(_sql);
    },
    //审批借用申请。删除一条使用申请，增加一条租借设备
    reduceUseApprove:function(data){
        let _sql1 = `delete from UseRequests where requestId = ${data.requestId};`;
        let _sql2 = `insert into rentedDevices (userId,userName,userDepartment,deviceCategoryName,useDescription,useDateTime) values (${data.userId},'${data.userName}','${data.userDepartment}','${data.deviceCategoryName}','${data.useDescription}','${data.useDateTime}');`;
        return allServices.transaction([_sql1,_sql2]); 
    },
    //审批归还申请。
    reduceReturnRequests:function(data){
        let _sql1 = `delete from ReturnRequests where requestId = ${data.requestId};`;
        let _sql2 = `insert into returnedDevices (userId,userName,userDepartment,deviceCategoryName,deviceDamage,deviceDamageDes,deviceFeedback,returnDateTime) values (${data.userId},'${data.userName}','${data.userDepartment}','${data.deviceCategoryName}','${data.deviceDamage}','${data.deviceDamageDes}','${data.deviceFeedback}','${data.returnDateTime}');`;
        return allServices.transaction([_sql1,_sql2]); 
    },
    //echarts获取库存信息
    getDevicesStorage:function(){
        let _sql = `select * from devices`;
        return allServices.query(_sql);
    },
    //获取借出设备情况（不同种类设备的数量）
    getCountofRentedDevices:function(){
        let _sql = `SELECT deviceCategoryName,COUNT(*) as count FROM rentedDevices group by deviceCategoryName;`;
        return allServices.query(_sql);
    },
    //添加不同种类设备
    addDevices:function(data){
        let _sql = `insert into devices (deviceName,devicePrice,time,count) values ('${data.deviceName}',${data.devicePrice},'${data.time}',${data.count})`;
        return allServices.query(_sql);
    },
    //添加、删除某类设备数量
    modifySomeDevice:function(row){
        let _sql = `update devices set count = ${row.count} where id = ${row.id};`;
        return allServices.query(_sql);
    }
    

}
module.exports = allServices;