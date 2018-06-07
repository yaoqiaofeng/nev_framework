const {sqlModel} = require("modelObject");
class level extends sqlModel{
   static name(){
      return "level";
   }

   static sql(op){
      switch(op){
        case "select":
          return `
          select * from level
          where 1=1 
                    {if id} and id={{id}}{endif id}
                    {if audit} and audit={{audit}}{endif audit}
                    {if code} and code={{code}}{endif code}
                    {if name} and name={{name}}{endif name}
                    {if py} and py={{py}}{endif py}
                    {if level} and level={{level}}{endif level}
                    {if rate} and rate={{rate}}{endif rate}
                    {if login} and login={{login}}{endif login}
                    {if def_val} and def_val={{def_val}}{endif def_val}
                    {if memo} and memo={{memo}}{endif memo}
                    {if @search} and (code like '%@search%' OR name like '%@search%' OR py like '%@search%' OR memo like '%@search%') {endif @search}
                    {if @sort}order by {{@sort}}{endif}
                    {if @page}limit {{@limit}} offset {{@offset}}{endif @page}
                    {if !@page}limit 50 offset 0{endif !@page}
                 `
        case "delete":
          return `
          delete * from level
          where {if id} id={{id}}  {endif id}
                    {if audit} and audit={{audit}} {endif audit}
                    {if code} and code={{code}} {endif code}
                    {if name} and name={{name}} {endif name}
                    {if py} and py={{py}} {endif py}
                    {if level} and level={{level}} {endif level}
                    {if rate} and rate={{rate}} {endif rate}
                    {if login} and login={{login}} {endif login}
                    {if def_val} and def_val={{def_val}} {endif def_val}
                    {if memo} and memo={{memo}} {endif memo}
                 `
        case "update":
          return `
          update level set
                    {if audit} audit={{audit}} {endif audit}
                    {if code},code={{code}} {endif code}
                    {if name},name={{name}} {endif name}
                    {if py},py={{py}} {endif py}
                    {if level},level={{level}} {endif level}
                    {if rate},rate={{rate}} {endif rate}
                    {if login},login={{login}} {endif login}
                    {if def_val},def_val={{def_val}} {endif def_val}
                    {if memo},memo={{memo}} {endif memo}
          where id={{id}}
                 `
        case "insert":
          return `
          insert into level(
                    {if audit}audit{endif audit}
                    {if code},code{endif code}
                    {if name},name{endif name}
                    {if py},py{endif py}
                    {if level},level{endif level}
                    {if rate},rate{endif rate}
                    {if login},login{endif login}
                    {if def_val},def_val{endif def_val}
                    {if memo},memo{endif memo}) 
          values({if audit}{{audit}}{endif audit}
                    {if code},{{code}}{endif code}
                    {if name},{{name}}{endif name}
                    {if py},{{py}}{endif py}
                    {if level},{{level}}{endif level}
                    {if rate},{{rate}}{endif rate}
                    {if login},{{login}}{endif login}
                    {if def_val},{{def_val}}{endif def_val}
                    {if memo},{{memo}}{endif memo})
                 `
      }
   }
}
module.exports=level;