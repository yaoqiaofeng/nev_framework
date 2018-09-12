const load = require("./loader");

// 加载器
loader.init();

// 打印异常日志
process.on("uncaughtException", error => {
    let logger = modules('logger');
    logger.error(error);
});