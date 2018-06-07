const {sqlModel} = require("modelObject");
class member extends sqlModel{
   static name(){
      return "member";
   }

   static sql(op){
      switch(op){
        case "select":
          return `
          select * from member
          where 1=1 
                    {if id} and id={{id}}{endif id}
                    {if audit} and audit={{audit}}{endif audit}
                    {if highid} and highid={{highid}}{endif highid}
                    {if code} and code={{code}}{endif code}
                    {if name} and name={{name}}{endif name}
                    {if py} and py={{py}}{endif py}
                    {if line} and line={{line}}{endif line}
                    {if levid} and levid={{levid}}{endif levid}
                    {if indate} and indate={{indate}}{endif indate}
                    {if idcode} and idcode={{idcode}}{endif idcode}
                    {if email} and email={{email}}{endif email}
                    {if bank} and bank={{bank}}{endif bank}
                    {if account} and account={{account}}{endif account}
                    {if phone} and phone={{phone}}{endif phone}
                    {if linkphone} and linkphone={{linkphone}}{endif linkphone}
                    {if province} and province={{province}}{endif province}
                    {if city} and city={{city}}{endif city}
                    {if address} and address={{address}}{endif address}
                    {if memo} and memo={{memo}}{endif memo}
                    {if image} and image={{image}}{endif image}
                    {if @search} and (code like '%@search%' OR name like '%@search%' OR py like '%@search%' OR line like '%@search%' OR idcode like '%@search%' OR email like '%@search%' OR bank like '%@search%' OR account like '%@search%' OR phone like '%@search%' OR linkphone like '%@search%' OR province like '%@search%' OR city like '%@search%' OR address like '%@search%' OR memo like '%@search%' OR image like '%@search%') {endif @search}
                    {if @sort}order by {{@sort}}{endif}
                    {if @page}limit {{@limit}} offset {{@offset}}{endif @page}
                    {if !@page}limit 50 offset 0{endif !@page}
                 `
        case "delete":
          return `
          delete * from member
          where {if id} id={{id}}  {endif id}
                    {if audit} and audit={{audit}} {endif audit}
                    {if highid} and highid={{highid}} {endif highid}
                    {if code} and code={{code}} {endif code}
                    {if name} and name={{name}} {endif name}
                    {if py} and py={{py}} {endif py}
                    {if line} and line={{line}} {endif line}
                    {if levid} and levid={{levid}} {endif levid}
                    {if indate} and indate={{indate}} {endif indate}
                    {if idcode} and idcode={{idcode}} {endif idcode}
                    {if email} and email={{email}} {endif email}
                    {if bank} and bank={{bank}} {endif bank}
                    {if account} and account={{account}} {endif account}
                    {if phone} and phone={{phone}} {endif phone}
                    {if linkphone} and linkphone={{linkphone}} {endif linkphone}
                    {if province} and province={{province}} {endif province}
                    {if city} and city={{city}} {endif city}
                    {if address} and address={{address}} {endif address}
                    {if memo} and memo={{memo}} {endif memo}
                    {if image} and image={{image}} {endif image}
                 `
        case "update":
          return `
          update member set
                    {if audit} audit={{audit}} {endif audit}
                    {if highid},highid={{highid}} {endif highid}
                    {if code},code={{code}} {endif code}
                    {if name},name={{name}} {endif name}
                    {if py},py={{py}} {endif py}
                    {if line},line={{line}} {endif line}
                    {if levid},levid={{levid}} {endif levid}
                    {if indate},indate={{indate}} {endif indate}
                    {if idcode},idcode={{idcode}} {endif idcode}
                    {if email},email={{email}} {endif email}
                    {if bank},bank={{bank}} {endif bank}
                    {if account},account={{account}} {endif account}
                    {if phone},phone={{phone}} {endif phone}
                    {if linkphone},linkphone={{linkphone}} {endif linkphone}
                    {if province},province={{province}} {endif province}
                    {if city},city={{city}} {endif city}
                    {if address},address={{address}} {endif address}
                    {if memo},memo={{memo}} {endif memo}
                    {if image},image={{image}} {endif image}
          where id={{id}}
                 `
        case "insert":
          return `
          insert into member(
                    {if audit}audit{endif audit}
                    {if highid},highid{endif highid}
                    {if code},code{endif code}
                    {if name},name{endif name}
                    {if py},py{endif py}
                    {if line},line{endif line}
                    {if levid},levid{endif levid}
                    {if indate},indate{endif indate}
                    {if idcode},idcode{endif idcode}
                    {if email},email{endif email}
                    {if bank},bank{endif bank}
                    {if account},account{endif account}
                    {if phone},phone{endif phone}
                    {if linkphone},linkphone{endif linkphone}
                    {if province},province{endif province}
                    {if city},city{endif city}
                    {if address},address{endif address}
                    {if memo},memo{endif memo}
                    {if image},image{endif image}) 
          values({if audit}{{audit}}{endif audit}
                    {if highid},{{highid}}{endif highid}
                    {if code},{{code}}{endif code}
                    {if name},{{name}}{endif name}
                    {if py},{{py}}{endif py}
                    {if line},{{line}}{endif line}
                    {if levid},{{levid}}{endif levid}
                    {if indate},{{indate}}{endif indate}
                    {if idcode},{{idcode}}{endif idcode}
                    {if email},{{email}}{endif email}
                    {if bank},{{bank}}{endif bank}
                    {if account},{{account}}{endif account}
                    {if phone},{{phone}}{endif phone}
                    {if linkphone},{{linkphone}}{endif linkphone}
                    {if province},{{province}}{endif province}
                    {if city},{{city}}{endif city}
                    {if address},{{address}}{endif address}
                    {if memo},{{memo}}{endif memo}
                    {if image},{{image}}{endif image})
                 `
      }
   }
}
module.exports=member;