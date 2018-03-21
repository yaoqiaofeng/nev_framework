const batch = require("./batch");
batch(function(){
    //
    load.init();
});
// 打印异常日志
process.on("uncaughtException", error => {
	console.log(error);
});