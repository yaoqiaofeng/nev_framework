import header from './components/header.vue';
import footer from './components/footer.vue';
Vue.component('v-header', header);
Vue.component('v-footer', footer);

const router = new VueRouter({
    routes: [{
        path: '/', component: () => import('./index/home.vue')
    },{
        path: '/home', component: () => import('./index/home.vue')
    }]
});


import index from './index.vue';

index.title = document.title + '-首页';

new Vue({
    el: '#app',
    router: router,
    render: h => h(index)
});