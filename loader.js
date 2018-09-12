const fs = require("fs");

//模块加载器
let modules = new Map();
global.modules = function (name, obj) {
    if (typeof (obj) == 'object' || typeof (obj) == 'function') {
        modules.set(name, obj);
    } else {
        return modules.get(name);
    }
};


//数据模型加载器
let models = new Map();
global.models = function (name, obj) {
    if (typeof (obj) == 'object' || typeof (obj) == 'function') {
        if (ID.router) {
            models.set(name, obj);
        }
    } else {
        return models.get(name);
    }
};


//服务加载器
let services = new Map();
global.services = function (name, obj) {
    if (typeof (obj) == 'object' || typeof (obj) == 'function') {
        if (ID.router) {
            services.set(name, obj);
        }
    } else {
        return services.get(name);
    }
};


module.exports = {

    //加载所有模块
    loadModules(dir){
        let fileList = fs.readdirSync(dir,'utf-8');
        for(let i=0;i<fileList.length;i++) {
            let stat = fs.lstatSync(dir + fileList[i]);
            // 是目录，需要继续
            if (stat.isDirectory()) {
                this.loadModules(dir + fileList[i]  + '/');
            } else {
                this.loadModule(dir + fileList[i]);
            }
        }  
    },

    //加载模块
    loadModule(dir){
        let module = require(file.substring(0,file.lastIndexOf('.')));
        //加载初始化过程
        if (module.init){
            module.init()
        }
        console.log(file.substring(0,file.lastIndexOf('.')));
        modules(module);
    },

    // 加载所有模型 
    loadModels(dir){
        let fileList = fs.readdirSync(dir,'utf-8');
        for(let i=0;i<fileList.length;i++) {
            let stat = fs.lstatSync(dir + fileList[i]);
            // 是目录，需要继续
            if (stat.isDirectory()) {
                this.loadModels(dir + fileList[i]  + '/');
            } else {
                this.loadModel(dir + fileList[i]);
            }
        }  
    },

    //加载模型
    loadModel(file){
        let model = require(file.substring(0,file.lastIndexOf('.')));
        console.log(file.substring(0,file.lastIndexOf('.')));
        models(model);
    },

    // 加载所有服务   
    loadServices(dir){
        let fileList = fs.readdirSync(dir,'utf-8');
        for(let i=0;i<fileList.length;i++) {
            let stat = fs.lstatSync(dir + fileList[i]);
            // 是目录，需要继续
            if (stat.isDirectory()) {
                this.loadServices(dir + fileList[i]  + '/');
            } else {
                this.loadService(dir + fileList[i]);
            }
        }
    },

    //加载服务
    loadService(file){
        let service = require(file.substring(0,file.lastIndexOf('.')));
        console.log(file.substring(0,file.lastIndexOf('.')));
        services(service);
    },
 
    // 初始化入口
    init(){
        //加载配置文件
        global.configs =  require("./config");
        //初始化系统模块
        this.loadModels('./app/modules/system');
        //初始化用户模块
        this.loadModels('./app/modules/user');
        //初始化数据模型
        this.loadModels('./app/models/');
        //初始化业务
        this.loadServices('./app/services/');
        //加载路由
        require("./app/controllers/app")();        
    }  
};


