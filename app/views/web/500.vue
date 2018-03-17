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
	data: function() {
		return {
			message: ""
		};
	},
	mounted() {
        let msg = this.vup.cookie("500").split(",");
        console.log(msg);
		let message = "";
		for (let i = 0; i < msg.length; i++) {
			message = message+String.fromCharCode(parseInt(msg[i],16));
        }
		this.message = message;
		this.vup.cookie("500", "");
	}
};
</script>