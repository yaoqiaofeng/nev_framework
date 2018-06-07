var {CacheModel} = require("modelObject");

class user extends CacheModel{
    static fields(){
        return ['username','name','tel','email','type','wx_openId','image'];
    }

    static name(){
        return "user";
    }
}
module.exports = user;