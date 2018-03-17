require('./base.js')();
require('./base.scss');
const router = new VueRouter({
    routes: [{
        path: '/', component: () => import('./index/home.vue')
    },{
        path: '/home', component: () => import('./index/home.vue')
    }]
});


import index from './index.vue';

new Vue({
    el: '#app',
    router: router,
    render: h => h(index)
});