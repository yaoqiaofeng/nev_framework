import Vuex from "vuex";
import {data, api} from "./ssr-api";
function createStore(Vue, store, api) {
    Vue.use(Vuex);
	new Vuex.Store({
		state: store,
		actions: {
            getData: function ({ commit }, name) {
                return api(name).then(data => {
                    commit('setData', { name, data });
                });
            }
        },
		mutations: {
            setData: (state, { name, data }) => {
                Vue.set(state, name, data);
            }
        },
	});
}

import VueRouter from "vue-router";
import { sync } from "vuex-router-sync";
function createRouter(Vue, routes) {
    Vue.use(VueRouter);
	return new VueRouter({
		mode: "history",
		routes: routes
	});
}

//page：vue页面
//data：需要用来渲染页面的数据
//routes：路由
function createApp({Vue, page, data, routes, store, api}) {

	//合并从上下文参数传递过来的数据
	let old = page.data;
	page.data = function() {
		return Object.assign(old(), data);
	};

    let vue = {};
    
    //建立vuex
    vue.store = createStore(Vue, store, api);

    //建立路由
    if (routes) {
        vue.router = createRouter(Vue, routes);
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
routes 示例：
    [
      { path: '/', component: () => import('./components/Home.vue') },
      { path: '/item/:id', component: () => import('./components/Item.vue') }
    ]
*/
export default ({Vue, context, page, routes, store, api}) => {
	// 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
	// 以便服务器能够等待所有的内容在渲染前，
	// 就已经准备就绪。
	return new Promise((resolve, reject) => {
		const { app, store, router } = createApp({
            Vue,
            page,
            data: context.data, 
            routes,
            store, 
            api
        });
        if (router){
    		// 设置服务器端 router 的位置
	    	router.push(context.url);
		    // 等到 router 将可能的异步组件和钩子函数解析完
	    	router.onReady(() => {
    			const matchedComponents = router.getMatchedComponents();
		    	// 匹配不到的路由，执行 reject 函数，并返回 404
			    if (!matchedComponents.length) {
				    return reject({ code: 404 });
                }
                if (store){                    
                    // 对所有匹配的路由组件调用 `asyncData()`
                    Promise.all(matchedComponents.map(Component => {
                        if (Component.asyncData) {
                        return Component.asyncData({
                            store,
                            route: router.currentRoute
                        })
                        }
                    })).then(() => {
                        // 在所有预取钩子(preFetch hook) resolve 后，
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
        } else {
            resolve(app);
        }        
	});
};
