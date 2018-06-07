const path = require("path");
const fs = require("fs");
const config = require("config");
const ssr = require("./plugin/vue-ssr");

function auth(req, res, next) {
    if (req.originalUrl == "/user/login.html") {
		next();
	} else if (req.result.user && req.result.user.id) {
		next();
	} else {
        let ext = req.originalUrl.match(/\.[a-zA-Z]*$/);
        if (ext && ext[0]!='.html'){
            return next();
        }
        let fix = req.originalUrl.match(/^\/api/);
        if (fix){
            return next();
        }
        req.session.referrer = req.originalUrl;
        res.redirect("/user/login.html");
	}
}

module.exports = {
	static(app) {
		app.use(auth);
	},

	listening(app) {
		app.use("/redirect", function(req, res, next) {
			if (req.session.referrer) {
				res.redirect(req.session.referrer);
			} else {
				res.redirect("/index.html");
			}
		});

        app.get("/app/*", async function (req, res, next) {
            try {
                let html = await ssr({name: "app", data: { user: req.result.user}, req});
                res.type('html');
                res.end(html);
            } catch (err) {
                res.status(500).end("Internal Server Error: " + err);
            }
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
            try{
                let html = await ssr({
                    name: "500", data: { message }, req
                });
                res.type('html');
				res.end(html);
			} catch(err){
                res.status(500).end("Internal Server Error: " + err);
            }
		});
	}
};
