Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

var vup = {};
vup.install = function(Vue, options) {
    Vue.prototype.vup = {
        loading: 0,
        vue: null,
        confirm(title, content){
            return new Promise((resolve, reject) => {
                this.$confirm(content, title, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {        
                    resolve(true);
                }).catch(() => {
                    resolve(false);
                });;  
            });
        },
        message(title, content) {
            this.vue.$alert(content, title);
        },
        free() {
            return this.loading <= 0;
        },
        begin(title) {
            this.loading = +1;
            if (this.loading > 0) {
                this.vue.$loading({
                    lock: true,
                    text: title
                });
            }
        },
        cookie(name, value){
            if (typeof value=='undefined'){
                let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
                if(arr=document.cookie.match(reg)){
                    return unescape(arr[2]);
                } else{
                    return null;
                }
            } else if (value){                    
                let Days = 30;
                let exp = new Date();
                exp.setTime(exp.getTime() + Days*24*60*60*1000);
                document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
            } else {                    
                let exp = new Date();
                exp.setTime(exp.getTime() - 1);
                let cval=this.cookie(name);
                if(cval!=null){
                    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
                }
            }
        },
        param(name, value) {
            if (typeof value=='undefined'){
                return (
                    decodeURIComponent(
                        (new RegExp(
                            "[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)"
                        ).exec(location.href) || ["",""])[1].replace(/\+/g, "%20")
                    ) || null
                );
            } else {             
            }
        },
        end() {
            this.loading = -1;
            if (this.loading <= 0) {
                this.vue.$loading().close();
                this.loading = 0;
            }
        },
        get(url, options) {
            if (options.load) {
                this.begin("加载中");
            }
            return new Promise((resolve, reject) => {
                thisaxios.get(url, options).then(
                    response => {
                        if (options.load) {
                            this.end();
                        }
                        let data = response.data;
                        if (data.result == "success") {
                            resolve(data.data);
                        } else if (
                            data.result == "fail" &&
                            data.code == 401 &&
                            options.autologin
                        ) {
                            window.location.href = "user/login.html";
                            resolve();
                        } else {
                            reject(data.message);
                        }
                    },
                    response => {
                        if (options.load) {
                            this.end();
                        }
                        reject("未能连接到服务器");
                    }
                );
            });
        },
        post(url, body, options) {
            if (options.load) {
                this.begin("提交中");
            }
            return new Promise((resolve, reject) => {
                axios.post(url, body, options).then(
                    response => {
                        if (options.load) {
                            this.end();
                        }
                        let data = response.data;
                        if (data.result == "success") {
                            resolve(data.data||data.message||null);
                        } else if (
                            data.result == "fail" &&
                            data.code == 401
                        ) {
                            window.location.href = "user/login.html";
                            resolve();
                        } else {
                            reject(data.message);
                        }
                    },
                    response => {
                        if (options.load) {
                            this.end();
                        }
                        reject("未能连接到服务器");
                    }
                );
            });
        },
        put(url, body, options) {
            if (options.load) {
                this.begin("提交中");
            }
            return new Promise((resolve, reject) => {
                axios.put(url, body, options).then(
                    response => {
                        if (options.load) {
                            this.end();
                        }
                        let data = response.data;
                        if (data.result == "success") {
                            resolve(data.data||data.message||null);
                        } else if (
                            data.result == "fail" &&
                            data.code == 401
                        ) {
                            window.location.href = "user/login.html";
                            resolve();
                        } else {
                            reject(data.message);
                        }
                    },
                    response => {
                        if (options.load) {
                            this.end();
                        }
                        reject("未能连接到服务器");
                    }
                );
            });
        },
        delete(url, body, options) {
            if (options.load) {
                this.begin("删除中");
            }
            return new Promise((resolve, reject) => {
                axios.delete(url, options).then(
                    response => {
                        if (options.load) {
                            this.end();
                        }
                        let data = response.data;
                        if (data.result == "success") {
                            resolve(data.data||data.message||null);
                        } else if (
                            data.result == "fail" &&
                            data.code == 401
                        ) {
                            window.location.href = "user/login.html";
                            resolve();
                        } else {
                            reject(data.message);
                        }
                    },
                    response => {
                        if (options.load) {
                            this.end();
                        }
                        reject("未能连接到服务器");
                    }
                );
            });
        }
    };
};
Vue.use(vup);
Vue.mixin({
    mounted() {
        this.vup.vue = this;
    }
});

Vue.directive("title", {
    inserted: function(el, binding) {
        document.title = document.title + "-" + binding.value;
    }
});

Vue.filter('datetime', function(value) {
    var time = " " + new Date(value).getTime();
    var time = time.substr(time.length - 5, 5);
    if (time == '00000') {
        return new Date(value).Format('yyyy-MM-dd');
    } else if (time.trim() == "0") {
        return ""
    } else {
        return new Date(value).Format('yyyy-MM-dd hh:mm:ss');
    }
});

Vue.filter('date', function(value) {
    var time = " " + new Date(value).getTime();
    return new Date(value).Format('yyyy-MM-dd');
});

Vue.filter('html', function(value) {
    value = value.replace(/<[/]*[^>]+>/igm,"");
    value = value.replace(/&nbsp;/igm, ' ');
    return value;
});