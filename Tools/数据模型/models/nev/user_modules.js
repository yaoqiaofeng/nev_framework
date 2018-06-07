const modelObject = require("modelObject");
class user_modules extends modelObject{
   static fields(){
      return ["userid","typeid"];
   }

   static name(){
      return "user_modules";
   }

   static types(){
      return ["int","int"];
   }
}
module.exports=user_modules;