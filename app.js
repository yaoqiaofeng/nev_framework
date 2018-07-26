const batch = require("./batch");
const load = require("./load");
const logger = require("./app/node_modules/logger");
batch(function(){
    //
    load.init();
});
// 打印异常日志
process.on("uncaughtException", error => {
    logger.error(error);
});