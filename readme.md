# 说明
基于Nodejs+Express+Vue的开发框架，配置好了webpack（编译前端文件），gulp（生成生产环境文件）。     
这是一个侵入性不大的框架，框架的前端后端各模块之间属于松散结构，想要替换修改也比较简单。     
1. 静态前端基于vue，并且有多页面服务端渲染和静态页面两种选择，当然也可以随意使用自己的喜欢的模板引擎。
2. 数据库默认实现了MySQL和SQLServer的封装，如果使用其他数据库，参照db模块增加封装即可。   
3. 数据库缓存基于redis，如果不用redis，对着模块cache自己写一个缓存接口。   
4. 如果不用Express，只需要替换和app\controllers\app.js即可。   
---
## 文件目录结构
* 根目录
1. app.js 服务器启动脚本
2. loader.js 模块，服务，配置，路由，数据模型的及加载器
3. nodemon.json nodemon的启动配置文件
4. pm.json pm2的配置文件，可以使用个pm2 pm.json启动脚本
4. configs 存放各种配置文件的目录
5. app 服务端的内容目录
6. public 静态文件路径，配置文件里可定义
7. logs 日志文件输出目录
8. tools 配套工具目录
9. dist 编译后用于发布的内容生成目录
* configs 目录
1. config.js 配置文件
2. gulp.js gulp的配置文件
3. webpack.base.js webpack的基本配置
4. webpack.static.js webpack静态打包的配置
5. webpack.ssr.js webpack服务器渲染的打包配置
6. build.js 编译脚本
7. dev.js 开发环境运行脚本
8. postcss.config.js postcss配置文件
* app目录
1. controllers 存放路由
2. models 存放表模型的
3. services 存放服务的
4. modules 存放模块的目
5. views 存放前端的目录
* controllers目录
1. app.js 路由的进入点，自动加载路由的模块
2. plugin 存放路由模块的插件
* views 目录
2. images 存放前端所需要图像的目录
3. lib 存放前端所需要的链接库的目录
4. plugin 存放前端插件
5. web 存放前端的页面的目录
6. web-ssr 存放服务端渲染的页面的目录

---
## 开发说明
### 前端模块
### 路由模块
默认的路由模块基于Express
新增路由模块只需要在 app\controllers 目录下增加文件，
格式如下：
```java
module.exports = {
    //所有路由最开始加载的入口
	init(app) {
	},
    //在init之后，在静态文件之前加载的入口
	static(app) {
	},
    //在静态文件之后加载的入口
	listening(app) {
	}
}
```
---
### 表模型模块
表模型有全缓存模型（CacheModel）和SQL模型（SqlModel）

* CacheModel
1. CacheModel 会在初次访问表的时候，一次性把表的数据加载到Redis内存缓存中，以后的访问都是从Redis中加载数据。
2. CacheModel 在数据变更的时候，包括新增，修改，删除操作，都会同步更新数据库和Redis。

* SqlModel
1. SqlModel 不做数据缓存，每一次都是重新从数据库加载数据
2. SqlModel 的sql语句可以使用一些简单的条件判断和宏替换，做到有选择性的过滤和写入。

表模型有相应的生成工具，在 tools\数据模型\nModel.exe。

---
### 服务模块
服务模块有标准模型服务（ModelService）和自定义服务（Custom Service）
* ModelService 示例代码如下 
```javascript
/*
 *   用户模块
 * */
const {ModelService} = modules("serviceObject");
const models = modules('models');

class user extends ModelService{

    //返回服务名
    static name() {
        return 'user'
    } 

    //返回对应的主模型名称
    static modelName() {
        //如果主模型名称和服务名一致，不需要重载此函数
        return 'user'
    } 

     //操作权限验证
    static doAuth(data, env, op) {
        //op为操作方法，例如get, add，具体可看serviceObject
        //data为前端回传参数，包含Url参数和post的参数
        //env为环境参数，包含当前用户信息
        return true
    }

    //输出数据过滤
    static async doFilter(data, env, row) {
        //data为前端回传参数，包含Url参数和post的参数
        //env为环境参数，包含当前用户信息
        //row为当前需要过滤数据行
        //返回值为boolean值，
        return true；
    }    
    
    //输出数据补充过程
    static async doJoin(data, env, row, op) {
        //data为前端回传参数，包含Url参数和post的参数
        //env为环境参数，包含当前用户信息
        //row为当前需要过滤数据行
        //op为操作，有get和list两种情况。
        //补充数据直接写入row即可，一般用于外键连接。
    }

    //服务更新数据的调用过程
	static async doUpdate(data, env, conn, multi) {
        //引发错误可跳出过程
        //此次可以添加一些数据校验和附加表的写入。
        return super.doUpdate(data, env, conn, multi);
    }

    //服务删除数据的调用过程
	static async doDelete(data, env, conn, multi) {
        //引发错误可跳出过程
        //此次可以添加一些数据校验。
        return super.doDelete(data, env, conn, multi);
    }


    //服务添加数据的调用过程
	static async doAdd(data, env, conn, multi) {
        //引发错误可跳出过程
        //此次可以添加一些数据校验和附加表的写入。
        return super.doAdd(data, env, conn, multi);
    }

}

module.exports = user; 
```
* CustomService

具体可参考serviceObject模块。

---
### 核心模块
#### cache
缓存模块，用于快速读写redis
#### date
日期处理模块
#### logger
日志模块
#### db
数据库模块，提供数据库读写接口
#### modelObject
表模型基类
#### serviceObject
服务基类

---
## 部署方法
### 开发环境
1. 运行npm start 开启开发服务器
### 生产环境
1. 运行npm build打包生产环境
2. 把dist目录拷贝到生产环境
3. npm install
4. 在生产环境安装pm2
5. 在生产环境的dist目录下执行pm2  pm.json