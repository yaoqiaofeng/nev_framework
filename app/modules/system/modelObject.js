/**
 * 模型基本类
 */
const pinyin = require('pinyin');
const db = modules("db");
const cache =modules("cache");
const moment =require("moment");

/*
模型基本类，规定了五个方法
1.name 模型名称
2.select 获取模型数据
3.update 更改模型数据
4.insert 插入模型数据
5.delete 删除模型数据
*/
class BaseModel{

    static className(){
        return 'BaseModel'
    }

    static name(){        
        return "";
    }

    static router(id){
        if (id==this.name()){
            return this;
        }
    } 

    static async row(data, conn, options){
        let rows = await this.select(data, conn, options);
        return rows.length > 0? rows[0]:{};
    }

    static async select(data, conn, options){
    }
    static async update(data, conn, multi){
    }
    static async insert(data, conn, multi){
    }
    static async delete(data, conn, multi){
    }
}


class SqlModel extends BaseModel{

    static className(){
        return 'SqlModel'
    }

    static sql(op){
        /*
            示例：
            select * from inventory where 1=1 
        */    
        return ""
    }   

    static compile(sql, data, options = {}){
        sql = sql.replace('{{fields}}', options.fields||'*');

        //剔除不需要的部分
        if (options && options.search){
            sql = sql.replace(/{if\s+@search}/ig,'');
            sql = sql.replace(/{endif\s+@search}/ig,'');
            sql = sql.replace(/{if\s+!@search}[\w\W]+?{endif\s+!@search}/ig, '');
        }else{
            sql = sql.replace(/{if\s+!@search}/ig,'');
            sql = sql.replace(/{endif\s+!@search}/ig,'');
            sql = sql.replace(/{if\s+@search}[\w\W]+?{endif\s+@search}/ig, '');
        }
        if (options && options.sort){
            sql = sql.replace(/{if\s+@sort}/ig,'');
            sql = sql.replace(/{endif\s+@sort}/ig,'');
            sql = sql.replace(/{if\s+!@sort}[\w\W]+?{endif\s+!@sort}/ig, '');
        }else{
            sql = sql.replace(/{if\s+!@sort}/ig,'');
            sql = sql.replace(/{endif\s+!@sort}/ig,'');
            sql = sql.replace(/{if\s+@sort}[\w\W]+?{endif\s+@sort}/ig, '');
        }
        if (options && options.offset && options.limit){
            sql = sql.replace(/{if\s+@page}/ig,'');
            sql = sql.replace(/{endif\s+@page}/ig,'');
            sql = sql.replace(/{if\s+!@page}[\w\W]+?{endif\s+!@page}/ig, '');
        }else{
            sql = sql.replace(/{if\s+!@page}/ig,'');
            sql = sql.replace(/{endif\s+!@page}/ig,'');
            sql = sql.replace(/{if\s+@page}[\w\W]+?{endif\s+@page}/ig, '');
        }
        if (options && options.sql){
            sql = sql.replace(/{if\s+@sql}/ig,'');
            sql = sql.replace(/{endif\s+@sql}/ig,'');
        }else{
            sql = sql.replace(/{if\s+@sql}[\w\W]+?{endif\s+@sql}/ig, '');
        }
        let conditions = sql.match(/\{if\s+[^\}@]+\}/ig);
        for(let condition of conditions){
            let cond = condition.substr(4, condition.length-5);
            cond = cond.replace(/^\s*/gm,'');
            let not = false;
            if (cond[0]=='!'){
                not = true;
                cond = cond.substr(1);
            }
            if (data && (((cond in data) && !not) || (!(cond in data) && not))){
                sql = sql.replace(condition,'');
                condition = condition.replace('{if','{endif');
                sql = sql.replace(condition,'');
            } else {
                let start =  sql.search(condition);
                condition = condition.replace('{if','{endif');
                let end =  sql.search(condition);
                sql = sql.substring(0, start)+sql.substring(end+condition.length);
            }
        }

