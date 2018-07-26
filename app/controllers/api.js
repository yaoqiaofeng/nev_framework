const Service = require("service");
const path = require("path");
const logger = require('logger');
const config = require("config");
const User = Service("user");

const upload = require("./plugin/upload")(function(req){
    return path.resolve(config.path.public + "/images/", req.result.user.username);
}).single("image");

const uploadMemory =  require("./plugin/upload")(null, null, 1, null, 5000000).single("file");

function Json(data, error) {
	if (error) {
        logger.error(typeof error == "string" ? error : error.toString());
		return {
			result: "fail",
			message: typeof error == "string" ? error : error.toString()
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

function funNameFix(name){
    let upper = false;
    name = name.split('');
    for(let i=0; i<name.length; i++){
        if (name[i]=='_' || name['-']){
            upper = true
        } else if (upper){
            name.splice(i-1,2,name[i].toUpperCase());
            i -= 1;
            upper = false;
        }
    }
    return name.join('');
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
                    let userinfo =await User.login(req.query);
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
        
		app.get("/api/user/logout",
			async function(req, res, next) {
				console.log("user.logout");
                try{
                    //正常登陆
                    res.cookie("access_token", '', {maxAge: 0});
                    req.session.access_token = '';
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

		app.post("/api/user/change", auth,
			async function(req, res, next) {
				console.log("user.change");
                try{
                    await User.change(req.body, {
                        user_id: req.result.user.id,
                        user_name: req.result.user.name,
                        identity: req.result.user.type
                    });
                } catch(err){
                    req.result.error = err;
                }
                next();
			},
			result
        );
        
		app.post("/api/image", auth, //upload,
			function(req, res, next) {                
                upload(req, res, function (err) {
                    console.log(req.file);
                    if (err) {
                        req.result.error = err;
                    } else {
                        req.result.data = "/images/" +req.result.user.username +"/" +req.file.filename;
                    }
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
                        req.result.data = await server.get(req.query, {
                            user_id: req.result.user.id,
                            identity: req.result.user.type,
                            user: req.result.user
                        });
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
                        let data = await server.update(Object.assign(req.body, req.query), {
							user_id: req.result.user.id,
                            user_name: req.result.user.name,
							identity: req.result.user.type,
                            user: req.result.user
						});
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
                    
		app.post("/api/:server/import", auth, uploadMemory,
            async function(req, res, next) {
                console.log(req.params.server + ".import");
                let server = Service(req.params.server);
                if (server) {			
                    try{
                        let data = await server.import(Object.assign({
                            filename: req.file.originalname,
                            buffer: req.file.buffer
                        },req.query),{	
                            user_id: req.result.user.id,
                            user_name: req.result.user.name,
                            identity: req.result.user.type,
                            user: req.result.user
                        });
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
        
        app.post("/api/:server/export", auth, 
            async function(req, res, next) {
                console.log(req.params.server + ".export");
                let server = Service(req.params.server);
                if (server) {			
                    try{
                        let data = await server.export(Object.assign(req.body, req.query),{
                            user_id: req.result.user.id,
                            user_name: req.result.user.name,
                            identity: req.result.user.type,
                            user: req.result.user
                        });
                        res.send(data);
                    } catch(err){
                        res.send(JSON.stringify({
                            result: "fail",
                            message: typeof err == "string" ? err : err.toString()
                        }));
                    }
                } else {
                    res.send(JSON.stringify({
                        result: "fail",
                        message: "无可处理的服务"
                    }));
                }
            }
        );

        app.put("/api/:server", auth,
            async function(req, res, next) {
                console.log(req.params.server + ".add");
                let server = Service(req.params.server);
                if (server) {				
                    try{
                        let data = await server.add(Object.assign(req.body, req.query), {
                            user_id: req.result.user.id,
                            user_name: req.result.user.name,
                            identity: req.result.user.type,
                            user: req.result.user,
                        });
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
                        await server.delete(req.query, {
                            user_id: req.result.user.id,
                            user_name: req.result.user.name,
                            identity: req.result.user.type,
                            user: req.result.user
                        });
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
                        if (req.query.filter){
                            req.query.filter = eval('('+req.query.filter+')');
                        }
                        req.result.data = await server.list(req.query, {
                            user_id: req.result.user.id,
                            user_name: req.result.user.name,
                            identity: req.result.user.type,
                            user: req.result.user
                        });
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
                        if (req.query.filter){
                            req.query.filter = eval('('+req.query.filter+')');
                        }
                        req.result.data = await server.list(req.query, {
                            user_id: req.result.user.id,
                            user_name: req.result.user.name,
                            identity: req.result.user.type,
                            user: req.result.user
                        })
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

        app.get("/api/public/:server/:name", 
            async function(req, res, next) {
                console.log(req.params.server + "."+req.params.name);
                let server = Service(req.params.server);
                if (server) {
                    //检测暴露的api
                    let expose = server.exposePublic('get');
                    if (!expose || expose.length==0 || expose.indexOf(req.params.name)==-1){
                        req.result.error = "无可处理的服务";
                        return next();
                    }
                    try{
                        let func =  server[req.params.name]||server[funNameFix(req.params.name)];
                        req.result.data = await func.apply(server, [req.query, {
                            user_id: req.result.user.id || "",
                            user_name: req.result.user.name || "",
                            identity: req.result.user.type  || "",
                            user: req.result.user
                        }]);
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

        app.get("/api/:server/:name", auth,
            async function(req, res, next) {
                console.log(req.params.server + "."+req.params.name);
                let server = Service(req.params.server);
                if (server) {
                    //检测暴露的api
                    let expose = server.expose('get');
                    if (expose !== null){
                        if (expose.indexOf(req.params.name)==-1){
                            req.result.error = "无可处理的服务";
                            return next();                            
                        }
                    }
                    try{
                        let func =  server[req.params.name]||server[funNameFix(req.params.name)];
                        req.result.data = await func.apply(server, [req.query, {
                            user_id: req.result.user.id,
                            user_name: req.result.user.name,
                            identity: req.result.user.type,
                            user: req.result.user
                        }]);
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

        app.post("/api/:server/:name", auth,
            async function(req, res, next) {
                console.log(req.params.server + "."+req.params.name);
                let server = Service(req.params.server);
                if (server) {
                    //检测暴露的api
                    let expose = server.expose('post');
                    if (expose !== null){
                        if (expose.indexOf(req.params.name)==-1){
                            req.result.error = "无可处理的服务";
                            return next();                            
                        }
                    }
                    try{
                        let func =  server[req.params.name]||server[funNameFix(req.params.name)];
                        req.result.data = await func.apply(server, [Object.assign(req.body, req.query), {
                            user_id: req.result.user.id,
                            user_name: req.result.user.name,
                            identity: req.result.user.type,
                            user: req.result.user
                        }]);
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
    