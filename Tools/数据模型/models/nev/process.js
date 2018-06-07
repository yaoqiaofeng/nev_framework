const modelObject = require("modelObject");
class process extends modelObject{
   static fields(){
      return ["highid","code","name","py","price","audit","memo"];
   }

   static name(){
      return "process";
   }

   static types(){
      return ["int","string","string","string","float","boolean","string"];
   }
}
module.exports=process;