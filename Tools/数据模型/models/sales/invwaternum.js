const {sqlModel} = require("modelObject");
class invwaternum extends sqlModel{
   static name(){
      return "invwaternum";
   }

   static sql(op){
      switch(op){
        case "select":
          return `
          select * from invwaternum
          where 1=1 
                    {if id} and id={{id}}{endif id}
                    {if no} and no={{no}}{endif no}
                    {if invid} and invid={{invid}}{endif invid}
                    {if snum} and snum={{snum}}{endif snum}
                    {if enum} and enum={{enum}}{endif enum}
                    {if memo} and memo={{memo}}{endif memo}
                    {if stop} and stop={{stop}}{endif stop}
                    {if @search} and (memo like '%@search%') {endif @search}
                    {if @sort}order by {{@sort}}{endif}
                    {if @page}limit {{@limit}} offset {{@offset}}{endif @page}
                    {if !@page}limit 50 offset 0{endif !@page}
                 `
        case "delete":
          return `
          delete * from invwaternum
          where {if id} id={{id}}  {endif id}
                    {if no} and no={{no}} {endif no}
                    {if invid} and invid={{invid}} {endif invid}
                    {if snum} and snum={{snum}} {endif snum}
                    {if enum} and enum={{enum}} {endif enum}
                    {if memo} and memo={{memo}} {endif memo}
                    {if stop} and stop={{stop}} {endif stop}
                 `
        case "update":
          return `
          update invwaternum set
                    {if no} no={{no}} {endif no}
                    {if invid},invid={{invid}} {endif invid}
                    {if snum},snum={{snum}} {endif snum}
                    {if enum},enum={{enum}} {endif enum}
                    {if memo},memo={{memo}} {endif memo}
                    {if stop},stop={{stop}} {endif stop}
          where id={{id}}
                 `
        case "insert":
          return `
          insert into invwaternum(
                    {if no}no{endif no}
                    {if invid},invid{endif invid}
                    {if snum},snum{endif snum}
                    {if enum},enum{endif enum}
                    {if memo},memo{endif memo}
                    {if stop},stop{endif stop}) 
          values({if no}{{no}}{endif no}
                    {if invid},{{invid}}{endif invid}
                    {if snum},{{snum}}{endif snum}
                    {if enum},{{enum}}{endif enum}
                    {if memo},{{memo}}{endif memo}
                    {if stop},{{stop}}{endif stop})
                 `
      }
   }
}
module.exports=invwaternum;