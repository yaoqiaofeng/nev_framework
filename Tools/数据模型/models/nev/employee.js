const modelObject = require("modelObject");
class employee extends modelObject{
   static fields(){
      return ["deptid","code","name","py","sex","idcode","phone","linkman","linkphone","indate","bank","account","basemoney","stopmoney","out","outdate","audit","memo","image"];
   }

   static name(){
      return "employee";
   }

   static types(){
      return ["int","string","string","string","string","string","string","string","string","datetime","string","string","float","boolean","boolean","datetime","boolean","boolean","string"];
   }
}
module.exports=employee;