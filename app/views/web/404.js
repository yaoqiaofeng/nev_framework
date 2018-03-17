require('./base.js')();
require('./base.scss');

import error from './404.vue';

new Vue({
    el: '#app',
    render: h => h(error)
});