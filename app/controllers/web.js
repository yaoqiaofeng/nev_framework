const path = require("path");
const fs = require("fs");
const config = require("config");
const ssr = require("./processor/vue-ssr");

//图片上传
const multer = require("multer");
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		let dir = path.join(
			__dirname,
			config.path.public + "/images/",
			req.result.user.username
		);
		fs.mkdir(dir, function(err) {
			cb(null, dir);
		});
	}
});
const upload = multer({ storage: storage }).fields([
	{ name: "images", maxCount: 5 }
]);

function auth(req, res, next) {
	if (req.baseUrl == "/user/login.html") {
		next();
	} else if (req.result.user && req.result.user.id) {
		next();
	} else {
		req.session.referrer = req.originalUrl;
		res.redirect("/user/login.html");
	}
}

module.exports = {
	static(app) {
		app.use("/*.html", auth);
	},

	listening(app) {
		app.use("/redirect", function(req, res, next) {
			if (req.session.referrer) {
				res.redirect(req.session.referrer);
			} else {
				res.redirect("/index.html");
			}
		});

		app.post("/images/upload", auth, function(req, res, next) {
			upload(req, res, function(err) {
				if (err) {
					return res.json({ errno: err });
				}
				let images = req.files.images;
				let data = [];
				for (let i = 0; i < images.length; i++) {
					data.push("/images/" +req.result.user.username +"/" +images[i].filename);
				}
				res.json({
					errno: 0,
					data: data
				});
			});
		});

		app.get("/error", function(req, res, next) {
			next("错误页面测试");
		});

		app.get("*", function(req, res, next) {
			res.type("html");
			res.sendFile(path.resolve(config.path.public + "/404.html"));
		});

		app.use(async function(err, req, res, next) {
			let message = "";
			if (typeof err == "string") {
				message = err;
			} else if (typeof err == "object") {
				message = JSON.stringify(err);
			}
			let context = {
                title: config.name + "错误",
                data:{
                    message
                }
            }; 
            try{
			    let html = await ssr("/500",context);
				res.end(html);
			} catch(err){
                res.status(500).end("Internal Server Error: " + err);
            }
		});
	}
};
