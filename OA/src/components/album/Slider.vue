<template>
	<div class="slider" :style="{width:w,height:h}">

		<transition-group name="image" tag="div" class="imgHolder">
			<a v-for="(item,index) in imgs" v-show="index==current" :key="item.id" :href="item.imgLink">
				<img :src="item.imgSrc">
			</a>
		</transition-group>

		<div class="ctrlHolder" v-if="showBtn" :style="{top:ctrlHolderTopPosition}">
			<span class="iconfont icon-qianhou1 fl" @click="pre"></span>
			<span class="iconfont icon-qianhou2 fr" @click="next"></span>
		</div>

	</div>
</template>

<script>
	export default {
		name: "Slider",
		props: {
			width: {
				type: Number,
				default() {
					return 600;
				},
			},
			height: {
				type: Number,
				default() {
					return 400;
				},
			},
			showBtn: {
				type: Boolean,
				default() {
					return true;
				},
			},
			imgs: {
				type: Array,
				required: true,
				default() {
					return [{
						id: "",
						imgLink: "",
						imgSrc: "",
					}];
				}
			},
			current: {
				type: Number,
				default() {
					return 0;
				},
			},
		},
		computed: {
			w() {
				return this.width + "px";
			},
			h() {
				return this.height + "px";
			},
			ctrlHolderTopPosition() {
				return (-(parseInt(this.height) + 40) / 2 + "px");
			},
		},
		methods: {
			pre() {
				this.$emit("move", -1);
			},
			next() {
				this.$emit("move", 1);
			},
		},
	};
</script>

<style scoped>
	@import '~assets/css/album/iconfont.css';

	.slider {
		position: relative;
		overflow: hidden;
	}

	.imgHolder, .imgHolder a, .imgHolder img {
		display: block;
		width: 100%;
		height: 100%;
	}

		.imgHolder a {
			position: absolute;
		}

	.ctrlHolder {
		display: none;
		position: relative;
	}

	.slider:hover .ctrlHolder {
		display: block;
	}

	.iconfont {
		width: 40px;
		height: 40px;
		font-size: 30px;
		font-weight: bolder;
		line-height: 40px;
		text-align: center;
		color: #c3c3c3;
		border: 1px solid #c3c3c3;
		border-radius: 4px;
		margin: 0px 3px;
		cursor: pointer;
	}

		.iconfont:hover {
			transition: all 0.5s ease;
			color: white;
		}

	.image-enter-active {
		transform: translateX(0);
		transition: all 0.9s linear;
	}

	.image-leave-active {
		transform: translateX(-100%);
		transition: all 1s linear;
	}

	.image-enter {
		transform: translateX(100%);
	}

	.image-leave {
		transform: translateX(0);
	}
</style>
