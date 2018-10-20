/**
 * 缓存模块，使用redis作为缓存
 */

if (!(configs && configs.cache && configs.cache.name)){
    console.error('尚未配置缓存');
}

const Adapter = require('../adapters/cache/'+configs.cache.name);
const adapter = new Adapter();

module.exports = class cache {

    //返回事务
    static begin(){
        return adapter.begin();
    }

    //应用事务
    static commit(multi){      
        return adapter.commit(multi);      
    }

    static rollback(multi){            
        return adapter.rollback(multi);     
    }

    static clear() {
        return adapter.clear();
    }

    static get(name){
        return adapter.get(name);
    }

    static set(name, value){
        return adapter.get(name, value);
    }

    static expire(name, seconds){
        return adapter.expire(name, seconds)        
    }

    static kdel(name, id, multi){
        return adapter.kdel(name, id, multi); 
    }
    
    static kget(name, id){      
        return adapter.kget(name, id); 
    }       

    static kinc(name, value, multi){ 
        return adapter.kinc(name, value, multi);
    }

    static kset(name, value, multi){
        return adapter.kset(name, value, multi);
    }

    static kgetall(name, multi){                    
        return adapter.kgetall(name, multi);     
    }
    
    static ksetall(name, value, multi){   
        return adapter.ksetall(name, value, multi); 
    }

};