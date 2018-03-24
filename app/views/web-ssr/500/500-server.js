
import page from "./500.vue";
import server from "./ssr-server";
import Vue from "vue";
import ElementUI from 'element-ui'
import header from './components/header.vue';
import footer from './components/footer.vue';
Vue.components('v-header', header);
Vue.components('v-footer', footer);
Vue.use(ElementUI);

export default context => {
    return server({ Vue, context, page});
}