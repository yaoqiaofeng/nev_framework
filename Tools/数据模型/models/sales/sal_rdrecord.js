const {sqlModel} = require("modelObject");
class sal_rdrecord extends sqlModel{
   static name(){
      return "sal_rdrecord";
   }

   static sql(op){
      switch(op){
        case "select":
          return `
          select * from sal_rdrecord
          where 1=1 
                    {if id} and id={{id}}{endif id}
                    {if btid} and btid={{btid}}{endif btid}
                    {if audit} and audit={{audit}}{endif audit}
                    {if billno} and billno={{billno}}{endif billno}
                    {if date} and date={{date}}{endif date}
                    {if invid} and invid={{invid}}{endif invid}
                    {if qty} and qty={{qty}}{endif qty}
                    {if price} and price={{price}}{endif price}
                    {if money} and money={{money}}{endif money}
                    {if mbprice} and mbprice={{mbprice}}{endif mbprice}
                    {if mbmoney} and mbmoney={{mbmoney}}{endif mbmoney}
                    {if salid} and salid={{salid}}{endif salid}
                    {if serid} and serid={{serid}}{endif serid}
                    {if line} and line={{line}}{endif line}
                    {if buycode} and buycode={{buycode}}{endif buycode}
                    {if buyname} and buyname={{buyname}}{endif buyname}
                    {if idcode} and idcode={{idcode}}{endif idcode}
                    {if email} and email={{email}}{endif email}
                    {if bank} and bank={{bank}}{endif bank}
                    {if account} and account={{account}}{endif account}
                    {if phone} and phone={{phone}}{endif phone}
                    {if linkphone} and linkphone={{linkphone}}{endif linkphone}
                    {if province} and province={{province}}{endif province}
                    {if city} and city={{city}}{endif city}
                    {if address} and address={{address}}{endif address}
                    {if wnum} and wnum={{wnum}}{endif wnum}
                    {if fixdate} and fixdate={{fixdate}}{endif fixdate}
                    {if actid} and actid={{actid}}{endif actid}
                    {if fixid} and fixid={{fixid}}{endif fixid}
                    {if repid} and repid={{repid}}{endif repid}
                    {if lock} and lock={{lock}}{endif lock}
                    {if lockcount} and lockcount={{lockcount}}{endif lockcount}
                    {if auditname} and auditname={{auditname}}{endif auditname}
                    {if auditdate} and auditdate={{auditdate}}{endif auditdate}
                    {if lastdate} and lastdate={{lastdate}}{endif lastdate}
                    {if mkname} and mkname={{mkname}}{endif mkname}
                    {if @search} and (billno like '%@search%' OR line like '%@search%' OR buycode like '%@search%' OR buyname like '%@search%' OR idcode like '%@search%' OR email like '%@search%' OR bank like '%@search%' OR account like '%@search%' OR phone like '%@search%' OR linkphone like '%@search%' OR province like '%@search%' OR city like '%@search%' OR address like '%@search%' OR repid like '%@search%' OR auditname like '%@search%' OR mkname like '%@search%') {endif @search}
                    {if @sort}order by {{@sort}}{endif}
                    {if @page}limit {{@limit}} offset {{@offset}}{endif @page}
                    {if !@page}limit 50 offset 0{endif !@page}
                 `
        case "delete":
          return `
          delete * from sal_rdrecord
          where {if id} id={{id}}  {endif id}
                    {if btid} and btid={{btid}} {endif btid}
                    {if audit} and audit={{audit}} {endif audit}
                    {if billno} and billno={{billno}} {endif billno}
                    {if date} and date={{date}} {endif date}
                    {if invid} and invid={{invid}} {endif invid}
                    {if qty} and qty={{qty}} {endif qty}
                    {if price} and price={{price}} {endif price}
                    {if money} and money={{money}} {endif money}
                    {if mbprice} and mbprice={{mbprice}} {endif mbprice}
                    {if mbmoney} and mbmoney={{mbmoney}} {endif mbmoney}
                    {if salid} and salid={{salid}} {endif salid}
                    {if serid} and serid={{serid}} {endif serid}
                    {if line} and line={{line}} {endif line}
                    {if buycode} and buycode={{buycode}} {endif buycode}
                    {if buyname} and buyname={{buyname}} {endif buyname}
                    {if idcode} and idcode={{idcode}} {endif idcode}
                    {if email} and email={{email}} {endif email}
                    {if bank} and bank={{bank}} {endif bank}
                    {if account} and account={{account}} {endif account}
                    {if phone} and phone={{phone}} {endif phone}
                    {if linkphone} and linkphone={{linkphone}} {endif linkphone}
                    {if province} and province={{province}} {endif province}
                    {if city} and city={{city}} {endif city}
                    {if address} and address={{address}} {endif address}
                    {if wnum} and wnum={{wnum}} {endif wnum}
                    {if fixdate} and fixdate={{fixdate}} {endif fixdate}
                    {if actid} and actid={{actid}} {endif actid}
                    {if fixid} and fixid={{fixid}} {endif fixid}
                    {if repid} and repid={{repid}} {endif repid}
                    {if lock} and lock={{lock}} {endif lock}
                    {if lockcount} and lockcount={{lockcount}} {endif lockcount}
                    {if auditname} and auditname={{auditname}} {endif auditname}
                    {if auditdate} and auditdate={{auditdate}} {endif auditdate}
                    {if lastdate} and lastdate={{lastdate}} {endif lastdate}
                    {if mkname} and mkname={{mkname}} {endif mkname}
                 `
        case "update":
          return `
          update sal_rdrecord set
                    {if btid} btid={{btid}} {endif btid}
                    {if audit},audit={{audit}} {endif audit}
                    {if billno},billno={{billno}} {endif billno}
                    {if date},date={{date}} {endif date}
                    {if invid},invid={{invid}} {endif invid}
                    {if qty},qty={{qty}} {endif qty}
                    {if price},price={{price}} {endif price}
                    {if money},money={{money}} {endif money}
                    {if mbprice},mbprice={{mbprice}} {endif mbprice}
                    {if mbmoney},mbmoney={{mbmoney}} {endif mbmoney}
                    {if salid},salid={{salid}} {endif salid}
                    {if serid},serid={{serid}} {endif serid}
                    {if line},line={{line}} {endif line}
                    {if buycode},buycode={{buycode}} {endif buycode}
                    {if buyname},buyname={{buyname}} {endif buyname}
                    {if idcode},idcode={{idcode}} {endif idcode}
                    {if email},email={{email}} {endif email}
                    {if bank},bank={{bank}} {endif bank}
                    {if account},account={{account}} {endif account}
                    {if phone},phone={{phone}} {endif phone}
                    {if linkphone},linkphone={{linkphone}} {endif linkphone}
                    {if province},province={{province}} {endif province}
                    {if city},city={{city}} {endif city}
                    {if address},address={{address}} {endif address}
                    {if wnum},wnum={{wnum}} {endif wnum}
                    {if fixdate},fixdate={{fixdate}} {endif fixdate}
                    {if actid},actid={{actid}} {endif actid}
                    {if fixid},fixid={{fixid}} {endif fixid}
                    {if repid},repid={{repid}} {endif repid}
                    {if lock},lock={{lock}} {endif lock}
                    {if lockcount},lockcount={{lockcount}} {endif lockcount}
                    {if auditname},auditname={{auditname}} {endif auditname}
                    {if auditdate},auditdate={{auditdate}} {endif auditdate}
                    {if lastdate},lastdate={{lastdate}} {endif lastdate}
                    {if mkname},mkname={{mkname}} {endif mkname}
          where id={{id}}
                 `
        case "insert":
          return `
          insert into sal_rdrecord(
                    {if btid}btid{endif btid}
                    {if audit},audit{endif audit}
                    {if billno},billno{endif billno}
                    {if date},date{endif date}
                    {if invid},invid{endif invid}
                    {if qty},qty{endif qty}
                    {if price},price{endif price}
                    {if money},money{endif money}
                    {if mbprice},mbprice{endif mbprice}
                    {if mbmoney},mbmoney{endif mbmoney}
                    {if salid},salid{endif salid}
                    {if serid},serid{endif serid}
                    {if line},line{endif line}
                    {if buycode},buycode{endif buycode}
                    {if buyname},buyname{endif buyname}
                    {if idcode},idcode{endif idcode}
                    {if email},email{endif email}
                    {if bank},bank{endif bank}
                    {if account},account{endif account}
                    {if phone},phone{endif phone}
                    {if linkphone},linkphone{endif linkphone}
                    {if province},province{endif province}
                    {if city},city{endif city}
                    {if address},address{endif address}
                    {if wnum},wnum{endif wnum}
                    {if fixdate},fixdate{endif fixdate}
                    {if actid},actid{endif actid}
                    {if fixid},fixid{endif fixid}
                    {if repid},repid{endif repid}
                    {if lock},lock{endif lock}
                    {if lockcount},lockcount{endif lockcount}
                    {if auditname},auditname{endif auditname}
                    {if auditdate},auditdate{endif auditdate}
                    {if lastdate},lastdate{endif lastdate}
                    {if mkname},mkname{endif mkname}) 
          values({if btid}{{btid}}{endif btid}
                    {if audit},{{audit}}{endif audit}
                    {if billno},{{billno}}{endif billno}
                    {if date},{{date}}{endif date}
                    {if invid},{{invid}}{endif invid}
                    {if qty},{{qty}}{endif qty}
                    {if price},{{price}}{endif price}
                    {if money},{{money}}{endif money}
                    {if mbprice},{{mbprice}}{endif mbprice}
                    {if mbmoney},{{mbmoney}}{endif mbmoney}
                    {if salid},{{salid}}{endif salid}
                    {if serid},{{serid}}{endif serid}
                    {if line},{{line}}{endif line}
                    {if buycode},{{buycode}}{endif buycode}
                    {if buyname},{{buyname}}{endif buyname}
                    {if idcode},{{idcode}}{endif idcode}
                    {if email},{{email}}{endif email}
                    {if bank},{{bank}}{endif bank}
                    {if account},{{account}}{endif account}
                    {if phone},{{phone}}{endif phone}
                    {if linkphone},{{linkphone}}{endif linkphone}
                    {if province},{{province}}{endif province}
                    {if city},{{city}}{endif city}
                    {if address},{{address}}{endif address}
                    {if wnum},{{wnum}}{endif wnum}
                    {if fixdate},{{fixdate}}{endif fixdate}
                    {if actid},{{actid}}{endif actid}
                    {if fixid},{{fixid}}{endif fixid}
                    {if repid},{{repid}}{endif repid}
                    {if lock},{{lock}}{endif lock}
                    {if lockcount},{{lockcount}}{endif lockcount}
                    {if auditname},{{auditname}}{endif auditname}
                    {if auditdate},{{auditdate}}{endif auditdate}
                    {if lastdate},{{lastdate}}{endif lastdate}
                    {if mkname},{{mkname}}{endif mkname})
                 `
      }
   }
}
module.exports=sal_rdrecord;