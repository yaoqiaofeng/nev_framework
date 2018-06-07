const modelObject = require("modelObject");
class pro_schedule extends modelObject{
   static fields(){
      return ["bid","sourid","btid","billno","date","deptid","sdate","edate","empid","prono","procid","invid","color","units","read","qty","price","money","batno","flow"];
   }

   static name(){
      return "pro_schedule";
   }

   static types(){
      return ["int","int","int","string","datetime","int","datetime","datetime","int","string","int","int","string","string","string","float","float","float","string","int"];
   }
}
module.exports=pro_schedule;