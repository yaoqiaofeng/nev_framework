//页面
import page from "./index.vue";
import client from "plugin/ssr-client";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import header from '../components/header.vue';
import footer from '../components/footer.vue';
Vue.component('v-header', header);
Vue.component('v-footer', footer);
Vue.use(ElementUI);
import 'lib/base.js';
import 'lib/base.css';

let routes = [
    { path: '/app/user/login', component: () => import('./user/login.vue') },
    { path: '/app/', component: () => import('./home.vue') }
];
let el = '#app';
client({ page, el, routes });