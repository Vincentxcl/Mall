<template>
	<div class="verificationCode" :style="cpnStyle" @click="refresh">
		<div class="code" :style="codeStyle">
			<flicker :style="divStyle">{{tips}}</flicker>
			<img :src="adjustedImgSrc" :style="imgStyle" @load="imgOnLoad" />
		</div>

		<div class="tip" :style="divStyle">
			<slot>看不清</slot>
		</div>
	</div>
</template>

<script>
	import Flicker from 'components/widgets/flicker.vue';

	export default {
		name: 'VerificationCode',
		data() {
			return {
				tips: 'Loading',
				t: '0',
				isPositive: true,//刷新按钮是否
				imgOpacity: 1,
				handlerInvalid: null,
			};
		},
		props: {
			width: {
				type: Number,
				default() {
					return 80;
				},
			},
			height: {
				type: Number,
				default() {
					return 36;
				},
			},
			imgSrc: {
				type: String,
				required: true,
				default() {
					return '';
				},
			},
			effectiveDuration: {
				type: Number,
				default() {
					return 1000 * 60 * 5;
				},
			},
			refreshLockDuration: {
				type: Number,
				default() {
					return 1000 * 5;
				},
			},
		},
		computed: {
			cpnStyle() {
				return {
					'cursor': this.isPositive ? 'pointer' : ' not-allowed',
				};
			},
			codeStyle() {
				return {
					width: this.width + 'px',
					height: this.height + 'px',
				};
			},
			divStyle() {
				return {
					'line-height': this.height + 'px',
				};
			},
			imgStyle() {
				return {
					opacity: this.imgOpacity,
					top: (-this.height) + 'px',
				};
			},
			adjustedImgSrc() {
				return this.imgSrc + "?t=" + this.t;
			},
		},
		methods: {
			imgOnLoad() {
				//解锁刷新按钮
				setTimeout(() => {
					this.isPositive = true;
				}, this.refreshLockDuration);

				//图片失效
				clearTimeout(this.handlerInvalid);
				this.handlerInvalid = setTimeout(() => {
					this.imgOpacity = 0.3;
					this.tips = "已失效！";
				}, this.effectiveDuration);
			},
			refresh() {
				if (this.isPositive) {
					this.t = new Date().getMilliseconds();
					this.tips = "Loading";
					this.imgOpacity = 1;
					this.isPositive = false;
				}
			},
		},
		components: {
			Flicker,
		},
	}
</script>

<style scoped>
	.verificationCode {
		display: flex;
		justify-content: center;
		align-content: center;
	}

	.code {
		background: #eaeaea;
		overflow: hidden;
	}

	.flicker {
		font-size: 16px;
		width: 100%;
		height: 100%;
	}

	img {
		position: relative;
		z-index: 101;
		width: 100%;
		height: 100%;
		transition: all 1s linear;
	}
</style>