        //替换参数
        let fields = sql.match(/{{[^}]+}}/g) || [];
        let params = [];
        for(let field of fields){
            field = field.substr(2, field.length-4);
            if (field=='@search'){
                params.push(options.search);
                sql = sql.replace('{{'+field+'}}', field);
            }else if (field=='@sort'){
                if (db.valid(options.sort)) sql = sql.replace('{{'+field+'}}', options.sort);
            }else if (field=='@offset'){
                if (!isNaN(options.offset)) sql = sql.replace('{{'+field+'}}', options.offset);
            }else if (field=='@limit'){
                if (!isNaN(options.limit)) sql = sql.replace('{{'+field+'}}', options.limit);
            }else if (field=='@sql'){
                sql = sql.replace('{{'+field+'}}', options.sql);
            }else {             
                sql = sql.replace('{{'+field+'}}', db.param(field));
                params.push(data[field]);
            }
        }
        //删除前后空格
        sql = sql.replace(/^\s+|\s+$/g,'');
        //删除多余空格
        sql = sql.replace(/\s+/g,' ');
        //修正多余逗号问题
        sql = sql.replace(/\s+set\s+,/, " set ");
        //修正多余逗号问题
        sql = sql.replace(/\(\s+,/g, "("); 
        //修正多余and问题
        sql = sql.replace(/where\s+and/, "where ");   
        return {
            sql: sql,
            params : params
        }
    }

    static async count(data, conn, options){
        let sql = this.sql('select');
        let cmd = this.compile(sql, data, {
            search: options.search,            
            fields: "count(id) as row_count"
        });
        cmd.conn = conn;
        let rows = await db.query(cmd);
        if (rows.length>0){
            return rows[0].row_count
        } else {
            return 0;
        }
    }

    //SQL会增加分页和排序两个参数
    static async select(data, conn, options){
        let sql = this.sql('select');
        let cmd = this.compile(sql, data, options);
        cmd.conn = conn;
        let result = await db.query(cmd);
        return result;
    }

    static async update(data, conn, multi){
        let sql = this.sql('update');
        let cmd = this.compile(sql, data);   
        cmd.conn = conn;
        await db.exec(cmd);
    }

    static async insert(data, conn, multi){
        let sql = this.sql('insert');
        let cmd = this.compile(sql, data);
        cmd.conn = conn;
        let result =await db.exec(cmd);
        return db.insertId(result);
    }

    static async delete(data, conn, multi){
        let sql = this.sql('delete');
        let cmd = this.compile(sql, data);   
        cmd.conn = conn;
        await db.exec(cmd);
    }
}

class CacheModel extends BaseModel{

    static className(){
        return 'CacheModel'
    }

    //字段列表
    static fields(){
        return [];
    }

    //与字段对应的数据类型列表
    static types(){
        return [];
    }

    static async opened(){        
        let val = await cache.get(this.name());
        return val=='opened';
    }

    static async open(){
        if (await this.opened()){
            let all = [];
            all = await cache.model.getall(this.name());
            return all;
        } else {  
            let dataset= await db.query({ 
                sql:'select * from '+this.name()
            })
            await cache.model.setall(this.name(), dataset);
            await cache.set(this.name(), 'opened');
            return dataset;   
        }
    }

