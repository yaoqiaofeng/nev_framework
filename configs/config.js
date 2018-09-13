module.exports = {
    db : {
        "mysql" : {
            "host" : "localhost",
            "user" : "root",
            "password" : "root",
            "database"  : "nev",
            "supportBigNumbers" : true,
            "stringifyObjects" : true,
            "dateStrings": true
        },
        "redis" : {
            "host": "",
            "port": 6379
        }
    },

    name: '易卡通',
    
    //服务运行配置模块
    server:{
        //服务器运行端口号
        port: 3000
    },

    path : {
       public : "public"
    },

    jwt: {
        secret: "8047832D44F34C92972C3DB33998586B"
    },

    session: {
        secret: "8047832D44F34C92972C3DB33998586B"
    },

    logger: {
        appenders: {
            out: { type: 'stdout' },
            app: { type: 'datefile', filename: './logs/app', "alwaysIncludePattern": true, "pattern": "-yyyy-MM-dd-hh.log"},
            error: { type: 'datefile', filename: './logs/error', "alwaysIncludePattern": true, "pattern": "-yyyy-MM-dd-hh.log"}
        },
        categories: { 
            default: { appenders: [ 'out', 'app' ], level: 'info' },
            error: { appenders: [ 'out', 'app', 'error'], level: 'error' }
        }
    }
}