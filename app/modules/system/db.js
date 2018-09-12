/*
 *   数据库模块
 * */
class db{

    /**
     *
     *
     * @static
     * @param {object} data 属性transaction: 是否开启事务
     * @memberof db
     * @returns 返回值为数据库连接
     */
    static begin(data){

    }

    /**
     * 
     * @param {object} data 
     */
    static end(data){

    }

    /**
     * 
     * @param {object} data 
     */
    static commit(data) {

    }

    /**
     * 
     * @param {object} data 
     */
    static rollback(data) {

    }

    /**
     * 
     * @param {object} data 
     */
    static query(data) {

    }

    /**
     * 
     * @param {*} data 
     */
    static exec(data) {

    }

    static async quick(conn, sql, ...paramsValue) {
    }

    static async quickRow(conn, sql, ...paramsValue) {
    }

    static async quickCol(conn, sql, ...paramsValue) {
    }

    static async quickExec(conn, sql, ...paramsValue) {
    }

    static async quickIs(conn, sql, ...paramsValue) {      
    }
    
    /**
     * 
     * @param {*} data 
     */
    static insertId(data){

    }

    /**
     * 
     * @param {*} name 
     */
    static separate(name){

    }

    /**
     * 
     * @param {*} name 
     */
    static param(name){

    }

    //sql注入验证
    static valid(sql){
        let  reg = /select|update|delete|exec|count|'|"|=|;|>|<|%/i;
        return !reg.test(sql);
    }
}

function GetMySQL(){
    const mysql = require('mysql');
    let pool = null;
    class mysql_db extends db{

        static init(){	
            pool = mysql.createPool(configs.db.mysql);
        }

        static begin(data) {
            return new Promise(async (resolve, reject)=>{
                pool.getConnection(function(err, connection) {
                    if (err) { 
                        reject(err);
                    } else if (data.transaction){
                        connection.beginTransaction(function(err) {
                            if (err) { 
                                reject(err);
                            } else {
                                resolve(connection);
                            }
                        });
                    } else {
                        resolve(connection);
                    }
                });
            });
        }

        static end(data) {
            return new Promise(async (resolve, reject)=>{
                data.conn.release();
                 resolve();
            });
        }

        static commit(data) {
            return new Promise(async (resolve, reject)=>{
                    data.commit(function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                        data.conn.release();
                    });
            });
        }

        static rollback(data) {
            return new Promise(async (resolve, reject)=>{
                    data.rollback(function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                        data.conn.release();
                    });
            });
        }

        static query(data) {
            return new Promise(async (resolve, reject)=>{
                let conn = pool;
                if (data.conn) {
                    conn = data.conn;
                }
                let query = conn.query(data.sql,data.params,  function(err, result, fields) {
                    if (err) {
                        reject(err.Error); 
                    } else {
                        resolve(result);
                    }
                }); 
            });
        }

        static exec(data) {
            return new Promise(async (resolve, reject)=>{
                let conn = pool;
                if (data.conn) {
                    conn = data.conn;
                }
                let query = conn.query(data.sql,data.params,  function(err, result, fields) {
                    if (err) {
                        reject(err.Error); 
                    } else {
                        resolve(result);
                    }
                }); 
            });
        }

        static async quick(conn, sql, ...paramsValue) {
            if (typeof conn=='string'){
                paramsValue.unshift(sql);
                sql = conn;
                conn = null;
            }
            return await this.query({
                conn, 
                sql,
                params: paramsValue 
            });
        }
    
        static async quickRow(conn, sql, ...paramsValue) {
            if (typeof conn=='string'){
                paramsValue.unshift(sql);
                sql = conn;
                conn = null;
            }
            let rows = await this.query({
                conn, 
                sql,
                params: paramsValue 
            });
            return rows[0] || {};
        }
    
        static async quickCol(conn, sql, ...paramsValue) {
            if (typeof conn=='string'){
                paramsValue.unshift(sql);
                sql = conn;
                conn = null;
            }
            let rows = await this.query({
                conn, 
                sql,
                params: paramsValue 
            });
            let cols = rows[0] || {};
            return Object.values(cols)[0] || null
        }
    
        static async quickExec(conn, sql, ...paramsValue) {
            if (typeof conn=='string'){
                paramsValue.unshift(sql);
                sql = conn;
                conn = null;
            }
            return await this.exec({
                conn, 
                sql,
                params: paramsValue 
            });
        }
    
        static async quickIs(conn, sql, ...paramsValue) {            
            if (typeof conn=='string'){
                paramsValue.unshift(sql);
                sql = conn;
                conn = null;
            }
            let rows = await this.query({
                conn, 
                sql,
                params: paramsValue 
            });
            let cols = rows[0] || {};
            return Object.values(cols)[0]?true:false
        }
        

        static insertId(data){
            return data.insertId;
        }

        //返回分隔符包括后的内容
        static separate(name){
            return '`'+name+'`';
        }

        //返回参数的关键字符
        static param(name){
            return '?'
        }
    }
    return mysql_db
}

