var mysql = require('mysql');
var config = require('./defaultConfig');

var pool = mysql.createPool({
    host:config.database.HOST,
    user:config.database.USERNAME,
    password:config.database.PASSWORD,
    database:config.database.DATABASE
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
        let _sql = `select * from Users where username = "${user.account}";`;
        return allServices.query(_sql);
    },
    RegisterUser:function(user){
        let _sql = `insert into Users (username,password) values ('${user.signAccount}','${user.signPass}');`
        return allServices.query(_sql);
    },
    addUseRequests:function(form){
        let _sql = `insert into UseRequests 
        (userId,userName,userDepartment,deviceCategoryId,useDescription,useDateTime) 
        values 
        (${form.personId},'${form.personName}','${form.personDepartment}',${form.deviceCategoryId},'${form.useAim}','${form.dateTime}');`

        return allServices.query(_sql);
    },
    getDeviceCategoryList:function(){
        let _sql = `select * from deviceCategoryInfo`;
        return allServices.query(_sql);
    },
    addReturnRequests:function(form){
        let _sql = `insert into ReturnRequests 
        (userId,userName,userDepartment,deviceCategoryId,deviceDamage,deviceDamageDes,deviceFeedback,returnDateTime) 
        values 
        (${form.personId},'${form.personName}','${form.personDepartment}',${form.deviceCategoryId},'${form.isDamage}','${form.damageDes}','${form.feedback}','${form.dateTime}');`
        return allServices.query(_sql);
    },
    //查询所有使用申请
    getUseRequests:function(userId){
        let _sql = `select * from UseRequests where userId = ${userId};`;
        return allServices.query(_sql);
    },
    //查询所有返回申请
    getReturnRequests:function(userId){
        let _sql = `select * from ReturnRequests where userId = ${userId};`;
        return allServices.query(_sql);
    }
}
module.exports = allServices;