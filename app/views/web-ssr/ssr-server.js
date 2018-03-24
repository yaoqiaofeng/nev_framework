import Vuex from "vuex";
import axios from "axios";

function parseCookie(cookies){
    let cookie = ''
    Object.keys(cookies).forEach(item => {
        cookie += item + '=' + cookies[item] + '; '
    })
    return cookie
}
//负责通过axios获取数据
function api(options, cookies) {
    return new Promise((resolve, reject) => {
        let local = false;
        if (options.url[0] == '/') {
            options.url = 'http://127.0.0.1:' + process.env.PORT + options.url;
            local = true;
        }
        if (!options.headers) {
            options.headers = {};
        }
        if (cookies) {
            options.headers.Cookie = parseCookie(cookies);
        }
        if (!options.method) {
            options.method = 'get'
        }
        axios(options).then((response) => {
            let data = response.data;
            if (local) {
                if (data.result && (data.result = 'success')) {
                    resolve(data.data);
                } else {
                    reject(data.message);
                }
            } else {
                resolve(data)
            }
        }).catch(reject);
    })
}

//建立状态
function createStore(Vue, context, page, routes) {
    Vue.use(Vuex);
    let cookies = context.cookies;
    //删除cookies
    delete context.cookies;
    return new Vuex.Store({
        state: page.serverData,
		actions: {
            api: function ({ commit }, options) {
                return api(options, cookies).then(data => {
                    commit('set', { name: options.name, data });
                });
            }
        },
		mutations: {
            set: (state, { name, data }) => {
                Vue.set(state, name, data);
            }
        },
	});
}

import VueRouter from "vue-router";
import { sync } from "vuex-router-sync";
function createRouter(Vue, context, page, routes) {
    Vue.use(VueRouter);
	return new VueRouter({
	//	mode: "history",
		routes: routes
	});
}

//page：vue页面
//data：需要用来渲染页面的数据
//routes：路由
function createApp({ Vue, context, page, routes}) {

	//合并从上下文参数传递过来的数据
    let pageData = page.data;
    let serverData = context.data;
	page.data = function() {
        return Object.assign(pageData(), serverData);
	};
    //删除自定义的data数据结构
    delete context.data;

    let vue = {};
    
    //建立vuex
    vue.store = createStore(Vue, context, page);

    //建立路由
    if (routes) {
        vue.router = createRouter(Vue, context, page, routes);
	    // 同步路由状态(route state)到 store
        sync(vue.store, vue.router);
    }

	//
	vue.render = h => h(page);
	// 创建应用程序实例
    const app = new Vue(vue);
    
	// 暴露 app, router 和 store。
	return {
		app,
		router: vue.router,
		store: vue.store
	};
}


/*
Vue: 传递进Vue的实例
context: 渲染的上下文参数
page: vue页面
routes: 路由
routes 示例：
    [
      { path: '/', component: () => import('./components/Home.vue') },
      { path: '/item/:id', component: () => import('./components/Item.vue') }
    ]
*/
export default ({ Vue, context, page, routes}) => {
	// 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
	// 以便服务器能够等待所有的内容在渲染前，
	// 就已经准备就绪。
    return new Promise((resolve, reject) => {
        //建立vue实例
        const { app, store, router } = createApp({Vue, context, page, routes});
        //假如存在路由
        if (router) {
            // 设置服务器端 router 的位置
            router.push(context.url);
            // 等到 router 将可能的异步组件和钩子函数解析完
            router.onReady(() => {
                const matchedComponents = router.getMatchedComponents();
                // 匹配不到的路由，执行 reject 函数，并返回 404
                if (!matchedComponents.length) {
                    return reject({ code: 404 });
                }
                if (store) {
                    // 对所有匹配的路由组件调用 `asyncData()`
                    Promise.all(matchedComponents.map(Component => {
                        if (Component.asyncData) {
                            return Component.asyncData({
                                store,
                                route: router.currentRoute
                            })
                        }
                    })).then(() => {
                        // 在所有预取钩子(asyncData hook) resolve 后，
                        // 我们的 store 现在已经填充入渲染应用程序所需的状态。
                        // 当我们将状态附加到上下文，
                        // 并且 `template` 选项用于 renderer 时，
                        // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
                        context.state = store.state
                        resolve(app)
                    }).catch(reject)
                } else {
                    // Promise 应该 resolve 应用程序实例，以便它可以渲染
                    resolve(app);
                }
            }, reject);
        //假如存在vuex
        } else if (store) {
            if (page.asyncData) {
                page.asyncData({ store }).then(() => {
                    context.state = store.state
                    resolve(app);
                 }).catch(reject)
            } else {
                resolve(app);
            }
        //否则直接返回
        } else {
            resolve(app);
        }        
	});
};
