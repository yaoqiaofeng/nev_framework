const path = require("path");
const fs = require("fs");
const config = require("config");

//图片上传
const multer = require("multer");

module.exports = function(dir, name, maxCount=5){
    if (dir[0]!='\\') {
        dir = '\\'+dir;
    }
    if (dir[dir.length-1]!='\\') {
        dir = dir+'\\';
    }
    let storage = multer.diskStorage({
        destination: function(req, file, cb) {
            let dir = path.resolve(
                config.path.public + dir,
                req.result.user.username
            );
            fs.mkdir(dir, function(err) {
                cb(null, dir);
            });
        }
    });
    return multer({ storage }).fields([{ name, maxCount }]);
}
