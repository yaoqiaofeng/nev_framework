const {sqlModel} = require("modelObject");
class sys_module extends sqlModel{
   static name(){
      return "sys_module";
   }

   static sql(op){
      switch(op){
        case "select":
          return `
          select * from sys_module
          where 1=1 
                    {if id} and id={{id}}{endif id}
                    {if no} and no={{no}}{endif no}
                    {if name} and name={{name}}{endif name}
                    {if @search} and (name like '%@search%') {endif @search}
                    {if @sort}order by {{@sort}}{endif}
                    {if @page}limit {{@limit}} offset {{@offset}}{endif @page}
                    {if !@page}limit 50 offset 0{endif !@page}
                 `
        case "delete":
          return `
          delete * from sys_module
          where {if id} id={{id}}  {endif id}
                    {if no} and no={{no}} {endif no}
                    {if name} and name={{name}} {endif name}
                 `
        case "update":
          return `
          update sys_module set
                    {if no} no={{no}} {endif no}
                    {if name},name={{name}} {endif name}
          where id={{id}}
                 `
        case "insert":
          return `
          insert into sys_module(
                    {if no}no{endif no}
                    {if name},name{endif name}) 
          values({if no}{{no}}{endif no}
                    {if name},{{name}}{endif name})
                 `
      }
   }
}
module.exports=sys_module;