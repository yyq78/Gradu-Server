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
        }, cert, { expiresIn:'2h' });

        return token;
    }
    verifyToken(){
        let token = this.data;
        let cert = "token";
        let res;
        try{
            let retToken = token.split(' ')[1];
            let decoded = jwt.decode(retToken, cert);
            if(decoded && decoded.exp <= new Date()/1000) {
                res = 'err'
            }
        }catch(e){
            res = 'err';
        }
        return res;
    }
}

module.exports = Jwt;