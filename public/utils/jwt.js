const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
//创建token类
class Jwt {
    constructor(data){
        this.data = data;
    }
    generateToken(){
        let data = this.data;
        let cert = "token";
        let token = jwt.sign({
            data,
        }, cert, { expiresIn:'10h' });

        return token;
    }
    verifyToken(){
        let token = this.data;
        let cert = "token";
        let res;
        try{
            let result = jwt.verify(token,cert,{algorithms:['RS256']})||{};
            let {exp = 0} = result,current = Math.floor(Date.now()/1000);
            if(current<=exp){
                res = result.data||{};
            }
        }catch(e){
            res = 'err';
        }
        return res;
    }
}

module.exports = Jwt;