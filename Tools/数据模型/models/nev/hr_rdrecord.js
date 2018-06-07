const modelObject = require("modelObject");
class hr_rdrecord extends modelObject{
   static fields(){
      return ["btid","red","billno","date","deptid","empsa","month","money","end","lock","lockcount","audit","auditname","auditdate","memo","lastdate","mkname"];
   }

   static name(){
      return "hr_rdrecord";
   }

   static types(){
      return ["int","boolean","string","datetime","int","string","string","float","boolean","boolean","int","boolean","string","datetime","datetime","datetime","string"];
   }
}
module.exports=hr_rdrecord;