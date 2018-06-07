const modelObject = require("modelObject");
class printer extends modelObject{
   static fields(){
      return ["classid","title","content"];
   }

   static name(){
      return "printer";
   }

   static types(){
      return ["int","string","string"];
   }
}
module.exports=printer;