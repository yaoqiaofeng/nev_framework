const modelObject = require("modelObject");
class user_right extends modelObject{
   static fields(){
      return ["userid","pid","right"];
   }

   static name(){
      return "user_right";
   }

   static types(){
      return ["int","int","string"];
   }
}
module.exports=user_right;