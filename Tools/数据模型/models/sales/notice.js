const {sqlModel} = require("modelObject");
class notice extends sqlModel{
   static name(){
      return "notice";
   }

   static sql(op){
      switch(op){
        case "select":
          return `
          select * from notice
          where 1=1 
                    {if id} and id={{id}}{endif id}
                    {if title} and title={{title}}{endif title}
                    {if date} and date={{date}}{endif date}
                    {if content} and content={{content}}{endif content}
                    {if valid} and valid={{valid}}{endif valid}
                    {if audit} and audit={{audit}}{endif audit}
                    {if @search} and (title like '%@search%' OR content like '%@search%') {endif @search}
                    {if @sort}order by {{@sort}}{endif}
                    {if @page}limit {{@limit}} offset {{@offset}}{endif @page}
                    {if !@page}limit 50 offset 0{endif !@page}
                 `
        case "delete":
          return `
          delete * from notice
          where {if id} id={{id}}  {endif id}
                    {if title} and title={{title}} {endif title}
                    {if date} and date={{date}} {endif date}
                    {if content} and content={{content}} {endif content}
                    {if valid} and valid={{valid}} {endif valid}
                    {if audit} and audit={{audit}} {endif audit}
                 `
        case "update":
          return `
          update notice set
                    {if title} title={{title}} {endif title}
                    {if date},date={{date}} {endif date}
                    {if content},content={{content}} {endif content}
                    {if valid},valid={{valid}} {endif valid}
                    {if audit},audit={{audit}} {endif audit}
          where id={{id}}
                 `
        case "insert":
          return `
          insert into notice(
                    {if title}title{endif title}
                    {if date},date{endif date}
                    {if content},content{endif content}
                    {if valid},valid{endif valid}
                    {if audit},audit{endif audit}) 
          values({if title}{{title}}{endif title}
                    {if date},{{date}}{endif date}
                    {if content},{{content}}{endif content}
                    {if valid},{{valid}}{endif valid}
                    {if audit},{{audit}}{endif audit})
                 `
      }
   }
}
module.exports=notice;