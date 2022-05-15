<template>
	<i class="iconfont icon-yanzhengma" :title="title"></i>
</template>

<script>
	export default {
		name: 'Verification',
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