function GetSQLServer(){

    const mssql = require('mssql');
    class mssql_db extends db{

        static init(){	
        }

        static paramCheck(sql, params){
            if (typeof params=='object' && params.length){
                let paramsName = sql.match(/@\w+/g);
                let result = {};
                for(let i=0; i< paramsName.length; i++){
                    let paramName = paramsName[i].substring(1);;
                    result[paramName] = params[i]
                }
                return result;
            } else {
                return params;
            }
        }

        static begin(data) {
            return new Promise((resolve, reject) => {
                let conf = Object.assign({}, configs.db.mssql);
                if (data.db) {
                    conf.database = data.db;
                }
                let connection = new mssql.ConnectionPool(conf, function(err) {
                    if (err) {
                        return reject(err);
                    }
                    if (data.transaction) {
                        let transaction = new mssql.Transaction(connection);
                        transaction.begin(function(err) {
                            if (err) {
                                return reject(err);
                            }
                            resolve({ connection, transaction });
                        });
                    } else {
                        resolve({connection});
                    }
                });
            });
        }

        static end(data) {
            return new Promise((resolve, reject) => {
                resolve();
                data.connection.close();
            });
        }        
        

        static commit(data) {
            return new Promise((resolve, reject) => {
                data.transaction.commit(function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                    data.connection.close();
                });
            });
        }

        static rollback(data) {
            return new Promise((resolve, reject) => {
                data.transaction.rollback(function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                    data.connection.close();
                });
            });
        }   

        static query(data) {
            return new Promise(async (resolve, reject) => {
                let conn = data.conn;
                if (typeof conn=='string'){
                    data.db = conn;
                    conn = null;
                }
                if (!conn) {
                    conn = await this.begin(data);
                }
                data.params = this.paramCheck(data.sql,data.params);
               
                let request = new mssql.Request(conn.transaction||conn.connection);
                if (data.params) {
                    for (let n in data.params) {
                        if (data.paramTypes && data.paramTypes[n]) {
                            request.input(n, data.paramTypes[n], data.params[n]);
                        } else {
                            request.input(n, mssql.NVarChar, data.params[n]);
                        }
                    }
                }
                console.time();
                request.query(data.sql, (err, recordset) => {
                    console.timeEnd();                
                    if (err) {
                        reject(err+"\n"+data.sql+"\n"+JSON.stringify(data.params));
                    } else {
                        resolve(recordset.recordset);
                    }
                    if (!data.conn) {
                        conn.connection.close();
                    }
                });
            });
        }

        static exec(data) {
            return new Promise(async (resolve, reject) => {
                let conn = data.conn;
                if (typeof conn=='string'){
                    data.db = conn;
                    conn = null;
                }
                if (!conn) {
                    conn = await this.begin(data);
                }
                data.params = this.paramCheck(data.sql,data.params);

                if (/^\s*insert\s+into\s+/i.test(data.sql)){
                    data.sql = data.sql + ' select SCOPE_IDENTITY() as insertId'
                }
                
                let request = new mssql.Request(conn.transaction||conn.connection);
                if (data.params) {
                    for (let n in data.params) {
                        if (data.paramTypes && data.paramTypes[n]) {
                            request.input(n, data.paramTypes[n], data.params[n]);
                        } else {
                            request.input(n, mssql.NVarChar, data.params[n]);
                        }
                    }
                }
                console.time();
                request.query(data.sql, (err, recordset) => {
                    console.timeEnd();                   
                    if (err) {
                        reject(err+"\n"+data.sql+"\n"+JSON.stringify(data.params));
                    } else {
                        resolve(recordset.recordset);
                    }
                    if (!data.conn) {
                        conn.connection.close();
                    }
                });
            });
        }

        static async quick(conn, sql, ...paramsValue) {
            if (typeof conn=='string'){
                paramsValue.unshift(sql);
                sql = conn;
                conn = null;
            }
            return await this.query({
                conn, 
                sql,
                params : this.paramCheck(sql,paramsValue)
            });
        }
    
        static async quickRow(conn, sql, ...paramsValue) {
            if (typeof conn=='string'){
                paramsValue.unshift(sql);
                sql = conn;
                conn = null;
            }
            let rows = await this.query({
                conn, 
                sql,
                params : this.paramCheck(sql,paramsValue)
            });
            return rows[0] || {};
        }
    
        static async quickCol(conn, sql, ...paramsValue) {
            if (typeof conn=='string'){
                paramsValue.unshift(sql);
                sql = conn;
                conn = null;
            }
            let rows = await this.query({
                conn, 
                sql,
                params : this.paramCheck(sql,paramsValue)
            });
            let cols = rows[0] || {};
            return Object.values(cols)[0] || null
        }
    
        static async quickExec(conn, sql, ...paramsValue) {
            if (typeof conn=='string'){
                paramsValue.unshift(sql);
                sql = conn;
                conn = null;
            }
            return await this.exec({
                conn, 
                sql,
                params : this.paramCheck(sql,paramsValue)
            });
        }
    
        static async quickIs(conn, sql, ...paramsValue) {            
            if (typeof conn=='string'){
                paramsValue.unshift(sql);
                sql = conn;
                conn = null;
            }
            let rows = await this.query({
                conn, 
                sql,
                params : this.paramCheck(sql,paramsValue)
            });
            let cols = rows[0] || {};
            return Object.values(cols)[0]?true:false
        }
        
        static insertId(data){
            return data[0].insertId;
        }

        //返回分隔符包括后的内容
        static separate(name){
            return '['+name+']';
        }

        //返回参数的关键字符
        static param(name){
            return '@'+name
        }
    }

    return mssql_db;
}

if (configs.db.mysql){
    module.exports = GetMySQL()
} else if (configs.db.mssql){
    module.exports = GetSQLServer();
}