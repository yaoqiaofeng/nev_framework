const fs = require("fs");
const Init=require("./app/node_modules/init");
const Model=require("./app/node_modules/model");
const Service=require("./app/node_modules/service");

module.exports = {
    app : null,

    // 加载模型 
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

    loadModel(file){
        let model = require(file.substring(0,file.lastIndexOf('.')));
        console.log(file.substring(0,file.lastIndexOf('.')));
        Model(model);
    },

    // 加载业务   
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

    loadService(file){
        let service = require(file.substring(0,file.lastIndexOf('.')));
        console.log(file.substring(0,file.lastIndexOf('.')));
        Service(service);
    },
 
    // 初始化入口
    init(app){
        Init(()=>{
            //初始化模型
            this.loadModels('./app/models/');
            //初始化业务
            this.loadServices('./app/services/');
            //加载路由
            require("./app/controllers/app")();
        }); 
    }  
};


