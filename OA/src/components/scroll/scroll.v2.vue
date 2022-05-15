<template>
	<div class="wrapper" ref="wrapper">
		<div class="content">
			<slot></slot>
		</div>
	</div>
</template>

<script>
	import BScroll from '@better-scroll/core';//@2.42
	import PullDown from '@better-scroll/pull-down';
	import Pullup from '@better-scroll/pull-up';

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
			pullDownRefresh: {
				type: Object,
				default() {
					return {
						threshold: -1,//触发刷新所必须的下拉距离 90
						stop: -1,//回弹停留的距离 40
					};
				},
			},
			pullUpLoad: {
				type: Boolean,
				default() {
					return false;
				},
			},
			click: {
				// 被包裹的的点击事件是否有效
				type: Boolean,
				default() {
					return true;
				},
			},
		},
		methods: {
			scrollTo(x, y, time = 500) {
				this.betterScroll.scrollTo(x, y, time);
			},
			finishPullDown() {
				//标识一次下拉动作结束,在 finishPullDown() 方法调用前不会触发下一次的 pullingDown 事件。
				this.betterScroll.finishPullDown();
			},
			finishPullUp() {
				//上拉加载动作结束,在 finishPullUp() 方法调用前不会触发下一次的 pullingUp 事件。
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
			//#region 注册BScroll插件
			let pullDownRefreshOptions = false;
			if (this.pullDownRefresh.threshold > 0 && this.pullDownRefresh.stop >= 0) {
				BScroll.use(PullDown);
				pullDownRefreshOptions = this.pullDownRefresh;
			}
			if (this.pullUpLoad) {
				BScroll.use(Pullup);
			}
			//#endregion

			let options = {
				probeType: this.probeType,
				pullDownRefresh: pullDownRefreshOptions,
				pullUpLoad: this.pullUpLoad,
				click: this.click,
			};
			this.betterScroll = new BScroll(this.$refs.wrapper, options);

			//#region 监听事件
			if (this.probeType > 0 && this.probeType < 4) {
				//滚动事件
				this.betterScroll.on('scroll', position => this.$emit("scroll", position));
			}
			if (this.pullDownRefresh.threshold > 0 && this.pullDownRefresh.stop >= 0) {
				//下拉事件
				this.betterScroll.on("pullingDown", () => this.$emit("pullingDown"));
			}
			if (this.pullUpLoad) {
				//上拉事件
				this.betterScroll.on("pullingUp", () => this.$emit("pullingUp"));
			}
			//#endregion
		},
	};
</script>

<style scoped>
	.wrapper {
		overflow: hidden;
	}
</style>
