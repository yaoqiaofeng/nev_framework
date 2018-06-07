const modelObject = require("modelObject");
class user extends modelObject{
   static fields(){
      return ["username","password","name","tel","email","type","wx_openId","image"];
   }

   static name(){
      return "user";
   }

   static types(){
      return ["string","string","string","string","string","string","string","string"];
   }
}
module.exports=user;