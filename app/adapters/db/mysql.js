
const mysql = require('mysql');

module.exports = class{

    constructor() {
        this.pool = mysql.createPool(configs.db);
    }

    begin(data) {
        return new Promise(async (resolve, reject)=>{
            this.pool.getConnection(function(err, connection) {
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

    end(data) {
        return new Promise(async (resolve, reject)=>{
            data.conn.release();
                resolve();
        });
    }

    commit(data) {
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

    rollback(data) {
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

    query(data) {
        return new Promise(async (resolve, reject)=>{
            let conn = this.pool;
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

    exec(data) {
        return new Promise(async (resolve, reject)=>{
            let conn = this.pool;
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

    insertId(data){
        return data.insertId;
    }

    //返回分隔符包括后的内容
    separate(name){
        return '`'+name+'`';
    }

    //返回参数的关键字符
    param(name){
        return '?'
    }
}