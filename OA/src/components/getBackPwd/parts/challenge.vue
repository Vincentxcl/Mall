<template>
	<div class="challenge">
		<text-box class="email" ref="email" :value="email" :width="280" :height="40" placeholder="请输入邮箱" :maxlength="30" title="邮箱" pattern="/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/" @blur="email=$event.target.value">
			<div class="msg" slot="tips" slot-scope="textbox">
				<p class="fl" :style="isExistEmail?{color:'#00dc04'}:{}">{{textbox.tips}}</p>
			</div>
		</text-box>

		<div class="clr">
			<text-box class="randomWords fl" ref="randomWords" v-model="randomWords" :width="120" :height="40" placeholder="验证码" :maxlength="4" title="验证码">
				<div class="msg" slot="tips" slot-scope="textbox">
					<p class="fl">{{textbox.tips}}</p>
				</div>
			</text-box>

			<verification-code class="vcode fl" :img-src="verificationImgUrl" :effective-duration="verificationDuration" :refreshLock-duration="refreshLockDuration" />
		</div>

		<btn @click.native="submit">获取申请码</btn>
		<div class="msg">{{tips}}</div>
	</div>
</template>

<script>
	import TextBox from 'components/widgets/textbox.vue';
	import Btn from 'components/button/btn.vue';
	import VerificationCode from 'components/verificationCode/verificationCodeFull.vue';
	import { getUsers } from 'netWork/register.js';

	export default {
		name: 'Challenge',
		data() {
			return {
				isExistEmail: false,
				email: '',
				randomWords: '',
				tips: '',
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
			//验证邮箱
			checkEmail() {
				if (this.$refs.email.check()) {
					getUsers({
						email: this.email
					})
						.then(res => {
							this.isExistEmail = res.data.email;

							if (res.data.email) {
								this.$refs.email.tips = '正确的邮箱号';
							}
							else {
								this.$refs.email.tips = '不存在的邮箱号';
							}
						})
						.catch(error => {
							this.$refs.email.tips = error.message;
						});
				}
			},
			submit() {
				if (this.$refs.email.check() && this.$refs.randomWords.check() && this.isExistEmail) {
					this.$emit("challenge", {
						'randomWords': this.randomWords,
						'email': this.email,
					});
				}
			},
			clear() {
				this.email = '';
				this.randomWords = '';
				this.tips = '';
			},
		},
		watch: {
			email: {
				handler() {
					this.isExistEmail = false;
					this.checkEmail();
				}
			},
		},
		components: {
			TextBox,
			Btn,
			VerificationCode,
		},
	};
</script>

<style>
	.challenge {
		width: 280px;
		height: calc(100% - 76px);
		margin: auto;
		padding-top: 80px;
	}

		.challenge input {
			border: 1px solid #c6c6c6;
			text-indent: 10px;
		}

		.challenge .msg {
			height: 30px;
			color: var(--color-high-text);
			font-size: 14px;
		}

		.challenge .randomWords {
			width: 120px;
		}

		.challenge .vcode {
			width: 160px;
		}

		.challenge .button {
			background-color: #c62b26;
			width: 280px;
			height: 40px;
			line-height: 40px;
			color: white;
			margin-top: 50px;
		}
</style>
