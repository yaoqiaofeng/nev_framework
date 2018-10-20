
const log4js = require('log4js');

// 记录请求日志
module.exports = class {

    constructor() {
        log4js.configure(configs.logger);
    }

    controller(name, app){
        if (name=='express'){
            const logger =  log4js.getLogger();
            app.use(log4js.connectLogger(logger, {level: log4js.levels.INFO}));
        }
    }

    log(msg){
        const logger =  log4js.getLogger();
        logger.log(msg);
    }

    error(msg){
        const logger =  log4js.getLogger('error');
        logger.error(msg);
    }
}