const modelObject = require("modelObject");
class inventory extends modelObject{
   static fields(){
      return ["classid","code","name","py","model","norms","units","color","material","labo","audit","memo","image"];
   }

   static name(){
      return "inventory";
   }

   static types(){
      return ["int","string","string","string","string","string","string","string","string","boolean","boolean","boolean","string"];
   }
}
module.exports=inventory;