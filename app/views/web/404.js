import header from './components/header.vue';
import footer from './components/footer.vue';
Vue.component('v-header', header);
Vue.component('v-footer', footer);

import error from './404.vue';

new Vue({
    el: '#app',
    render: h => h(error)
});