<template>
	<div class="setTimeOut">
		{{num}}
	</div>
</template>

<script>
	export default {
		name: 'SetTimeOut',
		data() {
			return {
				num: 0,
			};
		},
		props: {
			count: {
				type: Number,
				default() {
					return 10;
				},
			},
			toDo: {
				type: Function,
			},
		},
		methods: {
			countDown(t) {
				if (t >= 0) {
					this.num = t;
					setTimeout(() => {
						t--;
						this.countDown(t);
					}, 1000);
				}
				else {
					if (this.toDo != null) {
						this.toDo();
					}
				}
			},
		},
		mounted() {
			let n = this.count;
			this.$nextTick(() => this.countDown(n));
		},
	};
</script>

<style scoped>
</style>
