const {sqlModel} = require("modelObject");
class help_member_low extends sqlModel{
   static name(){
      return "help_member_low";
   }

   static sql(op){
      switch(op){
        case "select":
          return `
          select * from help_member_low
          where 1=1 
                    {if id} and id={{id}}{endif id}
                    {if mem_id} and mem_id={{mem_id}}{endif mem_id}
                    {if user_id} and user_id={{user_id}}{endif user_id}
                    {if @sort}order by {{@sort}}{endif}
                    {if @page}limit {{@limit}} offset {{@offset}}{endif @page}
                    {if !@page}limit 50 offset 0{endif !@page}
                 `
        case "delete":
          return `
          delete * from help_member_low
          where {if id} id={{id}}  {endif id}
                    {if mem_id} and mem_id={{mem_id}} {endif mem_id}
                    {if user_id} and user_id={{user_id}} {endif user_id}
                 `
        case "update":
          return `
          update help_member_low set
                    {if mem_id} mem_id={{mem_id}} {endif mem_id}
                    {if user_id},user_id={{user_id}} {endif user_id}
          where id={{id}}
                 `
        case "insert":
          return `
          insert into help_member_low(
                    {if mem_id}mem_id{endif mem_id}
                    {if user_id},user_id{endif user_id}) 
          values({if mem_id}{{mem_id}}{endif mem_id}
                    {if user_id},{{user_id}}{endif user_id})
                 `
      }
   }
}
module.exports=help_member_low;