const Service = require("service");
const path = require("path");
const fs = require("fs");
const config = require("config");
const User = Service("user");

const upload = require("./plugin/upload")(function(req){
    return path.resolve(config.path.public + "/images/", req.result.user.username);
}, "images", 5);

function Json(data, error) {
	if (error) {
		return {
			result: "fail",
			message: typeof error == "string" ? error : JSON.stringify(error)
		};
	} else {
		return {
			result: "success",
			data: data
		};
	}
}

function result(req, res) {
	res.json(Json(req.result.data, req.result.error));
}

function auth(req, res, next) {
	if (req.result.user && req.result.user.id) {
		next();
	} else {
		res.json({
			result: "fail",
			code: 401,
			message: "user authentication failed"
		});
	}
}

module.exports = {
	init(app) {
		app.use(async function(req, res, next) {
            if (req.result.user && req.result.user.id) {
                next();
                return;
            }
            console.log("valid");
        
            //正常登陆
            let token =
                (req.body && req.body.access_token) ||
                (req.query && req.query.access_token) ||
                req.headers["x-access-token"] ||
                req.session.access_token ||
                req.cookies.access_token;
            if (token != "") {
                try{
                    req.result.user = await User.valid(User.token_decode(token));
                } catch(err){
                    req.result.user = {};
                }
            } 
            next();
        });
	},

	listening(app) {
		app.post("/api/user/register",
			async function(req, res, next) {
                console.log("user.register");
                try{
                    await User.register({
                        username: req.body.username,
                        password: req.body.password,
                        tel: req.body.tel,
                        email: req.body.email
                    });
                } catch(err){
                    req.result.error = err;
                }
                next();
			},
			result
		);

		app.get("/api/user/login",
			async function(req, res, next) {
				console.log("user.login");
                try{
                    //正常登陆
                    let username = req.query.username;
                    let password = req.query.password;
                    let userinfo =await User.login({
                        username: username,
                        password: password
                     });
                    let token = User.token(userinfo);
                    if (req.query.remember) {
                        res.cookie("access_token", token, {
                            maxAge: 604800000,
                            httpOnly: true
                        });
                    }
                    req.session.access_token = token;
                    req.result.data = {
                        access_token: token
                    };
                } catch(err){
                    req.result.error = err;
                }
                next();
			},
			result
		);

		app.get("/api/user/valid", auth, function(req, res) {
			res.json(Json(req.result.user, req.result.error));
		});

		app.post("/api/user", auth,
			async function(req, res, next) {
                console.log("user.update");
                try{
                    await  User.update(Object.assign(req.body, {
                        user_id: req.result.user.id,
                        identity: req.result.user.type,
                        id: req.body.id ? req.body.id : req.result.user.id
                    }));
                    req.result.data = { result: "success" };
                } catch(err){
                    req.result.error = err;
                }
                next();
			},
			result
		);

		app.post("/api/user/change", auth,
			async function(req, res, next) {
				console.log("user.change");
                try{
                    await User.change({
						id: req.result.user.id,
						password: req.body.password,
						new_username: req.body.new_username,
						new_password: req.body.new_password
					});
                } catch(err){
                    req.result.error = err;
                }
                next();
			},
			result
		);

		app.post("/api/image", auth,
			function(req, res, next) {
				upload(req, res, function(err) {
					if (err) {
						req.result.error = err;
						next();
					}
					let images = req.files.images;
					let data = [];
					for (let i = 0; i < images.length; i++) {
						data.push("/images/" +req.result.user.username +"/" +images[i].filename);
					}
					req.result.data = data;
					next();
				});
			},
			result
		);

		app.get("/api/:server", auth,
			async function(req, res, next) {
				console.log(req.params.server + ".get");
				let server = Service(req.params.server);
				if (server) {
                    try{
                        req.result.data = await server.get(Object.assign(req.query, {
                            user_id: req.result.user.id,
                            identity: req.result.user.type
                        }));
                    } catch(err){
                        req.result.error = err;
                    }
				} else {
					req.result.error = "无可处理的服务";
				}
                next();
			},
			result
		);

		app.post("/api/:server", auth,
            async function(req, res, next) {
				console.log(req.params.server + ".update");
				let server = Service(req.params.server);
				if (server) {					
                    try{
                        let data = await server.update(Object.assign(req.body, {
							user_id: req.result.user.id,
							identity: req.result.user.type
						}));
                        req.result.data = {
                            id: data
                        };
                    } catch(err){
                        req.result.error = err;
                    }
				} else {
					req.result.error = "无可处理的服务";
				}
                next();
			},
			result
		);

		app.put("/api/:server", auth,
			async function(req, res, next) {
				console.log(req.params.server + ".add");
				let server = Service(req.params.server);
				if (server) {				
                    try{
                        let data = await server.add(Object.assign(req.body, {
                            user_id: req.result.user.id,
                            identity: req.result.user.type
                        }));
                        req.result.data = {
                            id: data
                        };
                    } catch(err){
                        req.result.error = err;
                    }
				} else {
					req.result.error = "无可处理的服务";
				}
                next();
			},
			result
		);

		app.delete("/api/:server",auth,
			async function(req, res, next) {
				console.log(req.params.server + ".delete");
				let server = Service(req.params.server);
				if (server) {
					try{
                        await server.delete(Object.assign(req.body, {
							user_id: req.result.user.id,
							identity: req.result.user.type
						}));
                    } catch(err){
                        req.result.error = err;
                    }
				} else {
					req.result.error = "无可处理的服务";
				}
                next();
			},
			result
		);

        app.get("/api/:server/list", auth,
            async function (req, res, next) {
                console.log(req.params.server + ".list");
				let server = Service(req.params.server);
                if (server) {
					try{
                        req.result.data = await server.list(Object.assign(req.query, {
							user_id: req.result.user.id,
							identity: req.result.user.type
                        }));
                    } catch(err){
                        req.result.error = err;
                    }
				} else {
					req.result.error = "无可处理的服务";
				}
                next();
			},
			result
		);

		app.get("/api/:server/all", auth,
        async function(req, res, next) {
				console.log(req.params.server + ".all");
				let server = Service(req.params.server);
				if (server) {
					try{
                        req.result.data = await server.list(Object.assign(req.query, {
							user_id: req.result.user.id,
							identity: req.result.user.type
						}))
                    } catch(err){
                        req.result.error = err;
                    }
				} else {
					req.result.error = "无可处理的服务";
				}
                next();
			},
			result
		);

		app.use("/api/*", function(req, res, next) {
			res.json({
				result: "error",
				code: 404,
				message: req.url + " not found"
			});
		});

		app.use("/api/*", function(err, req, res, next) {
			var message = "";
			if (typeof err == "string") {
				message = err;
			} else if (typeof err == "object") {
				if (err.message) {
					message = err.message;
				} else {
					message = JSON.stringify(err);
				}
			}
			const error = {
				result: "fail",
				code: 500,
				message: message
			};
			res.json(error);
		});
	}
};
    