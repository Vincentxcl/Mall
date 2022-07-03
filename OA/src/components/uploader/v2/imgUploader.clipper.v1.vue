<template>
	<file-holder ref="fileholder" v-model="isShowField" :width="width" :height="height" :supportContentType="supportContentType" :supportContentSize="supportContentSize" @submit="submit">
		<template slot="file" slot-scope="slot">
			<img-clipper :width="width-2" :height="height-72" v-model="slot.files[0]" />
		</template>
	</file-holder>
</template>

<script>
	import FileHolder from '../parts/fileHolder.vue';
	import ImgClipper from 'components/imgClipper/index.vue';
	import { imgBase64Upload } from 'netWork/imgUpload.js';

	export default {
		name: 'ImgUploader',
		data() {
			return {
				isShowField: false,
				imgData: null,
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
			submit(val) {
				if (!val || !val.dataURLArray || val.dataURLArray.length == 0) return;


				let formData = new FormData();
				formData.append('formData', val.dataURLArray[0]);

				imgBase64Upload(formData)
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
			ImgClipper,
		},
		model: {
			prop: 'isShow',
			event: 'change',
		},
	};
</script>
