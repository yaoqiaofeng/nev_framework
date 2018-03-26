//页面
import page from "./index.vue";
import client from "plugin/ssr-client";
import header from '../components/header.vue';
import footer from '../components/footer.vue';
Vue.component('v-header', header);
Vue.component('v-footer', footer);

let el = '#error';
client({ page, el });