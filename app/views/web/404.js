import header from './components/header.vue';
import footer from './components/footer.vue';
Vue.component('v-header', header);
Vue.component('v-footer', footer);

import error from './404.vue';

error.title = document.title + '-Î´ÄÜÕÒµ½Ò³Ãæ';

new Vue({
    el: '#app',
    render: h => h(error)
});