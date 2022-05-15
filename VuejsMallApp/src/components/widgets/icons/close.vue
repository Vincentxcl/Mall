<template>
	<i class="iconfont icon-guanbi" :title="title"></i>
</template>

<script>
	export default {
		name: 'Close',
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
