<template lang="html">
    <el-main id="home" class="home">
        这里是首页
        <el-button type="primary" @click="onGotoLogin">马上去登陆</el-button>
     </el-main>
</template>

<script>
export default {
    title: "首页",
    data() {
        return {
        };
    },
    methods: {
        onGotoLogin() {
            console.log('AAAAA');
            this.$router.push({ path: '/app/user/login' })
        }
    }
    
}
</script>