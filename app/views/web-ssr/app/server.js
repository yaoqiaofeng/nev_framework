
import page from "./index.vue";
import server from "plugin/ssr-server";
import ElementUI from 'element-ui'
import header from '../components/header.vue';
import footer from '../components/footer.vue';
Vue.component('v-header', header);
Vue.component('v-footer', footer);
Vue.use(ElementUI);
import  'lib/base.js';

let routes = [
    { path: '/app/user/login', component: () => import('./user/login.vue')},
    { path: '/app/', component: () => import('./home.vue')}
];
export default context => {
    return server({ context, page, routes });
}