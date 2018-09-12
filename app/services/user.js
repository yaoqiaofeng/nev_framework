/*
 *   用户模块
 * */
const {ModelService} = modules("serviceObject");
const models = modules('models');
const moment= require("moment");
const jwt = require('jwt-simple');
const secret = require('config').jwt.secret;
const crypto = require('crypto');

class user extends ModelService{

   static name() {
        return "user";
    } 

    static doAuth(data, env, op) {
        if ((op=='get') || (op=='list')){
            switch (env.identity) {
                case 'admin':
                    return true;
                default: 
                    throw '权限不足';
            }
        } else if ((op=='update') && (data.id==env.user_id)){
            return true
        } else if (env.identity=='admin') {
            return true;
        } else {
            return false;
        }            
    }

    //获取列表数据的处理过程
    //data: 传递外部调用的数据
    static async doFilter(data, env, row) {
        switch (env.identity) {
            case 'admin':
                return this.filterByObject(data.filter, row) && this.search(row, ['username','name','tel','email'], data.search);;
            default:
                return [];
        }
    }


    static async change(data, env) {
        console.log('service.user.change');
        data.password = crypto.createHash('md5').update(data.password).digest('hex');
        let User = models("user");
        let user = await User.select({
            id : env.user_id,
            password: data.password
        });
        if (user.length==0){
            throw '密码错误！';
        }
        let row = {
            id: env.user_id
        };
        if (data.new_username) {
            let all = await User.select();
            for(let i=0; i<all.length; i++){
                if ((all[i].id != env.user_id) && (all[i].username==data.new_username)){
                    throw "用户名已存在，请选择其他用户名！";
                }
            }
            row.username = data.new_username;
        }
        if (data.new_password) {
            row.password =crypto.createHash('md5').update(data.new_password).digest('hex');
        }
        await User.update(row);
    }

    static async register(data) {
        console.log('service.user.register');
        let User = models("user");
        let all = await User.select();
        for(let i=0; i<all.length; i++){
            if (all[i].username==data.username){
                throw "用户名已存在，请选择其他用户名！";
            }
            if ((data.tel) && (all[i].tel==data.tel)){
                throw "手机号码已被注册，请使用其他手机号码！";
            }
            if ((data.email) && (all[i].email==data.email)){
                throw "电子邮箱已被注册，请使用其他电子邮箱！";
            }
            if ((data.wx_openId) && (all[i].wx_openId==data.wx_openId)){
                throw "该微信绑定了其他用户，请使用其他微信号！";
            }
        }
        let row = {};
        if (data.username) row.username = data.username;
        if (data.password) row.password =crypto.createHash('md5').update(data.password).digest('hex');
        if (data.wx_openId) row.wx_openId = data.wx_openId;
        if (data.tel) row.tel = data.tel;
        if (data.email) row.email = data.email;
        if (data.name) row.name = data.name;
        if (data.image) row.image = data.image;
        await User.insert(row);
    }

    //data-param
    //username:
    //password:
    static async login(data) {
        console.log('service.user.login');
        let User = models("user");
        let user = {};
        let all = await User.select();
        for(let i=0; i<all.length; i++){
            if ((all[i].username==data.username) ||
                (all[i].tel==data.username) ||
                (all[i].email==data.username)){
                user = all[i];
                break;
            }
        }
        if (user.id != undefined) {
            let password = crypto.createHash('md5').update(data.password).digest('hex').toUpperCase();
            if (user.password.toUpperCase() == password){
                return {
                    username:user.username,
                    password: data.password,
                    login_date: moment()
                };
            } else {
                throw "没有找到该用户，请检查用户名或者密码！";
            }               
        } else {
            throw "没有找到该用户，请检查用户名或者密码！";
        }    
    }

    static token(data) {
        return jwt.encode(data, secret);
    }

    static token_decode(token) {
        return jwt.decode(token, secret);
    }

	static async doUpdate(data, env, conn, multi) {
        if (data.password){
            data.password = crypto.createHash('md5').update(data.password).digest('hex').toUpperCase();
        }
        return super.doUpdate(data, env, conn, multi);
    }

	static async doAdd(data, env, conn, multi) {
        if (!data.type){
            throw "必须用户类型";
        }
        data.password = crypto.createHash('md5').update('8888').digest('hex').toUpperCase();
        return super.doAdd(data, env, conn, multi);
    }

    static  async valid(data){
        console.log('service.user.valid ');
        let row = {};
        if (data.username) {
            row.username = data.username;
            row.password = crypto.createHash('md5').update(data.password).digest('hex');
        } else if (data.wx_openId) {
            row.wx_openId = data.wx_openId;
        } else {
            return {};
        }
        let User = models("user");
        let dataset = await User.select(row);
        if (dataset.length>0){
            return {
                id: dataset[0].id,
                username: dataset[0].username,
                name: dataset[0].name,
                tel: dataset[0].tel,
                type: dataset[0].type,
                email: dataset[0].email
            };
        } else {
            return {};
        }   
    } 
}

module.exports = user; 