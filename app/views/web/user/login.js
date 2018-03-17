require('../base.js')();
require('../base.scss');

import login from './login.vue';

new Vue({
    el: '#app',
    render: h => h(login)
});