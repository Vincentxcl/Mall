<template>
	<div class="displayer" :style="{width:w,height:h}">
		<div class="imgHolder">
			<transition name="imgHolder">
				<a v-show="isShow" :href="imgInfo.imgLink">
					<img :src="imgInfo.imgSrc">
				</a>
			</transition>
		</div>
		<div class="ctrlHolder" v-if="showBtn" :style="{top:ctrlHolderTopPosition}">
			<span class="iconfont icon-qianhou1 fl" @click="pre"></span>
			<span class="iconfont icon-qianhou2 fr" @click="next"></span>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Displayer",
		data() {
			return {
				isShow: true,
			};
		},
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
			imgInfo: {
				type: Object,
				default() {
					return {
						imgLink: "",
						imgSrc: "",
					};
				},
			},
			showBtn: {
				type: Boolean,
				default() {
					return true;
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
		watch: {
			imgInfo: {
				handler() {
					this.isShow = false;
				}
			},
		},
		updated() {
			this.isShow = true;
		},
	};
</script>

<style scoped>
	@import '~assets/css/album/iconfont.css';

	.displayer {
		overflow: hidden;
	}

	.imgHolder, .imgHolder a, .imgHolder img {
		display: block;
		width: 100%;
		height: 100%;
	}

	.ctrlHolder {
		display: none;
		position: relative;
	}

	.displayer:hover .ctrlHolder {
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

	.imgHolder-enter-active {
		animation: fadein 0.5s linear;
	}

	@keyframes fadein {
		from {
			opacity: 0.1;
		}

		to {
			opacity: 1;
		}
	}
</style>
