<template lang="html">
	<el-container id="index" class="index" direction="vertical"> 
		<v-header :nav="nav" :active="0" :goto="onGoto" :user="user"></v-header>  
	    <el-container class="index-content" direction="horizontal"> 
            <el-aside width="200px" v-bar="{preventParentScroll: true,scrollThrottle: 30,}" class="index-aside">    
            </el-aside>  
            <router-view></router-view>
        </el-container>
    </el-container>
</template>
<script>
    export default {
        data: function () {
            return {}
        },
        mounted() {
        },
        methods: {
        }
    }
</script>
<style lang="scss">
@import "./var";
.index {
    background-color: $page-back;
    .index-content{        
        background-color: $main-back;
        .index-aside{
            background-color: $aside-back;
        }
    }
}
</style>