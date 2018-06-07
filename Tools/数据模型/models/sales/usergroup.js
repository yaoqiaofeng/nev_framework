const {sqlModel} = require("modelObject");
class usergroup extends sqlModel{
   static name(){
      return "usergroup";
   }

   static sql(op){
      switch(op){
        case "select":
          return `
          select * from usergroup
          where 1=1 
                    {if id} and id={{id}}{endif id}
                    {if code} and code={{code}}{endif code}
                    {if name} and name={{name}}{endif name}
                    {if def_val} and def_val={{def_val}}{endif def_val}
                    {if memo} and memo={{memo}}{endif memo}
                    {if @search} and (code like '%@search%' OR name like '%@search%' OR memo like '%@search%') {endif @search}
                    {if @sort}order by {{@sort}}{endif}
                    {if @page}limit {{@limit}} offset {{@offset}}{endif @page}
                    {if !@page}limit 50 offset 0{endif !@page}
                 `
        case "delete":
          return `
          delete * from usergroup
          where {if id} id={{id}}  {endif id}
                    {if code} and code={{code}} {endif code}
                    {if name} and name={{name}} {endif name}
                    {if def_val} and def_val={{def_val}} {endif def_val}
                    {if memo} and memo={{memo}} {endif memo}
                 `
        case "update":
          return `
          update usergroup set
                    {if code} code={{code}} {endif code}
                    {if name},name={{name}} {endif name}
                    {if def_val},def_val={{def_val}} {endif def_val}
                    {if memo},memo={{memo}} {endif memo}
          where id={{id}}
                 `
        case "insert":
          return `
          insert into usergroup(
                    {if code}code{endif code}
                    {if name},name{endif name}
                    {if def_val},def_val{endif def_val}
                    {if memo},memo{endif memo}) 
          values({if code}{{code}}{endif code}
                    {if name},{{name}}{endif name}
                    {if def_val},{{def_val}}{endif def_val}
                    {if memo},{{memo}}{endif memo})
                 `
      }
   }
}
module.exports=usergroup;