<template>
	<i class="iconfont icon-mima" :title="title"></i>
</template>

<script>
	export default {
		name: 'Password',
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
	@import '~assets/css/icons/iconfont.css';
</style>
