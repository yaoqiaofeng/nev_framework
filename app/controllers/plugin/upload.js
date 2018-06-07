const fs = require("fs");
const config = require("config");

//图片上传
const multer = require("multer");

//dir 提供一个函数或者一个固定路径，确认保存路径
//file 提供一个函数或者文件名，确认保存文件名
//mode 1为内存存储，其他为硬盘存储
//filter 文件过滤函数
//limit  上传文件大小限制
module.exports = function(dir, filename, mode, filter, limit){
    if (typeof dir=="string"){
        if (dir[0]!='\\') {
            dir = '\\'+dir;
        }
        if (dir[dir.length-1]!='\\') {
            dir = dir+'\\';
        }
    }
    let storage;
    if (mode==1) {
        storage = multer.memoryStorage()
    } else {
        storage ={
            destination: function(req, file, cb) {                
                let path = dir;
                if (typeof dir=="function"){
                    path = dir(req);
                }
                fs.mkdir(path, function(err) {
                    cb(null, path);
                });
            }
        }
        if (filename){
            storage.filename =  function (req, file, cb) {  
                let filepath = filename;
                if (typeof filename=="function"){
                    filepath = filename(req);
                }
                cb(null, filepath);
            }
        }
        storage = multer.diskStorage(storage);
    }
    return multer({ 
        storage,
        filter,
        limit:{
            fieldSize : limit
        }
    });
}
