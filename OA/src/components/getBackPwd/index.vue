<template>
	<div class="getBackPwd">
		<h3>找回密码</h3>
		<challenge ref="challenge" v-show="step==0" :verification-img-url="verificationImgUrl" :verification-duration="verificationDuration" :refresh-lock-duration="refreshLockDuration" @challenge="requestChallenge"></challenge>

		<response ref="response" v-show="step==1" @response="next"></response>

		<set-pwd ref="setPwd" v-show="step==2" @setPwd="submit"></set-pwd>
	</div>
</template>

<script>
	import Challenge from './parts/challenge.vue';
	import Response from './parts/response.vue';
	import SetPwd from './parts/setPwd.vue';
	import { tryRequestChallenge, tryResetPwd } from 'netWork/getBackPwd.js';

	export default {
		name: 'GetBackPwd',
		data() {
			return {
				step: 0,
				responseCode: '',
				password: '',
			};
		},
		props: {
			//验证码图片url
			verificationImgUrl: {
				type: String,
				required: true,
				default() {
					return '';
				},
			},
			//验证码有效时间
			verificationDuration: {
				type: Number,
				default() {
					return 1000 * 60 * 5;
				},
			},
			//刷新间隔时间
			refreshLockDuration: {
				type: Number,
				default() {
					return 1000 * 5;
				},
			},
		},

		methods: {
			requestChallenge(val) {
				tryRequestChallenge(val)
					.then(res => {
						if (res.data.echo) {
							this.step = 1;
						}
						else {
							this.$refs.challenge.tips = decodeURI(res.data.msg);
						}
					})
					.catch(error => {
						this.$refs.challenge.tips = decodeURI(error.message);
					});
			},
			next(val) {
				this.responseCode = val;
				this.step = 2;
			},
			submit(val) {
				this.password = val;
				let params = {
					'requestCode': this.responseCode,
					'password': this.password,
				};
				tryResetPwd(params)
					.then(res => {
						if (res.data.echo) {
							this.$refs.setPwd.tips = '修改成功';
							this.$refs.challenge.clear();
							this.$refs.response.clear();
							this.$refs.setPwd.clear();
						}
						else {
							this.$refs.setPwd.tips = decodeURI(res.data.msg);
						}
					})
					.catch(error => {
						this.$refs.setPwd.tips = decodeURI(error.data.message);
					});
			},
		},
		components: {
			Challenge,
			Response,
			SetPwd,
		},
	};
</script>

<style scoped>
	.getBackPwd {
		width: 600px;
		height: 500px;
		background: white;
		border-radius: 5px;
	}

		.getBackPwd h3 {
			width: 580px;
			height: 76px;
			line-height: 76px;
			font-size: 24px;
			font-weight: 500;
			text-align: start;
			margin: auto;
			padding-left: 20px;
			border-bottom: 1px solid #e9e9e9;
		}
</style>
