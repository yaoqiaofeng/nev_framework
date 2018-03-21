const batch = require("./batch");
const load = require("./load");
batch(function(){
    //
    load.init();
});
// 打印异常日志
process.on("uncaughtException", error => {
	console.log(error);
});