
import page from "./app.vue";
import server from "../ssr-server";
import Vue from "vue";
import ElementUI from 'element-ui'
Vue.use(ElementUI);

let routes = [
    { path: '/user/login', component: () => import('./user/login.vue') },
    { path: '/', component: () => import('./home.vue') }
]
export default context => {
    return server({ Vue, context, page, routes });
}