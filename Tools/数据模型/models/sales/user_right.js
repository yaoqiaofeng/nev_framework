const {sqlModel} = require("modelObject");
class user_right extends sqlModel{
   static name(){
      return "user_right";
   }

   static sql(op){
      switch(op){
        case "select":
          return `
          select * from user_right
          where 1=1 
                    {if id} and id={{id}}{endif id}
                    {if userid} and userid={{userid}}{endif userid}
                    {if pid} and pid={{pid}}{endif pid}
                    {if right} and right={{right}}{endif right}
                    {if @search} and (right like '%@search%') {endif @search}
                    {if @sort}order by {{@sort}}{endif}
                    {if @page}limit {{@limit}} offset {{@offset}}{endif @page}
                    {if !@page}limit 50 offset 0{endif !@page}
                 `
        case "delete":
          return `
          delete * from user_right
          where {if id} id={{id}}  {endif id}
                    {if userid} and userid={{userid}} {endif userid}
                    {if pid} and pid={{pid}} {endif pid}
                    {if right} and right={{right}} {endif right}
                 `
        case "update":
          return `
          update user_right set
                    {if userid} userid={{userid}} {endif userid}
                    {if pid},pid={{pid}} {endif pid}
                    {if right},right={{right}} {endif right}
          where id={{id}}
                 `
        case "insert":
          return `
          insert into user_right(
                    {if userid}userid{endif userid}
                    {if pid},pid{endif pid}
                    {if right},right{endif right}) 
          values({if userid}{{userid}}{endif userid}
                    {if pid},{{pid}}{endif pid}
                    {if right},{{right}}{endif right})
                 `
      }
   }
}
module.exports=user_right;