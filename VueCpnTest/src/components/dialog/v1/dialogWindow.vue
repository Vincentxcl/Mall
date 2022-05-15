<template>
	<div class="dialogWindow" ref="drawable" v-show="isShowField" :style="dialogStyle">
		<div class="titleBar" @mousedown="drag">
			<div class="fl">
				<slot name="title">Dialog Window Title</slot>
			</div>
			<div class="fr" @click="close">
				<slot name="icon">
					<icon icon="icon-guanbi" title="关闭"></icon>
				</slot>
			</div>
		</div>
		<div class="content">
			<slot name="content"></slot>
		</div>
	</div>
</template>

<script>
	import Icon from 'components/widgets/icon.vue';

	export default {
		name: 'DialogWindow', //different from dialog in html5
		data() {
			return {
				isShowField: false,
				windowWidth: 0,
				windowHeight: 0,
				x: 0,
				y: 0
			};
		},
		props: {
			//控制显示和隐藏，请使用v-model,不要使用isShow属性，v-model绑定的变量需要在变化时，组件才能watch到变化
			isShow: {
				type: Boolean,
				default() {
					return false;
				}
			},
			width: {
				type: Number,
				default() {
					return 500;
				}
			},
			height: {
				type: Number,
				default() {
					return 580;
				}
			},
			border: {
				type: Object,
				default() {
					return { top: 3, right: 3, bottom: 45, left: 3 };
				}
			}
		},
		computed: {
			dialogStyle() {
				return {
					width: this.width + 'px',
					height: this.height + 'px',
					top: this.y + 'px',
					left: this.x + 'px'
				};
			}
		},
		methods: {
			//监听拖动过程
			drag(e) {
				//目标被拖动元素
				const drawableElRect = this.$refs.drawable.getBoundingClientRect();

				//鼠标按下后与被拖动元素的相对距离(ps:e.clientX和drawableElRect.x 计算方式为屏幕坐标系)
				let disX = e.clientX - drawableElRect.x;
				let disY = e.clientY - drawableElRect.y;

				// 2.监听鼠标在document中的移动事件
				document.onmousemove = (e) => {
					//用当前鼠标的坐标值减去相对距离，得到被拖动元素的原点坐标(此时的left和top为屏幕坐标系)
					let left = e.clientX - disX;
					let top = e.clientY - disY;

					//约束在上下限内
					if (left < this.border.left) {
						left = this.border.left;
					}
					if (left + drawableElRect.width > this.windowWidth - this.border.right) {
						left = this.windowWidth - this.border.right - drawableElRect.width;
					}
					if (top < this.border.top) {
						top = this.border.top;
					}
					if (top + drawableElRect.height > this.windowHeight - this.border.bottom) {
						top = this.windowHeight - this.border.bottom - drawableElRect.height;
					}

					//设置当前元素的新坐标(屏幕坐标系-->document坐标系)
					this.x = left + document.documentElement.scrollLeft;
					this.y = top + document.documentElement.scrollTop;
				};

				// 3.结束事件
				document.onmouseup = () => {
					document.onmousemove = null;
					document.onmouseup = null;
				};
			},
			close() {
				this.isShowField = false;
				if (this.$mask) {
					this.$mask.hide();
				}
			}
		},
		watch: {
			isShow: {
				handler(current) {
					//赋值
					this.isShowField = current;
					//计算坐标
					if (current) {
						//页面的宽高
						this.windowWidth = window.innerWidth;
						this.windowHeight = window.innerHeight;
						//此时控件的位置
						this.x = this.windowWidth / 2 - this.width / 2 + document.documentElement.scrollLeft;
						this.y = this.windowHeight / 2 - this.height / 2 + document.documentElement.scrollTop;
					} else {
						this.x = 0;
						this.y = 0;
					}
					if (this.$mask) {
						current ? this.$mask.show() : this.$mask.hide();
					}
				}
			},
			isShowField: {
				handler(current) {
					this.$emit('change', current);
				}
			}
		},
		components: {
			Icon
		},
		model: {
			prop: 'isShow',
			event: 'change'
		}
	};
</script>

<style scoped>
	/*弹出层*/
	div.dialogWindow {
		position: absolute;
		z-index: 1001;
		background-color: #ffffff;
		border: 1px solid #999999;
		border-radius: 5px;
		box-shadow: 0px 0px 5px 2px #a9a9a9;
	}

	/*弹出层横标*/
	div.titleBar {
		height: 30px;
		line-height: 30px;
		font-size: 12px;
		cursor: move;
		background-color: #f3f3f3;
	}

		div.titleBar > div {
			height: 30px;
			line-height: 30px;
		}

		div.titleBar div.fl {
			margin-left: 20px;
		}

		div.titleBar div.fr {
			margin-right: 10px;
			cursor: pointer;
		}

			div.titleBar div.fr:hover {
				color: red;
			}

	div.content {
		width: 100%;
		height: calc(100% - 30px);
	}
</style>
