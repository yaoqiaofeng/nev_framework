<template lang="html">
    <el-container id="app">
        <v-header></v-header>
        <!-- 路由出口 -->
        <!-- 路由匹配到的组件将渲染在这里 -->
        <router-view></router-view>
        <v-footer></v-footer>
    </el-container>
</template>

<script>
import header from './components/header.vue';
import footer from './components/footer.vue';
export default {
    /*asyncData({ store }) {
        return store.dispatch('api', { name: "user", url: '/api/user/list' });
    },
    serverData() {
        return {
            user: {}
        }
    },*/
	data: function() {
		return {};
    },  
    components: {
    // <my-component> 将只在父组件模板中可用
        'v-header': header,
        'v-footer': footer
    },
    computed: {
      /*  users: {
            get() {
                return this.$store.state.users
            },
            set(value) {
                this.$store.commit('set', { name: 'users', data: value });
            }
        }*/
    }    
}
</script>