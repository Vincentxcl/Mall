<template>
	<i class="iconfont icon-home" :title="title"></i>
</template>

<script>
	export default {
		name: 'Home',
		props: {
			title: {
				type: String,
				default() {
					return '';
				},
			},
		},
	}
</script>

<style scoped>
	@import '~assets/css/navBar/iconfont.css';
</style>
