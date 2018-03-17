基于Nodejs+Express+Vue的开发框架，配置好了webpack（编译前端文件），gulp（生成生产环境文件）。

##文件目录结构
---
1. app.js 服务器启动脚本
2. app.json pm2的配置文件，可以使用个pm2 app.json启动脚本
3. batch.js 服务器脚本启动前会调用的预处理函数
4. config.js 配置文件
5. gulpfile.js gulp的配置文件
6. load.js 自动加载路由，模块，服务的脚本
7. dist\ 存放用gulp生成用于生产环境的服务端内容
8. public\ 静态文件路径，配置文件里可定义
9. app\ 服务端的内容目录
10. app\views\ 存放前端的目录
11. app\views\images\ 存放前端所需要图像的目录
12. app\views\lib\ 存放前端所需要的链接库的目录
13. app\views\web\ 存放前端的页面的目录
14. app\node_modules\ 核心模块的目录
15. app\controllers\ 存放路由模块的目录
16. app\controllers\app.js 路由的进入点，自动加载路由的模块
17. app\models\ 存放表模型的目录
18. app\services\ 存放服务的目录

##部署方法
###开发环境
1. 运行webpack -w
2. 运行npm start
###生产环境
1. 运行webpack
2. 运行gulp
3. 把dist目录拷贝到生产环境
4. 在生产环境的dist目录下执行pm2 app.json