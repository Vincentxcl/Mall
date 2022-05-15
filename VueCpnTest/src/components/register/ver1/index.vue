<template>
	<div class="register">
		<h3><slot name="title">注&nbsp;&nbsp;册</slot></h3>

		<text-box ref="phone" :value="phone" placeholder="请输入手机号码" :maxlength="11" title="Tel" pattern="/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/" @blur="phone=$event.target.value" icon="icon-shoujihao">
			<div class="msg" slot="tips" slot-scope="textbox">
				<p class="fl" :style="isExistPhone?{}:{color:'#00dc04'}">{{textbox.tips}}</p>
			</div>
		</text-box>

		<text-box ref="password" v-model="password" type="password" placeholder="请设置密码" :maxlength="20" title="密码" pattern="/^((?!<|>).){1,20}$/" @input="checkPwd()" icon="icon-mima">
			<div class="msg" slot="tips" slot-scope="textbox">
				<p class="fl">{{textbox.tips}}</p>
				<p class="fr" v-show="isShowPwdLevel">
					<meter max="4" min="0" high="3" low="2" optimum="4" :value="pwdLevel"></meter>
					<span :style="pwdLevelColor">强度{{pwdLevelTips}}</span>
				</p>
			</div>
		</text-box>

		<text-box ref="passwordConfirm" v-model="passwordConfirm" type="password" placeholder="请确认密码" :maxlength="20" title="确认密码" @blur="checkPwdConfirm()" icon="icon-querenmima">
			<div class="msg" slot="tips" slot-scope="textbox">
				<p>{{textbox.tips}}</p>
			</div>
		</text-box>

		<text-box ref="email" :value="email" placeholder="请输入邮箱" :maxlength="30" title="邮箱" pattern="/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/" @blur="email=$event.target.value" icon="icon-youxiang">
			<div class="msg" slot="tips" slot-scope="textbox">
				<p class="fl" :style="isExistEmail?{}:{color:'#00dc04'}">{{textbox.tips}}</p>
			</div>
		</text-box>

		<text-box ref="randomWords" v-model="randomWords" placeholder="点击获取验证码" :maxlength="4" @focus="showVCode()" icon="icon-yanzhengyanzhengma" @iconClick="reverseVCodeDisplay()">
			<div class="msg" slot="tips" slot-scope="textbox">
				<p class="fl">{{textbox.tips}}</p>
			</div>
		</text-box>
		<verification-code ref="vCode" v-model="isShowVerificationCode" :x="randomWordsRect.x" :y="randomWordsRect.y+35" :img-src="verificationImgUrl" :effectiveDuration="verificationDuration" :refreshLockDuration="refreshLockDuration"></verification-code>

		<btn type="warning" @click.native="submit()">提&nbsp;&nbsp;&nbsp;交</btn>
		<div class="msg">
			<p class="fl">{{message}}</p>
		</div>
	</div>
</template>

