//页面
import page from "./app.vue";
import client from "../ssr-client";

let routes = [
    { path: '/user/login', component: () => import('./user/login.vue') },
    { path: '/', component: () => import('./home.vue') }
]
let el = '#app';
client({ page, el, routes });