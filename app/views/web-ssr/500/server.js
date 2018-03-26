
import page from "./index.vue";
import server from "plugin/ssr-server";
import Vue from "vue";
import ElementUI from 'element-ui'
import header from '../components/header.vue';
import footer from '../components/footer.vue';
Vue.component('v-header', header);
Vue.component('v-footer', footer);
Vue.use(ElementUI);

export default context => {
    return server({ Vue, context, page});
}