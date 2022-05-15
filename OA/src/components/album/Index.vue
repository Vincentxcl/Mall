<template>
	<div class="album" :style="{width:w,height:h}" @mouseenter="enter()" @mouseleave="leave()">
		<Displayer v-if="displayMode=='normal'" :width="width" :height="height" :showBtn="showDisplayerBtn" :imgInfo="currentImg" @move="setCurrent" />
		<Slider v-else-if="displayMode=='slide'" :width="width" :height="height" :showBtn="showDisplayerBtn" :imgs="imgs" :current="current" @move="setCurrent" />

		<ImageBtn v-if="shortCutType=='imageBtn'" :width="width" :itemWH="imageBtnItemWH" :imgs="imgs" :showBtn="showShortCutBtn" :autoRoll="shortCutAutoRoll" :selectIndex="current" @imgClick="itemClick" />
		<NumberBtn v-else-if="shortCutType=='numberBtn'" :imgs="imgs" :selectIndex="current" :style="{top:numberBtnTopPosition}" @numberClick="itemClick" />
		<RadioBtn v-else-if="shortCutType=='radioBtn'" :imgs="imgs" :selectIndex="current" @radioBtnClick="itemClick" />
	</div>
</template>

<script>
	import Displayer from './Displayer.vue';
	import Slider from './Slider.vue';
	import ImageBtn from './ImageBtn.vue';
	import NumberBtn from './NumberBtn';
	import RadioBtn from './RadioBtn';

	export default {
		name: "Album",
		data() {
			return {
				current: 0,
				isRolling: true,
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
			imageBtnItemWH: {
				type: Object,
				default() {
					return {
						w: 50,
						h: 40,
					};
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
			displayMode: {
				type: String,
				default() {
					let modes = ['normal', 'slide'];
					return modes[0];
				}
			},
			autoPlay: {
				type: Boolean,
				default() {
					return true;
				}
			},
			interval: {
				type: Number,
				default() {
					return 5000;
				}
			},
			showDisplayerBtn: {
				type: Boolean,
				default() {
					return true;
				},
			},
			shortCutType: {
				type: String,
				default() {
					let list = ['none', 'imageBtn', 'numberBtn', 'radioBtn'];
					return list[1];
				}
			},
			showShortCutBtn: {
				type: Boolean,
				default() {
					return true;
				},
			},
			shortCutAutoRoll: {
				type: Boolean,
				default() {
					return false;
				},
			},
		},
		computed: {
			currentImg() {
				return (this.imgs[this.current]);
			},
			w() {
				return (this.width + "px");
			},
			h() {
				if (this.shortCutType == 'imageBtn') {
					return (this.height + this.imageBtnItemWH.h + 2) + 'px';
				}
				return this.height + "px";
			},
			numberBtnTopPosition() {
				return (-this.height + "px");
			},
		},
		methods: {
			setCurrent(val) {
				if (val > 0) {
					this.current = (parseInt(this.current) + 1) % parseInt(this.imgs.length);
				}
				else {
					this.current = (parseInt(this.current) + parseInt(this.imgs.length) - 1) % parseInt(this.imgs.length);
				}
			},
			itemClick(val) {
				this.current = val;
			},
			enter() {
				this.isRolling = false;
			},
			leave() {
				this.isRolling = true;
			}
		},
		mounted() {
			if (this.autoPlay) {
				setInterval(() => {
					if (this.isRolling) {
						this.setCurrent(1);
					}
				}, this.interval);
			}
		},
		components: {
			Displayer,
			Slider,
			ImageBtn,
			NumberBtn,
			RadioBtn,
		}
	};
</script>

<style scoped>
	.album {
		overflow: hidden;
	}

		.album .numberBtn {
			margin: 5px;
		}

		.album .radioBtn {
			top: -25px;
		}
</style>
