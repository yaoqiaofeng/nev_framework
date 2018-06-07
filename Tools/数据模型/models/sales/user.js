const {sqlModel} = require("modelObject");
class user extends sqlModel{
   static name(){
      return "user";
   }

   static sql(op){
      switch(op){
        case "select":
          return `
          select * from user
          where 1=1 
                    {if id} and id={{id}}{endif id}
                    {if group_id} and group_id={{group_id}}{endif group_id}
                    {if username} and username={{username}}{endif username}
                    {if password} and password={{password}}{endif password}
                    {if name} and name={{name}}{endif name}
                    {if tel} and tel={{tel}}{endif tel}
                    {if email} and email={{email}}{endif email}
                    {if type} and type={{type}}{endif type}
                    {if wx_openId} and wx_openId={{wx_openId}}{endif wx_openId}
                    {if image} and image={{image}}{endif image}
                    {if @search} and (username like '%@search%' OR password like '%@search%' OR name like '%@search%' OR tel like '%@search%' OR email like '%@search%' OR wx_openId like '%@search%' OR image like '%@search%') {endif @search}
                    {if @sort}order by {{@sort}}{endif}
                    {if @page}limit {{@limit}} offset {{@offset}}{endif @page}
                    {if !@page}limit 50 offset 0{endif !@page}
                 `
        case "delete":
          return `
          delete * from user
          where {if id} id={{id}}  {endif id}
                    {if group_id} and group_id={{group_id}} {endif group_id}
                    {if username} and username={{username}} {endif username}
                    {if password} and password={{password}} {endif password}
                    {if name} and name={{name}} {endif name}
                    {if tel} and tel={{tel}} {endif tel}
                    {if email} and email={{email}} {endif email}
                    {if type} and type={{type}} {endif type}
                    {if wx_openId} and wx_openId={{wx_openId}} {endif wx_openId}
                    {if image} and image={{image}} {endif image}
                 `
        case "update":
          return `
          update user set
                    {if group_id} group_id={{group_id}} {endif group_id}
                    {if username},username={{username}} {endif username}
                    {if password},password={{password}} {endif password}
                    {if name},name={{name}} {endif name}
                    {if tel},tel={{tel}} {endif tel}
                    {if email},email={{email}} {endif email}
                    {if type},type={{type}} {endif type}
                    {if wx_openId},wx_openId={{wx_openId}} {endif wx_openId}
                    {if image},image={{image}} {endif image}
          where id={{id}}
                 `
        case "insert":
          return `
          insert into user(
                    {if group_id}group_id{endif group_id}
                    {if username},username{endif username}
                    {if password},password{endif password}
                    {if name},name{endif name}
                    {if tel},tel{endif tel}
                    {if email},email{endif email}
                    {if type},type{endif type}
                    {if wx_openId},wx_openId{endif wx_openId}
                    {if image},image{endif image}) 
          values({if group_id}{{group_id}}{endif group_id}
                    {if username},{{username}}{endif username}
                    {if password},{{password}}{endif password}
                    {if name},{{name}}{endif name}
                    {if tel},{{tel}}{endif tel}
                    {if email},{{email}}{endif email}
                    {if type},{{type}}{endif type}
                    {if wx_openId},{{wx_openId}}{endif wx_openId}
                    {if image},{{image}}{endif image})
                 `
      }
   }
}
module.exports=user;