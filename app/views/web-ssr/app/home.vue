<template lang="html">
    <el-main id="home" class="home" v-title="首页">
        这里是首页
        <el-button type="primary" @click="onGotoLogin">马上去登陆</el-button>
     </el-main>
</template>

<script>
export default {
    data() {
        return {
        };
    },
    methods: {
        onGotoLogin() {
            console.log(this.$router);
            this.$router.push({ path: '/user/login' })
        }
    }
    
}
</script>