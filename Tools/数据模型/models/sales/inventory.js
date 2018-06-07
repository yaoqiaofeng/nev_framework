const {sqlModel} = require("modelObject");
class inventory extends sqlModel{
   static name(){
      return "inventory";
   }

   static sql(op){
      switch(op){
        case "select":
          return `
          select * from inventory
          where 1=1 
                    {if id} and id={{id}}{endif id}
                    {if classid} and classid={{classid}}{endif classid}
                    {if code} and code={{code}}{endif code}
                    {if name} and name={{name}}{endif name}
                    {if py} and py={{py}}{endif py}
                    {if model} and model={{model}}{endif model}
                    {if norms} and norms={{norms}}{endif norms}
                    {if units} and units={{units}}{endif units}
                    {if color} and color={{color}}{endif color}
                    {if material} and material={{material}}{endif material}
                    {if price} and price={{price}}{endif price}
                    {if mbprice} and mbprice={{mbprice}}{endif mbprice}
                    {if audit} and audit={{audit}}{endif audit}
                    {if memo} and memo={{memo}}{endif memo}
                    {if image} and image={{image}}{endif image}
                    {if @search} and (code like '%@search%' OR name like '%@search%' OR py like '%@search%' OR model like '%@search%' OR norms like '%@search%' OR units like '%@search%' OR color like '%@search%' OR material like '%@search%' OR image like '%@search%') {endif @search}
                    {if @sort}order by {{@sort}}{endif}
                    {if @page}limit {{@limit}} offset {{@offset}}{endif @page}
                    {if !@page}limit 50 offset 0{endif !@page}
                 `
        case "delete":
          return `
          delete * from inventory
          where {if id} id={{id}}  {endif id}
                    {if classid} and classid={{classid}} {endif classid}
                    {if code} and code={{code}} {endif code}
                    {if name} and name={{name}} {endif name}
                    {if py} and py={{py}} {endif py}
                    {if model} and model={{model}} {endif model}
                    {if norms} and norms={{norms}} {endif norms}
                    {if units} and units={{units}} {endif units}
                    {if color} and color={{color}} {endif color}
                    {if material} and material={{material}} {endif material}
                    {if price} and price={{price}} {endif price}
                    {if mbprice} and mbprice={{mbprice}} {endif mbprice}
                    {if audit} and audit={{audit}} {endif audit}
                    {if memo} and memo={{memo}} {endif memo}
                    {if image} and image={{image}} {endif image}
                 `
        case "update":
          return `
          update inventory set
                    {if classid} classid={{classid}} {endif classid}
                    {if code},code={{code}} {endif code}
                    {if name},name={{name}} {endif name}
                    {if py},py={{py}} {endif py}
                    {if model},model={{model}} {endif model}
                    {if norms},norms={{norms}} {endif norms}
                    {if units},units={{units}} {endif units}
                    {if color},color={{color}} {endif color}
                    {if material},material={{material}} {endif material}
                    {if price},price={{price}} {endif price}
                    {if mbprice},mbprice={{mbprice}} {endif mbprice}
                    {if audit},audit={{audit}} {endif audit}
                    {if memo},memo={{memo}} {endif memo}
                    {if image},image={{image}} {endif image}
          where id={{id}}
                 `
        case "insert":
          return `
          insert into inventory(
                    {if classid}classid{endif classid}
                    {if code},code{endif code}
                    {if name},name{endif name}
                    {if py},py{endif py}
                    {if model},model{endif model}
                    {if norms},norms{endif norms}
                    {if units},units{endif units}
                    {if color},color{endif color}
                    {if material},material{endif material}
                    {if price},price{endif price}
                    {if mbprice},mbprice{endif mbprice}
                    {if audit},audit{endif audit}
                    {if memo},memo{endif memo}
                    {if image},image{endif image}) 
          values({if classid}{{classid}}{endif classid}
                    {if code},{{code}}{endif code}
                    {if name},{{name}}{endif name}
                    {if py},{{py}}{endif py}
                    {if model},{{model}}{endif model}
                    {if norms},{{norms}}{endif norms}
                    {if units},{{units}}{endif units}
                    {if color},{{color}}{endif color}
                    {if material},{{material}}{endif material}
                    {if price},{{price}}{endif price}
                    {if mbprice},{{mbprice}}{endif mbprice}
                    {if audit},{{audit}}{endif audit}
                    {if memo},{{memo}}{endif memo}
                    {if image},{{image}}{endif image})
                 `
      }
   }
}
module.exports=inventory;