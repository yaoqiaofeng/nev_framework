/**
 * 缓存模块，使用redis作为缓存
 */

const redis = require("redis");
const redisClient  = redis.createClient(configs.db.redis);

const cache = {

    init(){	
        this.clear();
    }

    //返回事务
    begin(){
        return redisClient.multi();
    },

    //应用事务
    commit(multi){            
        return new Promise(function (resolve, reject) {
            multi.exec(function (err, replies) {
                if (err) return reject(err);
                resolve();                  
            });
        });
    },

    rollback(multi){            
        return new Promise(function (resolve, reject) {
            multi.discard(function (err, replies) {
                if (err) return reject(err);
                resolve();                  
            })
        });
    },

    model: {

        del(name, id, multi){
            if (!multi) multi = redisClient;
            multi.del(name+':'+id);
        },
        get(name, id){      
            return new Promise(function (resolve, reject) {
                redisClient.hgetall(name+':'+id, function (err, object) {
                    if (err) return reject(err);
                    resolve(object);
                });
            });
        },        
        inc(name, value, multi){ 
            return new Promise(function (resolve, reject) {
                let transaction = multi?true:false;
                if (!multi) multi = redisClient.multi();
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
        },
        set(name, value, multi){
            return new Promise(function (resolve, reject) {
                let transaction = multi?true:false;
                if (!multi) multi = redisClient.multi();
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
        },

        getall(name, multi){                        
            return new Promise(function (resolve, reject) {
                redisClient.keys(name+':*', function (err, replies) {
                   // if (!multi)
                    multi = redisClient.multi();
                    for(let i=0; i<replies.length; i++){
                        multi.hgetall(replies[i]);
                    };
                    multi.exec(function (err, replies) {
                        if (err) return reject(err);
                        resolve(replies);                    
                    });
                })
            });
        },
        
        setall(name, value, multi){           
            return new Promise(function (resolve, reject) {                 
                redisClient.keys(name+':*', function (err, replies) {
                    let transaction = multi?true:false;
                    if (!multi) multi = redisClient.multi();
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
    },

    clear () {
        redisClient.flushdb();
    },

    get(name){
        return new Promise(function (resolve, reject) {
            redisClient.get(name, function (err, reply) {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    },

    set(name, value){
        return new Promise(function (resolve, reject) {
            redisClient.set(name, value, function (err, reply) {
                if (err) return reject(err);
                resolve();
            });
        });
    },

    expire(name, seconds){
        redisClient.expire(name, seconds)        
    }

};

module.exports = cache;
