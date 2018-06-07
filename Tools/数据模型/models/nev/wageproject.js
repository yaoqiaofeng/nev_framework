const modelObject = require("modelObject");
class wageproject extends modelObject{
   static fields(){
      return ["no","fieldname","wagename","sys","formula","sql","memo"];
   }

   static name(){
      return "wageproject";
   }

   static types(){
      return ["int","string","string","boolean","boolean","boolean","string"];
   }
}
module.exports=wageproject;