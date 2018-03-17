const batch = require("./batch");
batch();

const path = require("path");
const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const domain = require("domain");
const app = express();
const load = require("./load");
const config = require("./app/node_modules/config");

//// parse `application/json`
app.use(bodyParser.json());
// parse `application/x-www-form-urlencoded`
app.use(bodyParser.urlencoded({ extended: true }));
//
app.use(cookieParser());
//
app.use(session({ secret: config.session.secret }));
// 记录请求日志
app.use(logger("tiny"));
//
load.init(app);
// 打印异常日志
process.on("uncaughtException", error => {
	console.log(error);
});
//
app.listen(config.server.port);
