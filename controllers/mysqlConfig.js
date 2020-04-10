var mysql = require('mysql');
var config = require('./defaultConfig');

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
    addReturnRequests:function(form){
        let _sql = `insert into ReturnRequests 
        (userId,userName,userDepartment,deviceCategoryId,deviceDamage,deviceDamageDes,deviceFeedback,returnDateTime) 
        values 
        (${form.personId},'${form.personName}','${form.personDepartment}',${form.deviceCategoryId},'${form.isDamage}','${form.damageDes}','${form.feedback}','${form.dateTime}');`
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
    //删除一条使用申请，增加一条租借设备
    reduceUseApprove:function(data){
        let _sql = `delete from UseRequests where requestId = ${data.requestId} ;insert into rentedDevices (userId,userName,userDepartment,deviceCategoryName,useDescription,useDateTime) values (${data.userId},'${data.userName}','${data.userDepartment}','${data.deviceCategoryName}','${data.useDescription}','${data.useDateTime}');`;
        return allServices.query(_sql); 
    }
}
module.exports = allServices;