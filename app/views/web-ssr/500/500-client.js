//页面
import page from "./500.vue";
import client from "../ssr-client";
import header from '../components/header.vue';
import footer from '../components/footer.vue';
Vue.components('v-header', header);
Vue.components('v-footer', footer);

let el = '#error';
client({ page, el });