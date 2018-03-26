<template lang="html">
	<div id="error">
		<v-header></v-header>  
        <img src="/images/500.png">
        <h3>{{message}}</h3>
		<v-footer></v-footer>  
	</div>
</template>

<script>
export default {
    data() {
        return {
            message: ""
        };
    }
}
</script>