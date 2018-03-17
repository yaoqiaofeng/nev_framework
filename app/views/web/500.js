require('./base.js')();
require('./base.scss');

import error from './500.vue';

new Vue({
    el: '#app',
    render: h => h(error)
});