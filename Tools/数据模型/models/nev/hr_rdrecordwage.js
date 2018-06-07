const modelObject = require("modelObject");
class hr_rdrecordwage extends modelObject{
   static fields(){
      return ["pid","no","empid","basemoney","calcmoney","money01","money02","money03","money04","money05","money06","money07","money08","money09","money10","money11","money12","money13","money14","money15","money16","money17","money18","money19","money20","money21","money22","money23","money24","money25","money26","money27","money28","money29","money30","paymoney","memo"];
   }

   static name(){
      return "hr_rdrecordwage";
   }

   static types(){
      return ["int","int","int","float","float","float","float","float","float","float","float","float","float","float","float","float","float","float","float","float","float","float","float","float","float","float","float","float","float","float","float","float","float","float","float","float","string"];
   }
}
module.exports=hr_rdrecordwage;