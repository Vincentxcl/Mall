<template>
	<dialog-window v-model="isShowField" :width="width" :height="height" :border="{top:3,right:3,bottom:3,left:3}">
		<template slot="title">
			HTML5上传图片(AJAX)
		</template>
		<template slot="content">
			<!--uploader-->
			<div class='view_upload' v-show="fileArray.length==0">
				<btn title="选择图片" @click.native="clickInput">
				<icon icon="icon-shangchuantupian"></icon>
					<span>&nbsp;选择图片</span>
				</btn>
				<div class="support">
					<p>
						支持的文件格式：{{supportContentTypeStringify}}
					</p>
					<p>
						支持的文件大小：{{byteToMega(supportContentSize,0)}}M
					</p>
				</div>
				<div class='msg'>
					{{tips}}
				</div>
				<input ref="input" type='file' class="hide" :accept="supportContentTypeStringify" @change="getFiles" />
			</div>
			<!--preview-->
			<div class='view_preview' v-show="fileArray.length!=0">
				<div ref="imgholder" class='imgholder'>
					<slot name="file" :files="dataURLArray"></slot>
				</div>
				<div class="ctrl">
					<btn class="confirm" title="上传" @click.native="submit">上传</btn>
					<btn class="cancel" title="取消" @click.native="cancel">取消</btn>
				</div>
			</div>
		</template>
	</dialog-window>
</template>

<script>
	import Icon from 'components/widgets/icon.vue';
	import DialogWindow from 'components/dialog/dialogWindow.vue';
	import Btn from 'components/widgets/button.vue';

	export default {
		name: 'fileHolder',
		data() {
			return {
				isShowField: false,
				fileArray: [],
				dataURLArray: [],
				tips: '',
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
		computed: {
			supportContentTypeStringify() {
				return this.supportContentType.join(',');
			},
		},
		methods: {
			byteToMega(num, fix = 2) {
				return (num / (1024 * 1024)).toFixed(fix);
			},
			toBase64(file) {
				if (!file) return;
				return new Promise((resolve) => {
					let reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = (progressEvent) => {
						resolve(progressEvent.target.result);
					};
				});
			},
			clickInput() {
				this.$refs.input.click();
			},
			isSupportedType(file) {
				if (!file) {
					return false;
				}
				let result = this.supportContentType.find(current => {
					return file.type == current;
				});
				return result != undefined;
			},
			isSupportedSize(file) {
				if (!file) {
					return false;
				}
				return file.size <= this.supportContentSize;
			},
			getFiles(event) {
				this.fileArray = [];
				this.dataURLArray = [];
				this.tips = '';
				//取出上传的文件。ps:这个files是一个对象，其中有个属性是length，所以不用单独设变量保存length
				let files = event.target.files;
				for (let i = 0; i < files.length; i++) {
					//验证
					if (this.isSupportedType(files[i])) {
						if (this.isSupportedSize(files[i])) {
							//添加到数组
							this.fileArray.push(files[i]);
							this.toBase64(files[i]).then(res => {
								this.dataURLArray.push(res);
							});
						}
						else {
							this.tips = `此文件：${this.byteToMega(files[i].size)}M，超过支持的上传大小，请重新选择。`;
						}
					}
					else {
						this.tips = '暂不支持的文件格式，请重新选择';
					}
				}
			},
			submit() {
				if (this.fileArray.length > 0) {
					this.$emit("submit", { 'fileArray': this.fileArray, 'dataURLArray': this.dataURLArray });
				}
			},
			cancel() {
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
					if (current == false) {
						this.fileArray = [];
						this.dataURLArray = [];
						this.tips = '';
						//清空上传input，防止前后两次都是相同的文件，不触发change事件
						this.$refs.input.value = '';
					}
					this.$emit('change', current);
				}
			},
		},
		components: {
			Icon,
			DialogWindow,
			Btn,
		},
		model: {
			prop: 'isShow',
			event: 'change',
		},
	};

</script>

<style scoped>
	/*上传控件*/
	div.view_upload {
		width: 100%;
		height: 100%;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
	}

		div.view_upload div.button {
			width: 250px;
			height: 36px;
			line-height: 36px;
			background-color: #5CAAE6;
			color: white;
		}

			div.view_upload div.button i {
				font-size: 18px;
			}

			div.view_upload div.button:hover {
				background-color: #3092F5;
			}

		div.view_upload div.support {
			width: 250px;
			font-size: 12px;
			margin-top: 10px;
		}

		div.view_upload div.msg {
			width: 250px;
			height: 40px;
			font-size: 12px;
			color: var(--color-high-text);
			margin-top: 10px;
		}

	/*上传内容预览框*/
	div.view_preview {
		width: 100%;
		height: 100%;
	}

		div.view_preview div.imgholder {
			width: 100%;
			height: calc(100% - 40px);
		}

		/*上传内容预览框控件*/
		div.view_preview div.ctrl {
			height: 40px;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			background-color: #F3F3F3;
		}

		div.view_preview div.button {
			width: 100px;
			font-size: 16px;
			margin-right: 20px;
		}

		div.view_preview div.confirm {
			color: white;
			background-color: #5CAAE6;
		}

			div.view_preview div.confirm:hover {
				background-color: #3092F5;
			}

		div.view_preview div.cancel {
			background-color: white;
			border: 1px solid #dedede;
			color: var(--color-text);
		}
</style>
