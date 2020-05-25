var mysql = require('mysql');
var config = require('./defaultConfig');
var async = require('async');

var pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    multipleStatements: true
});

let allServices = {
    query: function (sql, values) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err)
                } else {
                    connection.query(sql, values, (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release()
                    })
                }
            })
        })
    },
    transaction: function (sqlparamsEntities) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }
                connection.beginTransaction((err) => {
                    if (err) {
                        reject(err);
                    }
                    const funcAry = [];
                    sqlparamsEntities.forEach((sql_param) => {
                        const tem = (cb) => {
                            connection.query(sql_param, null, (tErr, row, fields) => {
                                if (tErr) {
                                    connection.rollback(() => {
                                        reject(tErr);
                                    });
                                } else {
                                    return cb(null, 'ok');
                                }
                            })
                        };
                        funcAry.push(tem);
                    });

                    async.series(funcAry, (err, result) => {
                        if (err) {
                            connection.rollback(err => {
                                connection.release();
                                reject(err);
                            })
                        } else {
                            connection.commit((err, info) => {
                                if (err) {
                                    connection.rollback(err => {
                                        connection.release();
                                        reject(err);
                                    })
                                } else {
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
    validateUser: function (user) {
        let _sql = `select * from Users where userId = "${user.account}";`;
        return allServices.query(_sql);
    },
    //添加使用申请
    addUseRequests: function (data) {
        let _sql = `insert into UseRequests (userId,userName,userDepartment,deviceCategoryName,useDescription,useDateTime,status) 
        values 
        (${data.personId},'${data.personName}','${data.personDepartment}','${data.deviceCategoryName}','${data.useAim}','${data.dateTime}',${data.status});`

        return allServices.query(_sql);
    },
    //获得设备列表
    getDeviceCategoryList: function () {
        let _sql = `select deviceName,count from devices;`;
        return allServices.query(_sql);
    },
    //添加归还申请
    addReturnRequests: function (form) {
        let _sql = `insert into ReturnRequests 
        (userId,userName,userDepartment,deviceCategoryName,deviceDamage,deviceDamageDes,deviceFeedback,returnDateTime,status) 
        values 
        (${form.personId},'${form.personName}','${form.personDepartment}','${form.deviceCategoryName}','${form.isDamage}','${form.damageDes}','${form.feedback}','${form.dateTime}',${form.status});`
        return allServices.query(_sql);
    },
    //查询所有设备
    getAllDevices: function (page, size, search) {
        let _sql = `select * from devices `;
        if (search) {
            _sql += ` where deviceName like '%${search}%' or time like '%${search}%'`
        }
        _sql += ` limit ${(page - 1) * size},${size};`
        return allServices.query(_sql);
    },
    //查询所有设备总数
    getAllDevicesCount: function (search) {
        let _sql = `select count(*) from devices`;
        if (search) {
            _sql += ` where deviceName like '%${search}%' or time like '%${search}%';`
        }
        return allServices.query(_sql);
    },
    //查询所有租借设备
    getAllRentedDevices: function (page, size, search) {
        let _sql = `select * from UseRequests where status = 1`;
        if (search) {
            _sql += ` and deviceCategoryName like '%${search}%' or userName like '%${search}%' or userId like '%${Number(search)}%' or useDescription like '%${search}%' or userDepartment like '%${search}%'`
        }
        if (page && size) {
            _sql += ` limit ${(page - 1) * size},${size}`
        }
        _sql += `;`;
        return allServices.query(_sql);
    },
    //查询所有租借设备总数
    getAllRentedDevicesCount: function (search) {
        let _sql = `select count(*) from UseRequests where status = 1`;
        if (search) {
            _sql += ` and deviceCategoryName like '%${search}%' or userName like '%${search}%' or userId like '%${Number(search)}%' or useDescription like '%${search}%' or userDepartment like '%${search}%';`
        }
        return allServices.query(_sql);
    },
    //查询所有归还设备
    getAllReturnedDevices: function (page, size, search) {
        let _sql = `select * from ReturnRequests where status = 1`;
        if (search) {
            _sql += ` and deviceCategoryName like '%${search}%' or userDepartment like '%${search}%' or userId like '%${Number(search)}%' or deviceDamage like '%${search}%' or deviceDamageDes like '%${search}%' or deviceFeedback like '%${search}%'`
        }
        if (page && size) {
            _sql += ` limit ${(page - 1) * size},${size}`
        }
        _sql += `;`;
        return allServices.query(_sql);
    },
    //查询所有归还设备总数
    getAllReturnedDevicesCount: function (search) {
        let _sql = `select count(*) from ReturnRequests where status = 1`;
        if (search) {
            _sql += ` and deviceCategoryName like '%${search}%' or userDepartment like '%${search}%' or userId like '%${Number(search)}%' or deviceDamage like '%${search}%' or deviceDamageDes like '%${search}%' or deviceFeedback like '%${Number(search)}%';`
        }
        return allServices.query(_sql);
    },
    //查询所有出库（使用）申请
    getAllUseRequests: function (page, size, search) {
        let _sql = `select * from UseRequests where status = 0`;
        if (search) {
            _sql += ` and deviceCategoryName like '%${search}%' or userName like '%${search}%' or userId like '%${Number(search)}%' or useDescription like '%${search}%' or userDepartment like '%${search}%'`
        }
        _sql += ` limit ${(page - 1) * size},${size};`
        return allServices.query(_sql);
    },
    getAllUseRequestsCount: function (search) {
        let _sql = `select count(*) from UseRequests where status = 0`;
        if (search) {
            _sql += ` and deviceCategoryName like '%${search}%' or userName like '%${search}%' or userId like '%${Number(search)}%' or useDescription like '%${search}%' or userDepartment like '%${search}%'`
        }
        return allServices.query(_sql);
    },
    //查询所有入库（归还）申请
    getAllReturnRequests: function (page, size, search) {
        let _sql = `select * from ReturnRequests where status = 0`;
        if (search) {
            _sql += ` and deviceCategoryName like '%${search}%' or userDepartment like '%${search}%' or userId like '%${Number(search)}%' or deviceDamage like '%${search}%' or deviceDamageDes like '%${search}%' or deviceFeedback like '%${search}%'`
        }
        _sql += ` limit ${(page - 1) * size},${size};`
        return allServices.query(_sql);
    },
    getAllReturnRequestsCount: function (search) {
        let _sql = `select count(*) from ReturnRequests where status = 0`;
        if (search) {
            _sql += ` where deviceCategoryName like '%${search}%' or userDepartment like '%${search}%' or userId like '%${Number(search)}%' or deviceDamage like '%${search}%' or deviceDamageDes like '%${search}%' or deviceFeedback like '%${search}%'`
        }
        return allServices.query(_sql);
    },
    //审批同意借用申请。更新使用申请状态，该设备数量减一
    reduceUseApprove: function (data) {
        let _sql1 = `update UseRequests set status = ${1} where requestId = ${data.requestId}`;
        let _sql2 = `update devices set count = count-1 where deviceName = '${data.deviceCategoryName}'`;
        console.log(_sql1,_sql2);
        return allServices.transaction([_sql1, _sql2]);
    },
    //拒绝申请
    refuseUseApprove: function (data) {
        let _sql = `update UseRequests set status = ${-1},reason = '${data.reason}' where requestId = ${data.requestId}`;
        return allServices.query(_sql);
    },
    //审批同意归还申请。更新使用申请状态，该设备数量加一
    reduceReturnRequests: function (data) {
        let _sql1 = `update ReturnRequests set status = ${1} where requestId = ${data.requestId}`;
        let _sql2 = `update devices set count = count+1 where deviceName = '${data.deviceCategoryName}'`;
        return allServices.transaction([_sql1, _sql2]);
    },
    //echarts获取库存信息
    getDevicesStorage: function () {
        let _sql = `select * from devices`;
        return allServices.query(_sql);
    },
    //获取借出设备情况（不同种类设备的数量）
    getCountofRentedDevices: function () {
        let _sql = `SELECT deviceCategoryName,COUNT(*) as count FROM UseRequests where status = 1 group by deviceCategoryName;`;
        return allServices.query(_sql);
    },
    //添加不同种类设备
    addDevices: function (data) {
        let _sql1 = `select * from devices where deviceName = '${data.deviceName}'`;
        return allServices.query(_sql1).then((res) => {
            if (res.length > 0) {
                return false;
            } else {
                let _sql = `insert into devices (deviceName,devicePrice,time,count) values ('${data.deviceName}',${data.devicePrice},'${data.time}',${data.count})`;
                return allServices.query(_sql);
            }
        })
    },
    //修改设备
    modifySomeDevice: function (row) {
        let _sql = `update devices set deviceName = '${row.deviceName}',devicePrice = ${row.devicePrice},count = ${row.count},time = '${row.time}' where id = ${row.id};`;
        return allServices.query(_sql);
    },
    //删除设备
    deleteSomeDevice: function (row) {
        let _sql = `delete from devices where id = ${row.id};`;
        return allServices.query(_sql);
    },
    //获得员工基本信息
    getUsersBasic: function (id) {
        let _sql = `select * from usersBasic where userId = ${id}`;
        return allServices.query(_sql);
    },

    //普通员工查看申请记录，使用申请状态
    getStaffUseRequests: function (id, page, size, search) {
        let _sql = `select * from UseRequests where userId = ${id}`;
        if (search) {
            _sql += ` and deviceCategoryName like '%${search}%' or useDateTime like '%${search}%' or useDescription like '%${search}%'`
        }
        if (page && size) {
            _sql += ` limit ${(page - 1) * size},${size}`
        }
        _sql += `;`;
        return allServices.query(_sql);
    },
    getStaffUseRequestsCount: function (id, search) {
        let _sql = `select count(*) from UseRequests where userId = ${id}`;
        if (search) {
            _sql += ` and deviceCategoryName like '%${search}%' or useDateTime like '%${search}%' or useDescription like '%${search}%'`
        }
        _sql += `;`;
        return allServices.query(_sql);
    },
    //普通员工查看申请记录，归还申请状态
    getStaffReturnRequests: function (id, page, size, search) {
        let _sql = `select * from ReturnRequests where userId = ${id}`;
        if (search) {
            _sql += ` and deviceCategoryName like '%${search}%' or deviceDamage like '%${search}%' or deviceDamageDes like '%${search}%' or returnDateTime like '%${search}%'`
        }
        if (page && size) {
            _sql += ` limit ${(page - 1) * size},${size}`
        }
        _sql += `;`;
        return allServices.query(_sql);
    },
    getStaffReturnRequestsCount: function (id, search) {
        let _sql = `select count(*) from ReturnRequests where userId = ${id}`;
        if (search) {
            _sql += ` and deviceCategoryName like '%${search}%' or deviceDamage like '%${search}%' or deviceDamageDes like '%${search}%' or returnDateTime like '%${search}%'`
        }
        _sql += `;`;
        return allServices.query(_sql);
    },
    //echarts图查询损耗情况
    getDamagesCounts: function () {
        let _sql = `select deviceCategoryName,count(*) as count from ReturnRequests where deviceDamageDes = '不能继续使用' and status = 1 group by deviceCategoryName;`;
        return allServices.query(_sql);
    },
    //echarts图表查询满意度情况
    getFeedBack: function () {
        let _sql = `select deviceFeedBack,count(*) as count from ReturnRequests where status = 1 group by deviceFeedBack; `;
        return allServices.query(_sql);
    },
    getStaffUseDevices:function(userId){
        let _sql = `select deviceCategoryName as deviceName from UseRequests where userId = ${userId} and status = 1 group by deviceCategoryName;`;
        return allServices.query(_sql);
    }
}
module.exports = allServices;