const {sqlModel} = require("modelObject");
class sal_sales_acc extends sqlModel{
   static name(){
      return "sal_sales_acc";
   }

   static sql(op){
      switch(op){
        case "select":
          return `
          select * from sal_sales_acc
          where 1=1 
                    {if id} and id={{id}}{endif id}
                    {if mem_id} and mem_id={{mem_id}}{endif mem_id}
                    {if line_1} and line_1={{line_1}}{endif line_1}
                    {if acc_1} and acc_1={{acc_1}}{endif acc_1}
                    {if rmg_1} and rmg_1={{rmg_1}}{endif rmg_1}
                    {if line_2} and line_2={{line_2}}{endif line_2}
                    {if acc_2} and acc_2={{acc_2}}{endif acc_2}
                    {if rmg_2} and rmg_2={{rmg_2}}{endif rmg_2}
                    {if acc_date} and acc_date={{acc_date}}{endif acc_date}
                    {if @sort}order by {{@sort}}{endif}
                    {if @page}limit {{@limit}} offset {{@offset}}{endif @page}
                    {if !@page}limit 50 offset 0{endif !@page}
                 `
        case "delete":
          return `
          delete * from sal_sales_acc
          where {if id} id={{id}}  {endif id}
                    {if mem_id} and mem_id={{mem_id}} {endif mem_id}
                    {if line_1} and line_1={{line_1}} {endif line_1}
                    {if acc_1} and acc_1={{acc_1}} {endif acc_1}
                    {if rmg_1} and rmg_1={{rmg_1}} {endif rmg_1}
                    {if line_2} and line_2={{line_2}} {endif line_2}
                    {if acc_2} and acc_2={{acc_2}} {endif acc_2}
                    {if rmg_2} and rmg_2={{rmg_2}} {endif rmg_2}
                    {if acc_date} and acc_date={{acc_date}} {endif acc_date}
                 `
        case "update":
          return `
          update sal_sales_acc set
                    {if mem_id} mem_id={{mem_id}} {endif mem_id}
                    {if line_1},line_1={{line_1}} {endif line_1}
                    {if acc_1},acc_1={{acc_1}} {endif acc_1}
                    {if rmg_1},rmg_1={{rmg_1}} {endif rmg_1}
                    {if line_2},line_2={{line_2}} {endif line_2}
                    {if acc_2},acc_2={{acc_2}} {endif acc_2}
                    {if rmg_2},rmg_2={{rmg_2}} {endif rmg_2}
                    {if acc_date},acc_date={{acc_date}} {endif acc_date}
          where id={{id}}
                 `
        case "insert":
          return `
          insert into sal_sales_acc(
                    {if mem_id}mem_id{endif mem_id}
                    {if line_1},line_1{endif line_1}
                    {if acc_1},acc_1{endif acc_1}
                    {if rmg_1},rmg_1{endif rmg_1}
                    {if line_2},line_2{endif line_2}
                    {if acc_2},acc_2{endif acc_2}
                    {if rmg_2},rmg_2{endif rmg_2}
                    {if acc_date},acc_date{endif acc_date}) 
          values({if mem_id}{{mem_id}}{endif mem_id}
                    {if line_1},{{line_1}}{endif line_1}
                    {if acc_1},{{acc_1}}{endif acc_1}
                    {if rmg_1},{{rmg_1}}{endif rmg_1}
                    {if line_2},{{line_2}}{endif line_2}
                    {if acc_2},{{acc_2}}{endif acc_2}
                    {if rmg_2},{{rmg_2}}{endif rmg_2}
                    {if acc_date},{{acc_date}}{endif acc_date})
                 `
      }
   }
}
module.exports=sal_sales_acc;