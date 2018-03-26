<template lang="html">
	<div id="error">
        <img src="/images/500.png">
        <h3>{{message}}</h3>
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