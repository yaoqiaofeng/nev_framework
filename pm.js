module.exports = {
  "apps": [{
    "name"        : "nev",                        //进程名字
    "watch"       :  ["./app"],                  //监听的路径，如果为true则监听全部
    "ignore_watch" : ["./public"],          //忽略监听的路径
    "script"      : "app.js",               
    "interpreter" : "babel-node",         //支持ES6
    "instances" : "max",                       //由核数决定进程数
    "exec_mode" : "cluster"                 //开启集群模式
  }]
}