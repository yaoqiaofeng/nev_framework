const {sqlModel} = require("modelObject");
class usergroup_modules extends sqlModel{
   static name(){
      return "usergroup_modules";
   }

   static sql(op){
      switch(op){
        case "select":
          return `
          select * from usergroup_modules
          where 1=1 
                    {if id} and id={{id}}{endif id}
                    {if ugid} and ugid={{ugid}}{endif ugid}
                    {if typeid} and typeid={{typeid}}{endif typeid}
                    {if @sort}order by {{@sort}}{endif}
                    {if @page}limit {{@limit}} offset {{@offset}}{endif @page}
                    {if !@page}limit 50 offset 0{endif !@page}
                 `
        case "delete":
          return `
          delete * from usergroup_modules
          where {if id} id={{id}}  {endif id}
                    {if ugid} and ugid={{ugid}} {endif ugid}
                    {if typeid} and typeid={{typeid}} {endif typeid}
                 `
        case "update":
          return `
          update usergroup_modules set
                    {if ugid} ugid={{ugid}} {endif ugid}
                    {if typeid},typeid={{typeid}} {endif typeid}
          where id={{id}}
                 `
        case "insert":
          return `
          insert into usergroup_modules(
                    {if ugid}ugid{endif ugid}
                    {if typeid},typeid{endif typeid}) 
          values({if ugid}{{ugid}}{endif ugid}
                    {if typeid},{{typeid}}{endif typeid})
                 `
      }
   }
}
module.exports=usergroup_modules;