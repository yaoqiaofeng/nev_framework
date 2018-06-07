const modelObject = require("modelObject");
class baseright extends modelObject{
   static fields(){
      return ["userid","dataid","datatype"];
   }

   static name(){
      return "baseright";
   }

   static types(){
      return ["int","int","string"];
   }
}
module.exports=baseright;