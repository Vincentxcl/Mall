<template>
	<i class="iconfont icon-shuaxin" :title="title"></i>
</template>

<script>
	export default {
		name: 'Refresh',
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
