<template>
	<i class="iconfont icon-cart" :title="title"></i>
</template>

<script>
	export default {
		name: 'Cart',
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
