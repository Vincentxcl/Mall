<template>
	<file-holder ref="fileholder" v-model="isShowField" :width="width" :height="height" :supportContentType="supportContentType" :supportContentSize="supportContentSize" @submit="submit">
		<img alt="Thumbnail" slot="file" slot-scope="slot" :src="slot.files[0]" @load="adjustSize" />
	</file-holder>
</template>

<script>
	import FileHolder from './parts/fileHolder.vue';
	import { adjustImgWH } from 'common/helper/imageHelper.js';
	import { imgUpload } from 'netWork/imgUpload.js';

	export default {
		name: 'ImgUploader',
		data() {
			return {
				isShowField: false,
			};
		},
		props: {
			width: {
				type: Number,
				default() {
					return 500;
				},
			},
			height: {
				type: Number,
				default() {
					return 580;
				},
			},
			isShow: {
				type: Boolean,
				default() {
					return false;
				},
			},
			supportContentType: {
				type: Array,
				default() {
					return ['image/jpeg', 'image/png'];
				},
			},
			supportContentSize: {
				type: Number,
				default() {
					return 2 * 1024 * 1024;
				},
			},
		},
		methods: {
			adjustSize(event) {
				//调整img尺寸
				let img = event.target;
				let holderRect = this.$refs.fileholder.$refs.imgholder.getBoundingClientRect();
				adjustImgWH(img, holderRect.width, holderRect.height, 0.5);
			},
			submit(val) {
				if (!val || !val.fileArray|| val.fileArray.length == 0) {
					return;
				}
				let formData = new FormData();
				for (let i = 0; i < val.fileArray.length; i++) {
					formData.append('formData', val.fileArray[i]);
				}
				imgUpload(formData)
					.then(res => {
						this.isShowField = false;
						this.$toast.show(res.data);
					})
					.catch(error => {
						this.isShowField = false;
						this.$toast.show(error.message);
					});
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
					this.$emit('change', current);
				}
			},
		},
		components: {
			FileHolder,
		},
		model: {
			prop: 'isShow',
			event: 'change',
		},
	};
</script>

<style>
	div.content > div.view_preview > div.imgholder {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
