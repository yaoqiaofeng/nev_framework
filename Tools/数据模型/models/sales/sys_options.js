const {sqlModel} = require("modelObject");
class sys_options extends sqlModel{
   static name(){
      return "sys_options";
   }

   static sql(op){
      switch(op){
        case "select":
          return `
          select * from sys_options
          where 1=1 
                    {if id} and id={{id}}{endif id}
                    {if no} and no={{no}}{endif no}
                    {if module} and module={{module}}{endif module}
                    {if name} and name={{name}}{endif name}
                    {if values} and values={{values}}{endif values}
                    {if type} and type={{type}}{endif type}
                    {if memo} and memo={{memo}}{endif memo}
                    {if @search} and (module like '%@search%' OR name like '%@search%' OR values like '%@search%' OR type like '%@search%' OR memo like '%@search%') {endif @search}
                    {if @sort}order by {{@sort}}{endif}
                    {if @page}limit {{@limit}} offset {{@offset}}{endif @page}
                    {if !@page}limit 50 offset 0{endif !@page}
                 `
        case "delete":
          return `
          delete * from sys_options
          where {if id} id={{id}}  {endif id}
                    {if no} and no={{no}} {endif no}
                    {if module} and module={{module}} {endif module}
                    {if name} and name={{name}} {endif name}
                    {if values} and values={{values}} {endif values}
                    {if type} and type={{type}} {endif type}
                    {if memo} and memo={{memo}} {endif memo}
                 `
        case "update":
          return `
          update sys_options set
                    {if no} no={{no}} {endif no}
                    {if module},module={{module}} {endif module}
                    {if name},name={{name}} {endif name}
                    {if values},values={{values}} {endif values}
                    {if type},type={{type}} {endif type}
                    {if memo},memo={{memo}} {endif memo}
          where id={{id}}
                 `
        case "insert":
          return `
          insert into sys_options(
                    {if no}no{endif no}
                    {if module},module{endif module}
                    {if name},name{endif name}
                    {if values},values{endif values}
                    {if type},type{endif type}
                    {if memo},memo{endif memo}) 
          values({if no}{{no}}{endif no}
                    {if module},{{module}}{endif module}
                    {if name},{{name}}{endif name}
                    {if values},{{values}}{endif values}
                    {if type},{{type}}{endif type}
                    {if memo},{{memo}}{endif memo})
                 `
      }
   }
}
module.exports=sys_options;