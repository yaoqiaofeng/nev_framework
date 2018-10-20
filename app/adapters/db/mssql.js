const mssql = require('mssql');

module.exports = class{

    constructor() {
    }

    paramCheck(sql, params){
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

    begin(data) {
        return new Promise((resolve, reject) => {
            let conf = Object.assign({}, configs.db);
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

    end(data) {
        return new Promise((resolve, reject) => {
            resolve();
            data.connection.close();
        });
    }        
    

    commit(data) {
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

    rollback(data) {
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

    query(data) {
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

    exec(data) {
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

    insertId(data){
        return data[0].insertId;
    }

    //返回分隔符包括后的内容
    separate(name){
        return '['+name+']';
    }

    //返回参数的关键字符
    param(name){
        return '@'+name
    }
}
