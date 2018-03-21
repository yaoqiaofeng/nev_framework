const fs = require("fs");
const path = require("path");
const express = require("express");
const config = require("config");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const domain = require("domain");
const app = express();

module.exports = function() {
	//// parse `application/json`
	app.use(bodyParser.json());
	// parse `application/x-www-form-urlencoded`
	app.use(bodyParser.urlencoded({ extended: true }));
	//启用cookie
	app.use(cookieParser());
	//启用seesion
	app.use(session({ secret: config.session.secret }));
	// 记录请求日志
	app.use(logger("tiny"));
	//最优先的处理请求
	app.use(function(req, res, next) {
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

	//加载所有路由的前置处理，最优先
	for (let i = 0; i < routerlist.length; i++) {
		if (routerlist[i] != "app.js" && routerlist[i] != "processor") {
			let router = require("./" + routerlist[i]);
			routers.push(router);
			if (router.init) {
				router.init(app);
			}
		}
	}

	//加载所有路由的静态文件处理，在静态文件之前
	for (let i = 0; i < routers.length; i++) {
		if (routers.static) {
			routers[i].static(app);
		}
	}

	//静态文件处理
	app.use(express.static(path.resolve(config.path.public)));

	//加载所有路由的普通处理
	for (let i = 0; i < routers.length; i++) {
		routers[i].listening(app);
	}

	//
	app.listen(config.server.port);
};
