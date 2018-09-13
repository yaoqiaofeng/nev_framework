const fs = require("fs");
const path = require("path");
const configs = require("./configs/config");

//模块加载器
let moduleList = new Map();
global.modules = function (name, obj) {
    if (typeof (obj) == 'object' || typeof (obj) == 'function') {
        moduleList.set(name, obj);
    } else {
        return moduleList.get(name);
    }
};


//数据模型加载器
let modelList = [];
global.models = function (obj) {
    if (typeof (obj) == 'object' || typeof (obj) == 'function') {
        if (obj.router) {
            modelList.push(obj);
        }
    } else {
        for (var i = 0; i < modelList.length; i++) {
            if (modelList[i].router(obj)) {
                return modelList[i];
            }
        }
        return;
    }
};


//服务加载器
let serviceList = [];
global.services = function (obj) {
    if (typeof (obj) == 'object' || typeof (obj) == 'function') {
        if (obj.router) {
            serviceList.push(obj);
        }
    } else {
        for (var i = 0; i < serviceList.length; i++) {
            if (serviceList[i].router(obj)) {
                return serviceList[i];
            }
        }
        return;
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
                this.loeadModules(dir + fileList[i]  + '/');
            } else {
                this.loadModule(dir + fileList[i]);
            }
        }  
    },

    //加载模块
    loadModule(file){
        let module = require(file.substring(0,file.lastIndexOf('.')));
        //加载初始化过程
        if (module.init){
            module.init()
        }
        console.log(path.basename(file, '.js')+': '+file.substring(0,file.lastIndexOf('.')));        
        modules(path.basename(file, '.js'), module);
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
        //初始化配置文件
        global.configs = configs;        
        //初始化系统模块
        this.loadModules('./app/modules/system/');
        //初始化用户模块
        this.loadModules('./app/modules/user/');
        //初始化数据模型
        this.loadModels('./app/models/');
        //初始化业务
        this.loadServices('./app/services/');
        //加载路由
        require("./app/controllers/app")();        
    }  
};


