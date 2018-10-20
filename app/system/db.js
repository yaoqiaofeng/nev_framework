/*
 *   数据库模块
 * */

if (!(configs && configs.db && configs.db.name)){
    console.error('尚未配置数据库');
}

const Adapter = require('../adapters/db/'+configs.db.name);
const adapter = new Adapter();

module.exports  = class db{

    /**
     *
     *
     * @static
     * @param {object} data 属性transaction: 是否开启事务
     * @memberof db
     * @returns 返回值为数据库连接
     */
    static begin(data){
        return adapter.begin(data);
    }

    /**
     * 
     * @param {object} data 
     */
    static end(data){
        return adapter.end(data);
    }

    /**
     * 
     * @param {object} data 
     */
    static commit(data) {
        return adapter.commit(data);
    }

    /**
     * 
     * @param {object} data 
     */
    static rollback(data) {
        return adapter.rollback(data);
    }

    /**
     * 
     * @param {object} data 
     */
    static query(data) {
        return adapter.query(data);
    }

    /**
     * 
     * @param {*} data 
     */
    static exec(data) {
        return adapter.exec(data);
    }

    //使用参数方式执行
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

    //执行并返回第一列数据
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

    //执行并返回某一个字段值
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

    //参数方式快速执行
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

    //执行并判断返回的第一行第一列值是否有效
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
    
    /**
     * 
     * @param {*} data 
     */
    static insertId(data){
        return adapter.insertId(data);
    }

    /**
     * 
     * @param {*} name 
     */
    static separate(name){
        return adapter.param(name)
    }

    /**
     * 
     * @param {*} name 
     */
    static param(name){
        return adapter.param(name);
    }

    //sql注入验证
    static valid(sql){
        let  reg = /select|update|delete|exec|count|'|"|=|;|>|<|%/i;
        return !reg.test(sql);
    }
}