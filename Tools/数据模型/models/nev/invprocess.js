const modelObject = require("modelObject");
class invprocess extends modelObject{
   static fields(){
      return ["invid","procid","no","read","rate","price","audit","memo"];
   }

   static name(){
      return "invprocess";
   }

   static types(){
      return ["int","int","int","string","float","float","boolean","string"];
   }
}
module.exports=invprocess;