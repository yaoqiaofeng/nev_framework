const modelObject = require("modelObject");
class sys_modules extends modelObject{
   static fields(){
      return ["classid","typeid","no","name","ename","type","prefit","format","hide"];
   }

   static name(){
      return "sys_modules";
   }

   static types(){
      return ["int","int","int","string","string","string","string","string","boolean"];
   }
}
module.exports=sys_modules;