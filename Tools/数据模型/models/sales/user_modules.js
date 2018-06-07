const {sqlModel} = require("modelObject");
class user_modules extends sqlModel{
   static name(){
      return "user_modules";
   }

   static sql(op){
      switch(op){
        case "select":
          return `
          select * from user_modules
          where 1=1 
                    {if id} and id={{id}}{endif id}
                    {if userid} and userid={{userid}}{endif userid}
                    {if typeid} and typeid={{typeid}}{endif typeid}
                    {if @sort}order by {{@sort}}{endif}
                    {if @page}limit {{@limit}} offset {{@offset}}{endif @page}
                    {if !@page}limit 50 offset 0{endif !@page}
                 `
        case "delete":
          return `
          delete * from user_modules
          where {if id} id={{id}}  {endif id}
                    {if userid} and userid={{userid}} {endif userid}
                    {if typeid} and typeid={{typeid}} {endif typeid}
                 `
        case "update":
          return `
          update user_modules set
                    {if userid} userid={{userid}} {endif userid}
                    {if typeid},typeid={{typeid}} {endif typeid}
          where id={{id}}
                 `
        case "insert":
          return `
          insert into user_modules(
                    {if userid}userid{endif userid}
                    {if typeid},typeid{endif typeid}) 
          values({if userid}{{userid}}{endif userid}
                    {if typeid},{{typeid}}{endif typeid})
                 `
      }
   }
}
module.exports=user_modules;