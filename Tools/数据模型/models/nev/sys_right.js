const modelObject = require("modelObject");
class sys_right extends modelObject{
   static fields(){
      return ["pid","pno","name","ename","no","rightname","erightname"];
   }

   static name(){
      return "sys_right";
   }

   static types(){
      return ["int","int","string","string","int","string","string"];
   }
}
module.exports=sys_right;