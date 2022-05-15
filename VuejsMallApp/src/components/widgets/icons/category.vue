<template>
	<i class="iconfont icon-category" :title="title"></i>
</template>

<script>
	export default {
		name: 'Category',
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
