import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

window.Vue = Vue;
window.axios = axios;

function api(options) {
    return new Promise((resolve, reject) => {
        let local = options.url[0] == '/';
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
    });
}

function createStore(page) {
    Vue.use(Vuex);
    return new Vuex.Store({
        state: page.serverData,
        actions: {
            api: function ({ commit }, options) {
                return api(options).then(data => {
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
function createRouter(page, routes) {
    Vue.use(VueRouter);
    return new VueRouter({
        mode: "history",
        routes: routes
    });
}

import { sync } from 'vuex-router-sync';
//page：vue页面
//data：需要用来渲染页面的数据
//routes：路由
function createApp({ page, routes }) {
    
    let vue = {};

    //建立vuex
    vue.store = createStore(page);

    //建立路由
    if (routes) {
        vue.router = createRouter(page, routes);
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

import NProgress  from 'nprogress';
export default ({ page, el, routes }) => {

    const { app, store, router } = createApp({ page, routes });

    //不启用路由模式
    if (!router) {
        page.asyncData({ store }).then(() => {
            app.$mount(el);
        });
        return;
    }

    //当路由组件重用（同一路由，但是 params 或 query 已更改，
    //例如，从 user / 1 到 user / 2）时，也应该调用 asyncData 函数。
    //我们也可以通过纯客户端(client - only)的全局 mixin 来处理这个问题：
    Vue.mixin({
        beforeRouteUpdate(to, from, next) {
            const { asyncData } = this.$options;
            if (asyncData) {
                asyncData({
                    store: this.$store,
                    route: to
                }).then(next).catch(next);
            } else {
                next();
            }
        }
    });

    //加载进度条
    NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false });

	router.onReady(() => {
		// 添加路由钩子函数，用于处理 asyncData.
		// 在初始路由 resolve 后执行，
		// 以便我们不会二次预取(double-fetch)已有的数据。
		// 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
		router.beforeResolve((to, from, next) => {
			const matched = router.getMatchedComponents(to);
			const prevMatched = router.getMatchedComponents(from);
			// 我们只关心之前没有渲染的组件
			// 所以我们对比它们，找出两个匹配列表的差异组件
			let diffed = false;
			const activated = matched.filter((c, i) => {
				return diffed || (diffed = prevMatched[i] !== c);
			});
			if (!activated.length) {
				return next();
            }
            // 组件数据通过执行asyncData方法获取
            const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
            if (!asyncDataHooks.length) {
                return next();
            }
            // 这里如果有加载指示器(loading indicator)，就触发
            NProgress.start();
            // 要注意asyncData方法要返回promise，asyncData调用的vuex action也必须返回promise
            Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
                .then(() => {
                    // 停止加载指示器(loading indicator)
                    NProgress.done();
                    next();
                })
                .catch(next);
		});
        app.$mount(el);
	});
};
