<template>
	<div ref="imgClipper" class="imgClipper" :style="cpnStyle" @mousedown="dragImg">
		<canvas ref="canvas" :width="width" :height="height"></canvas>
		<div class="clip" v-show="isShowClip" :style="clipStyle"></div>
		<div class="ctrl">
			<div @click="zoom(1.1)">
				<icon icon="icon-fangda"></icon>
			</div>
			<div @click="clipImage">
				<icon icon="icon-jianqie"></icon>
			</div>
			<div @click="zoom(0.9)">
				<icon icon="icon-suoxiao"></icon>
			</div>
		</div>
	</div>
</template>

<script>
	import Icon from 'components/widgets/icon.vue';
	import { adjustImgWH } from 'common/helper/imageHelper.js';

	export default {
		name: 'ImgClipper',
		data() {
			return {
				isShowClip: false,
				border: {},//以免飞出剪切框
				dataURLField: '',
				img: null,
				mimeType: '',
				//截图框
				clipWidth: 0,
				clipHeight: 0,
				clipX: 0,
				clipY: 0,
				//图片
				imgWidth: 0,
				imgHeight: 0,
				imgX: 0,
				imgY: 0,
			};
		},
		props: {
			//控件的宽度
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
			//中间截图区域的占比
			clipAreaRate: {
				type: Number,
				default() {
					return 0.7;
				},
			},
			//base64位编码的图片数据
			dataURL: {
				type: String,
			},
		},
		computed: {
			//组件
			cpnStyle() {
				return {
					'width': this.width + 'px',
					'height': this.height + 'px',
				};
			},
			//中间截图框的坐标和宽度
			clipStyle() {
				return {
					'width': this.clipWidth + 'px',
					'height': this.clipHeight + 'px',
					'top': this.clipY + 'px',
					'left': this.clipX + 'px',
				};
			},
		},
		methods: {
			drawImage() {
				if (!this.img) return;
				//canvas画图context
				const canvasContext = this.$refs.canvas.getContext('2d');
				//清空画布
				canvasContext.clearRect(0, 0, this.width, this.height);
				canvasContext.drawImage(this.img, this.imgX, this.imgY, this.imgWidth, this.imgHeight);
			},
			zoom(rate) {
				if (!this.img) return;

				this.isShowClip = true;

				this.imgX -= (this.imgWidth * rate - this.imgWidth) / 2;
				this.imgY -= (this.imgHeight * rate - this.imgHeight) / 2

				this.imgWidth = this.imgWidth * rate;
				this.imgHeight = this.imgHeight * rate;

				this.drawImage();
			},
			dragImg(e) {
				if (!this.img) return;

				this.isShowClip = true;
				//获取外框的位置信息
				let rect = this.$refs.imgClipper.getBoundingClientRect();

				//鼠标按下后与被拖动元素的相对距离
				let disX = e.clientX - rect.x - this.imgX;
				let disY = e.clientY - rect.y - this.imgY;
				document.onmousemove = (e) => {
					//用当前鼠标的坐标值减去相对距离，得到被拖动元素的原点坐标
					this.imgX = e.clientX - rect.x - disX;
					this.imgY = e.clientY - rect.y - disY;

					//约束在上下限内
					if (this.imgX < this.border.left - this.imgWidth) {
						this.imgX = this.border.left - this.imgWidth;
					}
					if (this.imgX > this.width - this.border.right) {
						this.imgX = this.width - this.border.right;
					}
					if (this.imgY < this.border.top - this.imgHeight) {
						this.imgY = this.border.top - this.imgHeight;
					}
					if (this.imgY > this.height - this.border.bottom) {
						this.imgY = this.height - this.border.bottom;
					}

					this.drawImage();
				};
				document.onmouseup = () => {
					document.onmousemove = null;
					document.onmouseup = null;
				};
			},
			clipImage() {
				if (!this.img) return;
				if (this.imgX >= this.clipX && this.imgY >= this.clipY &&
					(this.imgX + this.imgWidth) <= (this.clipX + this.clipWidth) &&
					(this.imgY + this.imgHeight) <= (this.clipY + this.clipHeight)) return;

				//canvas画图context
				const canvasContext = this.$refs.canvas.getContext('2d');
				//计算有效区域 (以下算法的坐标原点为控件的左上角)
				let validX = this.imgX <= this.clipX ? this.clipX : this.imgX;
				let validY = this.imgY <= this.clipY ? this.clipY : this.imgY;

				let validW = this.clipX + this.clipWidth <= this.imgX + this.imgWidth ?
					this.clipWidth + this.clipX - validX : this.imgX + this.imgWidth - validX + 1;
				let validH = this.clipY + this.clipHeight <= this.imgY + this.imgHeight ?
					this.clipHeight + this.clipY - validY : this.imgY + this.imgHeight - validY + 1;

				//取出有像素的截图区域
				let imgData = canvasContext.getImageData(validX, validY, validW, validH);

				//重构截取的图片
				const canvasClipt = document.createElement('canvas');
				canvasClipt.width = validW;
				canvasClipt.height = validH;
				const canvasCliptContext = canvasClipt.getContext('2d');
				canvasCliptContext.putImageData(imgData, 0, 0);

				//转换为base64位编码
				this.isShowClip = false;
				this.dataURLField = canvasClipt.toDataURL(this.mimeType);
				this.$emit('change', this.dataURLField);
			},
		},
		mounted() {
			//根据画布算出截图区域的尺寸，固定尺寸在mounted时候计算
			if (/^0.[0-9]+$/.test(this.clipAreaRate)) {
				this.clipWidth = this.width * this.clipAreaRate;
				this.clipHeight = this.height * this.clipAreaRate;
			}
			this.clipX = (this.width - this.clipWidth) / 2;
			this.clipY = (this.height - this.clipHeight) / 2;

			//最大拖动范围
			let disX = this.width * (1 - this.clipAreaRate);
			let disY = this.height * (1 - this.clipAreaRate);
			this.border = {
				top: disY,
				right: disX,
				bottom: disY,
				left: disX,
			};
		},
		watch: {
			dataURL: {
				handler(current) {
					if (/^data:(.+);base64,/.test(current)) {
						this.dataURLField = current;
						this.mimeType = RegExp.$1;

						let image = new Image();
						image.src = this.dataURLField;
						image.onload = () => {
							adjustImgWH(image, this.width, this.height);//调整尺寸至切图框
							this.img = image;
							this.imgWidth = image.width;
							this.imgHeight = image.height;
							this.imgX = (this.width - image.width) / 2;
							this.imgY = (this.height - image.height) / 2;
							//canvas画图
							this.drawImage();
						};
					}
				},
			},
		},
		components: {
			Icon,
		},
		model: {
			prop: 'dataURL',
			event: 'change',
		},
	};
</script>

<style scoped>
	.imgClipper {
		cursor: move;
		overflow: hidden;
		position: absolute;
	}

	div.imgClipper:hover div.ctrl {
		display: block;
	}

	canvas {
		/*以免有条4px缝隙*/
		display: block;
	}

	.clip {
		border: 1px dashed #0041dc;
		background: rgb(18 0 255 / 0.22);
		position: absolute;
	}

	.ctrl {
		display: none;
		width: 100%;
		height: 20px;
		position: relative;
		top: -20px;
		background: rgb(255 255 255 / 0.7);
		text-align: center;
		transition: all 1s linear;
	}

		.ctrl div {
			display: inline-block;
			width: 40px;
			text-align: center;
			line-height: 20px;
			cursor: pointer;
		}

			.ctrl div:hover {
				color: #000000;
			}
</style>
