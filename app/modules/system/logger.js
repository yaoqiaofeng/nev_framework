
const log4js = require('log4js');

let logger;

// 记录请求日志
module.exports = {

    init(){
        log4js.configure(configs.logger);
        logger =  log4js.getLogger('error');
        logger.level = 'logger.error(msg);';
    },

    express(app){
        const logger =  log4js.getLogger();
        app.use(log4js.connectLogger(logger, {level: log4js.levels.INFO}));
    },

    error(msg){
        logger.error(msg);
    }
}