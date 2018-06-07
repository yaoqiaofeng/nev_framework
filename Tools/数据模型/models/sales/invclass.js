const {sqlModel} = require("modelObject");
class invclass extends sqlModel{
   static name(){
      return "invclass";
   }

   static sql(op){
      switch(op){
        case "select":
          return `
          select * from invclass
          where 1=1 
                    {if id} and id={{id}}{endif id}
                    {if highid} and highid={{highid}}{endif highid}
                    {if code} and code={{code}}{endif code}
                    {if name} and name={{name}}{endif name}
                    {if py} and py={{py}}{endif py}
                    {if audit} and audit={{audit}}{endif audit}
                    {if memo} and memo={{memo}}{endif memo}
                    {if @search} and (code like '%@search%' OR name like '%@search%' OR py like '%@search%' OR memo like '%@search%') {endif @search}
                    {if @sort}order by {{@sort}}{endif}
                    {if @page}limit {{@limit}} offset {{@offset}}{endif @page}
                    {if !@page}limit 50 offset 0{endif !@page}
                 `
        case "delete":
          return `
          delete * from invclass
          where {if id} id={{id}}  {endif id}
                    {if highid} and highid={{highid}} {endif highid}
                    {if code} and code={{code}} {endif code}
                    {if name} and name={{name}} {endif name}
                    {if py} and py={{py}} {endif py}
                    {if audit} and audit={{audit}} {endif audit}
                    {if memo} and memo={{memo}} {endif memo}
                 `
        case "update":
          return `
          update invclass set
                    {if highid} highid={{highid}} {endif highid}
                    {if code},code={{code}} {endif code}
                    {if name},name={{name}} {endif name}
                    {if py},py={{py}} {endif py}
                    {if audit},audit={{audit}} {endif audit}
                    {if memo},memo={{memo}} {endif memo}
          where id={{id}}
                 `
        case "insert":
          return `
          insert into invclass(
                    {if highid}highid{endif highid}
                    {if code},code{endif code}
                    {if name},name{endif name}
                    {if py},py{endif py}
                    {if audit},audit{endif audit}
                    {if memo},memo{endif memo}) 
          values({if highid}{{highid}}{endif highid}
                    {if code},{{code}}{endif code}
                    {if name},{{name}}{endif name}
                    {if py},{{py}}{endif py}
                    {if audit},{{audit}}{endif audit}
                    {if memo},{{memo}}{endif memo})
                 `
      }
   }
}
module.exports=invclass;