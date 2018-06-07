const modelObject = require("modelObject");
class monthend extends modelObject{
   static fields(){
      return ["month","sdate","edate","end"];
   }

   static name(){
      return "monthend";
   }

   static types(){
      return ["string","datetime","datetime","boolean"];
   }
}
module.exports=monthend;