<template>
	<div class="wrapper" ref="wrapper">
		<div class="content">
			<slot></slot>
		</div>
	</div>
</template>

<script>
	//基于better-scroll@1封装的vue组件，只实现了部分功能
	import BScroll from 'better-scroll';//@1.15.2

	export default {
		name: 'scroll',
		data() {
			return {
				betterScroll: null,
			};
		},
		props: {
			probeType: {
				/*
				监听滚动的位置,可选值：0、1、2、3
				默认值为 0，即不派发 scroll 事件。
				为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
				为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
				为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
				*/
				type: Number,
				default() {
					return 0;
				},
			},
			pullUpLoad: {
				type: Boolean,
				default() {
					return false;
				},
			},
		},
		methods: {
			scrollTo(x, y, time = 500) {
				this.betterScroll.scrollTo(x, y, time);
			},
			finishPullUp() {
				this.betterScroll.finishPullUp();
			},
			refresh() {
				//重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常
				this.betterScroll.refresh();
				console.log("refresh滚动条高度", this.betterScroll.scrollerHeight);
			},
			y() {
				//返回当前的y坐标
				return this.betterScroll.y;
			},
		},
		mounted() {
			//实例化 配置监听滚动 上拉 点击
			this.betterScroll = new BScroll(this.$refs.wrapper, {
				probeType: this.probeType,
				pullUpLoad: this.pullUpLoad,
				click: true,
			});
			if (this.probeType > 0 && this.probeType < 4) {
				//on()方法监听当前实例上的scroll事件
				this.betterScroll.on('scroll', position => {
					this.$emit("position", position);
				});
			}
			if (this.pullUpLoad) {
				//on()方法监听当前实例上的底部上拉事件
				this.betterScroll.on("pullingUp", () => {
					this.$emit("pullingUp");
				});
			}
		},
	};
</script>

<style scoped>
	.wrapper {
		overflow: hidden;
	}
</style>
