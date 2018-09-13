const fs = require("fs");
const path = require("path");
const express = require("express");
const logger = modules('logger');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const compression = require('compression');
const server = require('http').createServer(app);

module.exports = function() {
	//开启静态文件压缩
    app.use(compression());
	//// parse `application/json`
	app.use(bodyParser.json({limit: '10mb'}));
	// parse `application/x-www-form-urlencoded`
	app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
   //启用cookie
	app.use(cookieParser());
	//启用seesion
	app.use(session({ secret: configs.session.secret }));
	// 记录请求日志
	logger.express(app);
	//最优先的处理请求
    app.use(function (req, res, next) {
		//响应options请求
		if (req.method == "OPTIONS") {
			res.header("Access-Control-Allow-Origin", "*");
			res.header(
				"Access-Control-Allow-Headers",
				"accept, access-control-allow-origin, x-access-token, content-type"
			);
			res.header(
				"Access-Control-Allow-Methods",
				"PUT, POST, GET, DELETE, OPTIONS"
			);
			res.sendStatus(200);
		} else {
			//生成返回数据的结构
			req.result = {};
			next();
		}
	});
    
	let routerlist = fs.readdirSync(__dirname, "utf-8");
	let routers = [];

    app.server = server;
    
	//加载所有路由的前置处理，最优先
	for (let i = 0; i < routerlist.length; i++) {
        if (routerlist[i] != "app.js" && routerlist[i] != "plugin") {
			let router = require("./" + routerlist[i]);
			routers.push(router);
			if (router.init) {
				router.init(app);
			}
		}
    }

	//加载所有路由的静态文件处理，在静态文件之前
	for (let i = 0; i < routers.length; i++) {
		if (routers[i].static) {
			routers[i].static(app);
		}
	}

	//静态文件处理
	app.use(express.static(path.resolve(configs.path.public)));

	//加载所有路由的普通处理
	for (let i = 0; i < routers.length; i++) {
		routers[i].listening(app);
	}
	//
	server.listen(configs.server.port);
};
