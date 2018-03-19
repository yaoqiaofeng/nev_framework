<template lang="html">
	<div id="error">
		<v-header></v-header>  
        <img src="/images/500.png">
        <h3>{{message}}</h3>
        <el-button>返回首页</el-button>
		<v-footer></v-footer>  
	</div>
</template>

<script>
import header from './components/header.vue';
import footer from './components/footer.vue';
export default {
	data: function() {
		return {
            message: ""
        };
    },  
    components: {
    // <my-component> 将只在父组件模板中可用
        'v-header': header,
        'v-footer': footer
    }
}
</script>