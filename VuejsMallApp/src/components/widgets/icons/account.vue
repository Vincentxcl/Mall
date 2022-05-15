<template>
	<i class="iconfont icon-zhanghao" :title="title"></i>
</template>

<script>
	export default {
		name: 'Account',
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
