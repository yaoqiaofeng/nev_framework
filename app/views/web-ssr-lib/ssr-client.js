import api from "./ssr-api";

Vue.use(Vuex);
function createStore() {
	new Vuex.Store({
		state: {
            items: {}
        },
		actions: {
            getData: function ({ commit }, name) {
                return api(name).then(data => {
                    commit('setItems', { name, data });
                });
            }
        },
		mutations: {
            setData: (state, { name, data }) => {
                Vue.set(state.items, name, data);
            }
        },
	});
}

Vue.use(VueRouter);
function createRouter(routes) {
	return new VueRouter({
		mode: "history",
		routes: routes
	});
}

//page：vue页面
//routes：路由
function createApp({ page,  routes }) {

	let vue = {};

	//建立vuex
	vue.store = createStore();

	//建立路由
	if (routes) {
		vue.router = createRouter(routes);
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

//import NProgress from 'nprogress'

if (window.__INITIAL_STATE__) {
	store.replaceState(window.__INITIAL_STATE__);
}

export default ({ page, el }) => {

	const { app, store, router } = createApp({
		page,
		routers: page.routes
    });

    console.log(app);
    if (!router) {
        return app.$mount(el);
    }
	//NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

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
			// 这里如果有加载指示器(loading indicator)，就触发
			Promise.all(
				activated.map(c => {
					if (c.asyncData) {
						return c.asyncData({ store, route: to });
					}
				})
			)
				.then(() => {
					// 停止加载指示器(loading indicator)
					// NProgress.done()
					next();
				})
				.catch(next);
		});
        app.$mount(el);
	});
};
