const modelObject = require("modelObject");
class message extends modelObject{
   static fields(){
      return ["type","date","content","valid","from","to"];
   }

   static name(){
      return "message";
   }

   static types(){
      return ["string","datetime","string","datetime","int","int"];
   }
}
module.exports=message;