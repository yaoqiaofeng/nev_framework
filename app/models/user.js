var modelObject = require("modelObject");

class user extends modelObject{
    static fields(){
        return ['username','name','tel','email','type','wx_openId','image'];
    }

    static name(){
        return "user";
    }
}
module.exports = user;