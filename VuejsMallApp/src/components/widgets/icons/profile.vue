<template>
	<i class="iconfont icon-profile" :title="title"></i>
</template>

<script>
	export default {
		name: 'Profile',
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
