import header from '../components/header.vue';
import footer from '../components/footer.vue';
Vue.component('v-header', header);
Vue.component('v-footer', footer);

import login from './login.vue';
login.title = document.title + '-用户登陆';
new Vue({
    el: '#app',
    render: h => h(login)
});