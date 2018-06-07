const modelObject = require("modelObject");
class pro_rdrecordproc extends modelObject{
   static fields(){
      return ["pid","no","procid","memo"];
   }

   static name(){
      return "pro_rdrecordproc";
   }

   static types(){
      return ["int","int","int","string"];
   }
}
module.exports=pro_rdrecordproc;