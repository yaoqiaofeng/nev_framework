const {sqlModel} = require("modelObject");
class sys_modules extends sqlModel{
   static name(){
      return "sys_modules";
   }

   static sql(op){
      switch(op){
        case "select":
          return `
          select * from sys_modules
          where 1=1 
                    {if id} and id={{id}}{endif id}
                    {if classid} and classid={{classid}}{endif classid}
                    {if typeid} and typeid={{typeid}}{endif typeid}
                    {if no} and no={{no}}{endif no}
                    {if name} and name={{name}}{endif name}
                    {if ename} and ename={{ename}}{endif ename}
                    {if type} and type={{type}}{endif type}
                    {if prefit} and prefit={{prefit}}{endif prefit}
                    {if format} and format={{format}}{endif format}
                    {if hide} and hide={{hide}}{endif hide}
                    {if @search} and (name like '%@search%' OR ename like '%@search%' OR type like '%@search%' OR prefit like '%@search%' OR format like '%@search%') {endif @search}
                    {if @sort}order by {{@sort}}{endif}
                    {if @page}limit {{@limit}} offset {{@offset}}{endif @page}
                    {if !@page}limit 50 offset 0{endif !@page}
                 `
        case "delete":
          return `
          delete * from sys_modules
          where {if id} id={{id}}  {endif id}
                    {if classid} and classid={{classid}} {endif classid}
                    {if typeid} and typeid={{typeid}} {endif typeid}
                    {if no} and no={{no}} {endif no}
                    {if name} and name={{name}} {endif name}
                    {if ename} and ename={{ename}} {endif ename}
                    {if type} and type={{type}} {endif type}
                    {if prefit} and prefit={{prefit}} {endif prefit}
                    {if format} and format={{format}} {endif format}
                    {if hide} and hide={{hide}} {endif hide}
                 `
        case "update":
          return `
          update sys_modules set
                    {if classid} classid={{classid}} {endif classid}
                    {if typeid},typeid={{typeid}} {endif typeid}
                    {if no},no={{no}} {endif no}
                    {if name},name={{name}} {endif name}
                    {if ename},ename={{ename}} {endif ename}
                    {if type},type={{type}} {endif type}
                    {if prefit},prefit={{prefit}} {endif prefit}
                    {if format},format={{format}} {endif format}
                    {if hide},hide={{hide}} {endif hide}
          where id={{id}}
                 `
        case "insert":
          return `
          insert into sys_modules(
                    {if classid}classid{endif classid}
                    {if typeid},typeid{endif typeid}
                    {if no},no{endif no}
                    {if name},name{endif name}
                    {if ename},ename{endif ename}
                    {if type},type{endif type}
                    {if prefit},prefit{endif prefit}
                    {if format},format{endif format}
                    {if hide},hide{endif hide}) 
          values({if classid}{{classid}}{endif classid}
                    {if typeid},{{typeid}}{endif typeid}
                    {if no},{{no}}{endif no}
                    {if name},{{name}}{endif name}
                    {if ename},{{ename}}{endif ename}
                    {if type},{{type}}{endif type}
                    {if prefit},{{prefit}}{endif prefit}
                    {if format},{{format}}{endif format}
                    {if hide},{{hide}}{endif hide})
                 `
      }
   }
}
module.exports=sys_modules;