    static async select(data, conn,  options){  
        let rows = [];
        //如果有索引的，并且已经打开数据的，按索提取缓存数据
        if (data && data.id && (await this.opened())){
            let row = await cache.model.get(this.name(), data.id);
            rows = [row];
        } else {
            rows =  await this.open();
        }
        let fields = this.fields();
        let types = this.types();
        let currFields = [];
        let currTypes = [];
        //罗列可过滤的字段和字段类型
        for(let n in data){
            let index =  fields.indexOf(n);
            if (index!=-1){
                currFields.push(fields[index]);
                currTypes.push(types[index]);
            }
        }
        let result = [];
        //如果需要过滤
        if (currFields.length>0) {
            for(let row of rows){
                let match = true;
                for(let i=0; i<currFields.length; i++){
                    let v1 = row[currFields[i]];
                    let v2 = data[currFields[i]];
                    //字符串类型字段
                    if (currTypes[i]=='string'){
                        if (typeof v1=='string') v1 = v1.toUpperCase();
                        if (typeof v2=='string') v2 = v2.toUpperCase();
                    //整数类型
                    } else if (currTypes[i]=='int'){
                        v1 = parseInt(v1);
                        v2 = parseInt(v2);
                    //浮点数     
                    } else if (currTypes[i]=='float'){
                        v1 = parseFloat(v1);
                        v2 = parseFloat(v2);
                    //布尔类型    
                    } else if (currTypes[i]=='boolean'){
                        if (v2==="" || v2===null || v2===undefined){
                            continue;
                        }
                        v1 = (v1==1) || (v1=='true');
                        v2 = (v2==1) || (v2=='true');
                    //日期
                    } else if (currTypes[i]=='date'){
                        v1 = moment(v1).format('YYYY-MM-DD');
                        v2 = moment(v2).format('YYYY-MM-DD');
                    //日期时间
                    } else if (currTypes[i]=='datetime'){
                        v1 = moment(v1).format('YYYY-MM-DD hh:mm:ss');
                        v2 = moment(v2).format('YYYY-MM-DD hh:mm:ss');
                    }
                    if (v1!=v2){
                        match = false;
                        break;
                    }
                }
                if (match){
                    result.push(row);
                }
            }            
        } else {
            result = rows;
        }
        return result
    }


    static async update(data, conn, multi){
        let allField =this.fields();
        let fields = [];
        for(let i=0; i <allField.length ;i++){
            if (allField[i] in data){
                fields.push(allField[i]);
            }
        }
        let fieldValues = [];
        let sql = 'update '+this.name()+' set ';
        let item = {id: data.id};
        for(let i=0; i<fields.length; i++){
            fieldValues.push(data[fields[i]]);
            sql = i==0? sql : sql+',';
            sql = sql +db.separate(fields[i])+'='+db.param(fields[i]);
            item[fields[i]]=data[fields[i]];
        }
        sql = sql + ' where id='+db.param('id');
        fieldValues.push(data.id);
        let result =await db.exec({
            conn: conn,
            sql:sql, 
            params: fieldValues, 
        });
        if (await this.opened()){
            await cache.model.set(this.name(),item, multi);
        }
    }
    
    static async delete(data, conn, multi){
        if (data.id){
            await db.query({
                conn: conn,
                sql:'delete from '+this.name()+' where id='+db.param('id'),
                params:[data.id]
            });
            if (this.opened()){
                cache.model.del(this.name(), data.id, multi);
            }
        } else {                
            let fields = [];
            for(let field of this.fields()){
                if (field in data){
                    fields.push(field);
                }
            }
            let fieldValues = [];
            let sql = '';
            let item = {};
            for(let i=0; i<fields.length; i++){
                fieldValues.push(data[fields[i]]);
                sql = i==0? sql : sql+' and ';
                sql = sql +db.separate(fields[i])+'='+db.param(fields[i]);
                item[fields[i]]=data[fields[i]];
            }         
            let rows = await this.select(item);
            await db.exec({
                conn: conn,
                sql:'delete from '+this.name()+' where '+sql,
                params: fieldValues
            });       
            if (await this.opened()){
                for(let row of rows){
                    cache.model.del(this.name(), row.id, multi);
                }
            }
        }
     }
 
     static async insert(data, conn, multi){
        let fields = this.fields();
        let fieldValues = [];
        let sql = 'insert into '+this.name()+'(';
        let sqlvalue = "values(";
        let item = {};
        for(let i=0; i<fields.length; i++){
            let field = fields[i];
            if (data[field]==="" || data[field]===undefined || data[field]===null){
                continue;
            }
            fieldValues.push(data[fields[i]]);
            sql = i==0? sql : sql+',';
            sqlvalue = i==0? sqlvalue : sqlvalue+',';
            sql = sql +db.separate(fields[i]);
            sqlvalue = sqlvalue+db.param(fields[i]);
            item[fields[i]]=data[fields[i]];
        }        
        sql = sql+") "+sqlvalue+')';
        let result =await db.exec({
            conn: conn,
            sql:sql,
            params: fieldValues
        });
        item.id = db.insertId(result);        
        if (await this.opened()){
            await cache.model.set(this.name(), item, multi);
        }
        return item.id;      
    }
}

module.exports = {
    BaseModel,
    CacheModel,
    SqlModel
};