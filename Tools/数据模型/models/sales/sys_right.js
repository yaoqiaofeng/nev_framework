const {sqlModel} = require("modelObject");
class sys_right extends sqlModel{
   static name(){
      return "sys_right";
   }

   static sql(op){
      switch(op){
        case "select":
          return `
          select * from sys_right
          where 1=1 
                    {if id} and id={{id}}{endif id}
                    {if pid} and pid={{pid}}{endif pid}
                    {if pno} and pno={{pno}}{endif pno}
                    {if name} and name={{name}}{endif name}
                    {if ename} and ename={{ename}}{endif ename}
                    {if no} and no={{no}}{endif no}
                    {if rightname} and rightname={{rightname}}{endif rightname}
                    {if erightname} and erightname={{erightname}}{endif erightname}
                    {if @search} and (name like '%@search%' OR ename like '%@search%' OR rightname like '%@search%' OR erightname like '%@search%') {endif @search}
                    {if @sort}order by {{@sort}}{endif}
                    {if @page}limit {{@limit}} offset {{@offset}}{endif @page}
                    {if !@page}limit 50 offset 0{endif !@page}
                 `
        case "delete":
          return `
          delete * from sys_right
          where {if id} id={{id}}  {endif id}
                    {if pid} and pid={{pid}} {endif pid}
                    {if pno} and pno={{pno}} {endif pno}
                    {if name} and name={{name}} {endif name}
                    {if ename} and ename={{ename}} {endif ename}
                    {if no} and no={{no}} {endif no}
                    {if rightname} and rightname={{rightname}} {endif rightname}
                    {if erightname} and erightname={{erightname}} {endif erightname}
                 `
        case "update":
          return `
          update sys_right set
                    {if pid} pid={{pid}} {endif pid}
                    {if pno},pno={{pno}} {endif pno}
                    {if name},name={{name}} {endif name}
                    {if ename},ename={{ename}} {endif ename}
                    {if no},no={{no}} {endif no}
                    {if rightname},rightname={{rightname}} {endif rightname}
                    {if erightname},erightname={{erightname}} {endif erightname}
          where id={{id}}
                 `
        case "insert":
          return `
          insert into sys_right(
                    {if pid}pid{endif pid}
                    {if pno},pno{endif pno}
                    {if name},name{endif name}
                    {if ename},ename{endif ename}
                    {if no},no{endif no}
                    {if rightname},rightname{endif rightname}
                    {if erightname},erightname{endif erightname}) 
          values({if pid}{{pid}}{endif pid}
                    {if pno},{{pno}}{endif pno}
                    {if name},{{name}}{endif name}
                    {if ename},{{ename}}{endif ename}
                    {if no},{{no}}{endif no}
                    {if rightname},{{rightname}}{endif rightname}
                    {if erightname},{{erightname}}{endif erightname})
                 `
      }
   }
}
module.exports=sys_right;