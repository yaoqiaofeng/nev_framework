/**
 * 缓存模块，使用redis作为缓存
 */

const redis = require("redis");

module.exports= class {

    constructor() {
        this.redis = redis.createClient(configs.db.cache);
        this.clear();
    }

    //返回事务
    begin(){
        return this.redis.multi();
    }

    //应用事务
    commit(multi){            
        return new Promise(function (resolve, reject) {
            multi.exec(function (err, replies) {
                if (err) return reject(err);
                resolve(replies);                  
            });
        });
    }

    rollback(multi){            
        return new Promise(function (resolve, reject) {
            multi.discard(function (err) {
                if (err) return reject(err);
                resolve();                  
            })
        });
    }

    kdel(name, id, multi){
        if (!multi) multi = this.redis;
        multi.del(name+':'+id);
    }

    kget(name, id){      
        return new Promise(function (resolve, reject) {
            this.redis.hgetall(name+':'+id, function (err, object) {
                if (err) return reject(err);
                resolve(object);
            });
        });
    }

    kinc(name, value, multi){ 
        return new Promise(function (resolve, reject) {
            let transaction = multi?true:false;
            if (!multi) multi = this.redis.multi();
            for (let n in value) {
                if (n!='id') {
                    multi.hincrby(name+':'+value.id, n, value[n]);
                }
            }
            multi.hgetall(name+':'+value.id);
            if (transaction) return resolve();
            multi.exec(function (err, replies) {
                if (err) return reject(err);
                resolve(replies);                  
                console.log('modules.cache.model.inc',replies);
            });
        });
    }

    kset(name, value, multi){
        return new Promise(function (resolve, reject) {
            let transaction = multi?true:false;
            if (!multi) multi = this.redis.multi();
            for (let n in value) {
                if (value[n]!==null && value[n]!==undefined) {
                    let v = value[n];
                    if (v === null) v = "";
                    multi.hmset(name+':'+value.id, n, v);
                }
            }
            if (transaction) return resolve();
            multi.exec(function (err) {
                if (err) return reject(err);
                resolve();                    
            });
        });
    }

    kgetall(name, multi){                        
        return new Promise(function (resolve, reject) {
            this.redis.keys(name+':*', function (err, replies) {
                if (err) return reject(err);
                // if (!multi)
                multi = this.redis.multi();
                for(let i=0; i<replies.length; i++){
                    multi.hgetall(replies[i]);
                };
                multi.exec(function (err, replies) {
                    if (err) return reject(err);
                    resolve(replies);                    
                });
            })
        });
    }
    
    ksetall(name, value, multi){           
        return new Promise(function (resolve, reject) {                 
            this.redis.keys(name+':*', function (err, replies) {
                if (err) return reject(err);
                let transaction = multi?true:false;
                if (!multi) multi = this.redis.multi();
                if (replies.length>0){
                    multi.del(replies);
                }
                for(let i=0; i<value.length; i++){
                    let data = {};
                    for (let n in value[i]) {
                        let v = value[i][n];
                        if (v === null) v = "";
                        data[n] = v;
                    }
                    multi.hmset(name+':'+data.id, data);
                };
                if (transaction) return resolve();
                multi.exec(function (err) {
                    if (err) return reject(err);
                    resolve();                    
                });
            })
        });
    }

    clear () {
        this.redis.flushdb();
    }

    get(name){
        return new Promise(function (resolve, reject) {
            this.redis.get(name, function (err, reply) {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    }

    set(name, value){
        return new Promise(function (resolve, reject) {
            this.redis.set(name, value, function (err, reply) {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    expire(name, seconds){
        this.redis.expire(name, seconds)        
    }

};

