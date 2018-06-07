const modelObject = require("modelObject");
class department extends modelObject{
   static fields(){
      return ["code","highid","name","py","audit","memo"];
   }

   static name(){
      return "department";
   }

   static types(){
      return ["string","int","string","string","boolean","string"];
   }
}
module.exports=department;