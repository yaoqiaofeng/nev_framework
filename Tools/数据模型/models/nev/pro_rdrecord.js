const modelObject = require("modelObject");
class pro_rdrecord extends modelObject{
   static fields(){
      return ["btid","red","billno","date","deptid","empsa","sourid","salebillno","exname","month","sdate","edate","procid","money","end","lock","lockcount","audit","auditname","auditdate","memo","lastdate","mkname"];
   }

   static name(){
      return "pro_rdrecord";
   }

   static types(){
      return ["int","boolean","string","datetime","int","string","int","string","string","string","datetime","datetime","int","float","boolean","boolean","int","boolean","string","datetime","datetime","datetime","string"];
   }
}
module.exports=pro_rdrecord;