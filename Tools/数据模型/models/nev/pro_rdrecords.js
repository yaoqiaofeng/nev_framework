const modelObject = require("modelObject");
class pro_rdrecords extends modelObject{
   static fields(){
      return ["pid","no","prono","empid","invid","color","units","invprocid","read","qty","price","money","memo"];
   }

   static name(){
      return "pro_rdrecords";
   }

   static types(){
      return ["int","int","string","int","int","string","string","int","string","float","float","float","string"];
   }
}
module.exports=pro_rdrecords;