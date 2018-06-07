const modelObject = require("modelObject");
class invclass extends modelObject{
   static fields(){
      return ["highid","code","name","py","audit","memo"];
   }

   static name(){
      return "invclass";
   }

   static types(){
      return ["int","string","string","string","boolean","string"];
   }
}
module.exports=invclass;