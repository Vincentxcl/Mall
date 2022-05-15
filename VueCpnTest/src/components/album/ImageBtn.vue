<template>
	<div class="imageBtn" :style="{width:shortCutBarWidth,height:shortCutBarHeight}">
		<div class="imgsHolder clr" :style="{width:imgsHolderWidth,left:imgsHolderLeftPosition}">
			<img v-for="(item,index) in imgs" :key="item.id" :src="item.imgSrc" :style="{width:imgWidth,height:imgHeight}" :class="{select:index==selectIndex}" @click="itemClick(index)" alt="图片" />
		</div>

		<div class="ctrlHolder" :style="{top:ctrlHolderTopPosition}" v-if="showBtn">
			<span class="iconfont icon-qianhou1 fl" @click="pre"></span>
			<span class="iconfont icon-qianhou2 fr" @click="next"></span>
		</div>
	</div>
</template>

<script>
	export default {
		name: "ImageBtn",
		data() {
			return {
				position: 0,
			};
		},
		props: {
			imgs: {
				type: Array,
				required: true,
			},
			width: {
				type: Number,
				default() {
					return 600;
				}
			},
			itemWH: {
				type: Object,
				default() {
					return {
						w: 50,
						h: 40,
					};
				},
			},
			showBtn: {
				type: Boolean,
				default() {
					return true;
				},
			},
			selectIndex: {
				type: Number,
				default() {
					return 0;
				}
			},
			autoRoll: {
				type: Boolean,
				default() {
					return true;
				},
			},
		},
		computed: {
			shortCutBarWidth() {
				return (this.width + "px");
			},
			shortCutBarHeight() {
				return ((this.itemWH.h + 2) + "px");
			},
			imgsHolderWidth() {
				return ((this.imgs.length * this.itemWH.w) + "px");
			},
			imgsHolderLeftPosition() {
				return (-(this.itemWH.w * this.position) + "px");
			},
			imgWidth() {
				return this.itemWH.w + "px";
			},
			imgHeight() {
				return this.itemWH.h + "px";
			},
			ctrlHolderTopPosition() {
				return (-(this.itemWH.h + 44) / 2 + "px");
			},
		},
		methods: {
			pre() {
				this.position = (parseInt(this.position) + parseInt(this.imgs.length) - 1) % parseInt(this.imgs.length);
			},
			next() {
				this.position = (parseInt(this.position) + 1) % parseInt(this.imgs.length);
			},
			itemClick(val) {
				this.$emit("imgClick", val);
			},
		},
		watch: {
			selectIndex(cur) {
				if (this.autoRoll) {
					this.position = cur;
				}
			},
		},
	};
</script>

<style scoped>
	@import '~assets/css/album/iconfont.css';

	.imageBtn {
		border: 1px solid #c1c1c1;
		overflow: hidden;
	}

	.imgsHolder {
		position: relative;
		transition: all 0.5s linear;
	}

		.imgsHolder img {
			float: left;
			cursor: pointer;
			border: 2px solid white;
		}

			.imgsHolder img.select {
				border: 2px solid #5f5f5f;
			}

			.imgsHolder img:hover {
				transition: all 0.5s linear;
				transform: scale(1.05);
				cursor: pointer;
			}


	/*左右按钮*/
	.ctrlHolder {
		display: none;
		position: relative;
	}

	.imageBtn:hover .ctrlHolder {
		display: block;
	}

	.ctrlHolder span.iconfont {
		width: 30px;
		height: 44px;
		line-height: 44px;
		font-size: 22px;
		color: white;
		font-weight: bolder;
		text-align: center;
		cursor: pointer;
	}

		.ctrlHolder span.iconfont:hover {
			transition: all 0.5s ease;
			color: #c3c3c3;
		}
</style>
