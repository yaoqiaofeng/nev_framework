const modelObject = require("modelObject");
class sys_module extends modelObject{
   static fields(){
      return ["no","name"];
   }

   static name(){
      return "sys_module";
   }

   static types(){
      return ["int","string"];
   }
}
module.exports=sys_module;