const moment = require('moment');
const User = services("user");
const http = require('http');


function Json(data, error) {
	if (error) {
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

module.exports = {
	listening(app) {
        //初始化服务器
        const wsPort = parseInt(configs.server.port)+(process.env.NODE_APP_INSTANCE===undefined?1:process.env.NODE_APP_INSTANCE);
        const wsServer = http.createServer();
        const io = require('socket.io')(wsServer);
        wsServer.listen(wsPort);
        if (configs.cache && configs.cache.name=='redis'){
            const redis = require('socket.io-redis');
            let redis_db = {
                host: configs.cache.host,
                port: configs.cache.port,
                db: 15,
            }        
            io.adapter(redis(redis_db));            
        }
        //全局可用的函数
        global.emits = function(event, data){
            io.broadcast.emit(event, data);
        }
        //全局可用的函数
        global.emit = function(event, data, to){       
            for(let socket of Object.keys(io.sockets.sockets)){
                if (io.sockets.sockets[socket].user.id==to){
                    io.sockets.sockets[socket].emit(event, data)
                }
            }
        }
        //
        io.on('connection', (socket)=>{    
            socket.on('message', (data)=> {
                console.log('socket.message');
                let date=moment().format('YYYY-MM-DD HH:mm:ss');
                let message = {
                    date: date,
                    user_id: socket.user.id,
                    user_name: socket.user.name,
                    message: data.message
                }
                if (data.type == 'room'){
                    message.room = data.to;
                    socket.to(data.to).emit(message);
                    message.self = true;
                    socket.emit('message', message);
                } else if (data.to) {
                    message.user = data.to;
                    for(let socket of Object.keys(io.sockets.sockets)){
                        if (io.sockets.sockets[socket].user.id==data.to){
                            io.sockets.sockets[socket].emit('message', message)
                        }
                    }
                } else {
                    socket.broadcast.emit('message', message);
                    message.self = true;
                    socket.emit('message', message);
                }
            });

            socket.on('notify', (data)=> {
                console.log('socket.notify');
                let notify = {
                    user_id: socket.user.id,
                    user_name: socket.user.name,
                    notify: data.notify
                }
                if (data.type == 'room'){
                    notify.room = data.to;
                    socket.to(data.to).emit(notify)
                } else if (data.to) {
                    notify.user = data.to;
                    for(let socket of Object.keys(io.sockets.sockets)){
                        if (io.sockets.sockets[socket].user.id==data.to){
                            io.sockets.sockets[socket].emit('notify', notify)
                        }
                    }
                } else {
                    socket.broadcast.emit('notify', notify);
                    notify.self = true;
                    socket.emit('notify', notify);
                }
            });
                        
            socket.on('login', async (token) => {
                console.log('socket.login');
                socket.user = await User.valid(User.token_decode(token));
                let date=moment().format('YYYY-MM-DD HH:mm:ss');
                socket.broadcast.emit('login', {
                    date: date,
                    user_id: socket.user.id,
                    user_name: socket.user.name
                });
                socket.emit('logined', {
                    date: date,
                    user_id: socket.user.id,
                    user_name: socket.user.name
                });
                let users = [];
                for(let socket of Object.keys(io.sockets.sockets)){
                    let id = io.sockets.sockets[socket].user.id;
                    if (users.indexOf(id)==-1){
                        users.push(-1)
                    }
                }
                socket.emit('user list', users);
            });

            socket.on('in room', (code)=>{
                console.log('socket.in_room');
                socket.join(code);
                let date=moment().format('YYYY-MM-DD HH:mm:ss');
                socket.to(code).emit('in room', {
                    date: date,
                    user_id: socket.user.id,
                    user_name: socket.user.name
                });
            })

            socket.on('out room', (code)=>{
                console.log('socket.out_room');
                socket.leave(code);
                let date=moment().format('YYYY-MM-DD HH:mm:ss');
                socket.to(code).emit('out room', {
                    date: date,
                    user_id: socket.user.id,
                    user_name: socket.user.name
                });
            })

            socket.on('logout', ()=>{  
                console.log('socket.logout');
                let date=moment().format('YYYY-MM-DD HH:mm:ss');
                socket.broadcast.emit('logout', {
                    date: date,
                    user_id: socket.user.id,
                    user_name: socket.user.name
                });
                socket.disconnect(true);
            });
          
        });
        
        app.get('/ws',             
			function(req, res, next) {
                req.result.data = wsPort;
                next();
        }, result)
    }
};
    