## 说明
---
基于Nodejs+Express+Vue的开发框架，配置好了webpack（编译前端文件），gulp（生成生产环境文件）。     
这是一个侵入性不大的框架，框架的前端后端各模块之间属于松散结构，想要替换修改也比较简单。     
前端基于vue，如果用着不满意，替换掉lib下的链接库。    
如果使用的是服务器渲染的模板引擎，请不要运行webpack。    
数据库基于mysql，如果不是用mysql，对着核心模块下的db自己写一个数据库接口。   
缓存基于redis，如果不用redis，对着核心模块下的cache自己写一个缓存接口。    
如果数据库修改源不是独占的，那么用表模型可能就不适用，那就直接在service里写sql。    
如果不用Express，那么就可能麻烦点了，需要修改根目录下的app.js和app\controllers\app.js。   
   
## 文件目录结构
---
1. app.js 服务器启动脚本
2. pm.js pm2的配置文件，可以使用个pm2 pm.js启动脚本
3. batch.js 服务器脚本启动前会调用的预处理函数
4. config.js 配置文件
5. gulpfile.js gulp的配置文件
6. load.js 自动加载路由，模块，服务的脚本
7. webpack.base.js webpack的基本配置
8. webpack.static.js webpack静态打包的配置
9. webpack.ssr.js webpack服务器渲染的打包配置
10. dist\ 存放用gulp生成用于生产环境的服务端内容
11. public\ 静态文件路径，配置文件里可定义
12. app\ 服务端的内容目录
13. app\views\ 存放前端的目录
14. app\views\images\ 存放前端所需要图像的目录
15. app\views\lib\ 存放前端所需要的链接库的目录
16. app\views\web\ 存放前端的页面的目录
17. app\views\web-ssr\ 存放服务端渲染的页面的目录
18. app\views\web-ssr-lib\ 存放服务端渲染的链接库
19. app\node_modules\ 核心模块的目录
20. app\controllers\ 存放路由模块的目录
21. app\controllers\app.js 路由的进入点，自动加载路由的模块
22. app\controllers\processor 存放路由模块的附加处理器
23. app\models\ 存放表模型的目录
24. app\services\ 存放服务的目录

## 开发说明
---
### 前端模块
几个注意点需要说明下：
1. webpack是用于打包前端模块，加-w参数启动的时候，会写入source map，并且不压缩js。
2. images目录和lib目录会直接复制到配置文件里配置好的静态目录下
3. web目录下的文件打包后的根目录为配置文件里配置好的静态目录
2. 打包的js的模板文件名为template.html，对应的模板文件从同目录下的逐级往上查找，web目录下必须保证有一个默认的模板文件。

### 路由模块

### 表模型模块

### 服务模块

### 核心模块
#### cache
缓存模块，用于快速读写redis
#### config
配置模块，加载根目录下的config.js，用于全局方便加载
#### db
数据库模块，提供数据库读写接口
#### init
初始化模块
#### model
表模型获取和注册模块
#### modelObject
表模型基类
#### service
服务获取和注册模块
#### serviceObject
服务基类

## 部署方法
---
### 开发环境
1. 运行webpack -w
2. 运行npm start
### 生产环境
1. 运行webpack
2. 运行gulp
3. 把dist目录拷贝到生产环境
4. 在生产环境安装pm2
5. 在生产环境的dist目录下执行pm2  pm.js