<script>
	import TextBox from 'components/widgets/textbox.vue';
	import Btn from 'components/button/btn.vue';
	import VerificationCode from 'components/verificationCode/verificationCodeFull.vue';

	//import { getUsers, tryRegister, } from 'netWork/register.js';

	export default {
		name: 'Register',
		data() {
			return {
				isShowVerificationCode: false,
				phone: '',
				password: '',
				passwordConfirm: '',
				email: '',
				randomWords: '',
				isExistPhone: true,
				isExistEmail: true,
				randomWordsRect: {},
				isShowPwdLevel: false,
				pwdLevel: 0,
				pwdLevelTips: '低',
				message: '',
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
		computed: {
			pwdLevelColor() {
				let _color = 'red';
				switch (this.pwdLevel) {
					case (2): {
						_color = 'var(--color-warming)';
					} break;
					case (4): {
						_color = 'var(--color-success)';
					} break;
					default: {
						_color = 'var(--color-danger)';
					}
				}
				return {
					color: _color,
				};
			},
		},
		methods: {
			//验证手机号
			checkPhone() {
				if (this.$refs.phone.check()) {
					getUsers({
						ver: '1.0',
						fields: 'phone',
						phone: this.phone
					})
						.then(res => {
							this.isExistPhone = res.data.length > 0;

							if (this.isExistPhone) {
								this.$refs.phone.tips = '已被注册';
							}
							else {
								this.$refs.phone.tips = '未被注册';
							}
						})
						.catch(error => {
							this.$refs.phone.tips = error.message;
						});
				}
			},
			//验证密码格式-->密码强度
			checkPwd() {
				if (this.$refs.password.check()) {
					this.isShowPwdLevel = true;
					this.checkPwdLevel(this.password);
				}
				else {
					this.isShowPwdLevel = false;
				}
			},
			//验证密码强度
			checkPwdLevel() {
				var reg_expg = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,20}$/;//高
				var reg_expz = /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,16}$/;//中

				if (reg_expg.test(this.password)) {
					this.pwdLevel = 4;
					this.pwdLevelTips = '高';
					return true;
				}
				else if (reg_expz.test(this.password)) {
					this.pwdLevel = 2;
					this.pwdLevelTips = '中';
					return true;
				}
				else {
					this.pwdLevel = 1;
					this.pwdLevelTips = '低';
					return false
				}
			},
			//验证密码是否相同
			checkPwdConfirm() {
				if (this.password.trim() != '') {
					//对比框是否有值
					if (this.passwordConfirm.trim() != '') {
						//对比
						if (this.passwordConfirm === this.password) {
							this.$refs.passwordConfirm.tips = '';
							return true;
						}
						else {
							this.$refs.passwordConfirm.tips = '两次输入的密码不相同';
							return false;
						}
					}
					else {
						this.$refs.passwordConfirm.tips = '请确认密码';
						return false;
					}
				}
				else {
					return false;
				}
			},
			//验证邮箱
			checkEmail() {
				if (this.$refs.email.check()) {
					getUsers({
						ver: '1.0',
						fields: 'email',
						email: this.email
					})
						.then(res => {
							this.isExistEmail = res.data.length > 0;

							if (this.isExistEmail) {
								this.$refs.email.tips = '已被注册';
							}
							else {
								this.$refs.email.tips = '未被注册';
							}
						})
						.catch(error => {
							this.$refs.email.tips = error.message;
						});
				}
			},
			//
			clear() {
				this.$refs.phone.clear();
				this.$refs.password.clear();
				this.$refs.passwordConfirm.clear();
				this.$refs.email.clear();
				this.$refs.randomWords.clear();
				this.message = "";
			},
			reverseVCodeDisplay() {
				this.isShowVerificationCode = !this.isShowVerificationCode;
			},
			showVCode() {
				this.isShowVerificationCode = true;
			},
			refreshVCode() {
				this.$refs.vCode.refresh();
			},
			//提交
			submit() {
				if (!this.isExistPhone && this.$refs.password.check() && this.checkPwdLevel() && this.$refs.passwordConfirm.check() && this.checkPwdConfirm() && !this.isExistEmail && this.$refs.randomWords.check()) {
					let user = {
						randomWords: this.randomWords,
						phone: this.phone,
						pwd: this.password,
						email: this.email,
					};

					tryRegister(user)
						.then(res => {
							this.message = '注册成功';
							//this.refreshVCode();
							this.clear();
							//响应是否注册成功
							this.$emit('register', true);
						})
						.catch(error => {
							this.message = decodeURI(JSON.stringify(error.response.data));
						});
				}
			},
		},
		watch: {
			phone: {
				handler(current) {
					this.isExistPhone = true;
					if (current != '') this.checkPhone();
				}
			},
			email: {
				handler(current) {
					this.isExistEmail = true;
					if (current != '') this.checkEmail();
				}
			},
			isShowVerificationCode: {
				handler(current) {
					if (current) {
						//尺寸位置
						this.randomWordsRect = this.$refs.randomWords.$el.getBoundingClientRect();
					}
				}
			}
		},
		components: {
			TextBox,
			Btn,
			VerificationCode,
		},
	}

</script>

<style>
	div.register {
		background-image: linear-gradient(to bottom, #7a7a7a,#3d3d3d);
		border-radius: 8px;
		width: 350px;
		height: 600px;
	}

		div.register h3 {
			text-align: center;
			color: white;
			font-size: 25px;
			font-weight: 200;
			padding: 30px 0px 20px;
		}

		div.register div.textBox,
		div.register button.btn {
			display: block;
			width: 260px;
			margin: auto;
		}

		div.register button.btn {
			font-size: 16px;
		}

		/*输入框*/
		div.register input[type="text"],
		div.register input[type="password"] {
			width: 100%;
		}

		div.register span.ext {
			position: absolute;
			color: var(--color-hight-text);
		}

		div.register div.msg {
			width: 260px;
			height: 40px;
			margin: 8px auto 0px;
		}

			div.register div.msg p {
				color: var(--color-high-text);
				font-size: 14px;
			}
</style>
