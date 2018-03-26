<template lang="html">
    <el-container id="app">
        <v-header></v-header>
        <!-- 路由出口 -->
        <!-- 路由匹配到的组件将渲染在这里 -->
        <router-view></router-view>
        <v-footer></v-footer>
    </el-container>
</template>
<style lang="css">
    #app{
        min-height: 100vh;
    }
</style>
<script>
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