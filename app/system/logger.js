if (!(configs && configs.db && configs.db.name)){
    console.error('尚未配置日志');
}

const Adapter = require('../adapters/logger/'+configs.logger.name);
const adapter = new Adapter();

// 记录请求日志
module.exports =class {

    static controller(name, app){
        return adapter.controller(name, app);
    }

    static log(msg){
        return adapter.log(msg);
    }

    static error(msg){
        return adapter.error(msg);
    }
}