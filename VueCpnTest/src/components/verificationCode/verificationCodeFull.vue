<template>
	<div class="verificationCode" v-show="isShowField" :style="cpnStyle">
		<flicker :style="flickerStyle">{{tips}}</flicker>
		<img alt="verification code" :src="adjustedImgSrc" :style="{opacity:imgOpacity}" @load="imgOnLoad" />
		<p>
			<slot>
				请按照下图中字体的大小，由小至大依次输入字符
			</slot>
		</p>
		<div class="ctrl">
			<icon icon="icon-shuaxin" title="刷新" :class="{inactive:!isPositive}" @click.native="refresh"></icon>
			<icon icon="icon-guanbi" title="关闭" @click.native="close()"></icon>
		</div>
	</div>
</template>

<script>
	import Icon from 'components/widgets/icon.vue';
	import Flicker from 'components/widgets/flicker.vue';

	export default {
		name: 'VerificationCode',
		data() {
			return {
				isShowField: false,
				tips: 'Loading',
				t: '0',
				isPositive: true,//刷新按钮是否
				imgOpacity: 1,
				handlerInvalid: null,
			};
		},
		props: {
			isShow: {
				type: Boolean,
			},
			x: {
				type: Number,
			},
			y: {
				type: Number,
			},
			width: {
				type: Number,
				default() {
					return 300;
				},
			},
			height: {
				type: Number,
				default() {
					return 300;
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
				let obj = {
					width: this.width + 'px',
					height: this.height + 'px',
				};
				if (this.x) {
					obj.left = this.x + "px";
				}
				if (this.y) {
					obj.top = this.y + "px";
				}
				return obj;
			},
			flickerStyle() {
				return {
					'line-height': this.height + 'px',
				};
			},
			adjustedImgSrc() {
				return this.imgSrc + "&t=" + this.t;
			},
		},
		methods: {
			imgOnLoad() {
				//解锁刷新按钮
				setTimeout(() => {
					this.isPositive = true;
				}, this.refreshLockDuration);

				//开始倒计图片失效
				clearTimeout(this.handlerInvalid);
				this.handlerInvalid = setTimeout(() => {
					this.imgOpacity = 0.3;
					this.tips = "验证码已失效！";
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
			close() {
				this.isShowField = false;
			},
		},
		watch: {
			isShow: {
				handler(current) {
					this.isShowField = current;
				}
			},
			isShowField: {
				handler(current) {
					this.$emit('show', current);
				}
			},
		},
		components: {
			Icon,
			Flicker,
		},
		model: {
			prop: 'isShow',
			event: 'show'
		}
	}
</script>

<style scoped>
	.verificationCode {
		position: absolute;
		overflow: hidden;
		background: #eaeaea;
	}

	.flicker {
		position: absolute;
		z-index: 100;
		width: 100%;
		height: 100%;
	}

	img {
		position: absolute;
		z-index: 101;
		width: 100%;
		height: 100%;
		transition: all 1s linear;
	}

	p {
		position: absolute;
		z-index: 102;
		top: 2px;
		display: block;
		width: 100%;
		height: 15px;
		font-size: 13px;
		line-height: 15px;
		text-align: center;
	}

	.ctrl {
		position: absolute;
		z-index: 103;
		/*控件显示的位置*/
		top: 273px;
		width: 100%;
		height: 25px;
		line-height: 25px;
		text-align: center;
	}

		.ctrl i {
			width: 25px;
			height: 25px;
			font-size: 20px;
			border-radius: 100%;
			background-color: white;
			border: 1px solid #444;
			margin: 0px 10px;
			cursor: pointer;
		}

			.ctrl i.inactive {
				cursor: not-allowed;
				background-color: #eaeaea;
			}

			.ctrl i:hover {
				background-color: #eaeaea;
			}
</style>
