const {sqlModel} = require("modelObject");
class usergroup_right extends sqlModel{
   static name(){
      return "usergroup_right";
   }

   static sql(op){
      switch(op){
        case "select":
          return `
          select * from usergroup_right
          where 1=1 
                    {if id} and id={{id}}{endif id}
                    {if ugid} and ugid={{ugid}}{endif ugid}
                    {if pid} and pid={{pid}}{endif pid}
                    {if right} and right={{right}}{endif right}
                    {if @search} and (right like '%@search%') {endif @search}
                    {if @sort}order by {{@sort}}{endif}
                    {if @page}limit {{@limit}} offset {{@offset}}{endif @page}
                    {if !@page}limit 50 offset 0{endif !@page}
                 `
        case "delete":
          return `
          delete * from usergroup_right
          where {if id} id={{id}}  {endif id}
                    {if ugid} and ugid={{ugid}} {endif ugid}
                    {if pid} and pid={{pid}} {endif pid}
                    {if right} and right={{right}} {endif right}
                 `
        case "update":
          return `
          update usergroup_right set
                    {if ugid} ugid={{ugid}} {endif ugid}
                    {if pid},pid={{pid}} {endif pid}
                    {if right},right={{right}} {endif right}
          where id={{id}}
                 `
        case "insert":
          return `
          insert into usergroup_right(
                    {if ugid}ugid{endif ugid}
                    {if pid},pid{endif pid}
                    {if right},right{endif right}) 
          values({if ugid}{{ugid}}{endif ugid}
                    {if pid},{{pid}}{endif pid}
                    {if right},{{right}}{endif right})
                 `
      }
   }
}
module.exports=usergroup_right;