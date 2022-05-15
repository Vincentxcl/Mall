<template>
	<div class="setPwd">
		<div class="title">
			<h4>请填写新密码</h4>
			<p>强烈建议密码长度为8-16个，包含数字，大小写字母和符号</p>
		</div>

		<text-box ref="password" v-model="password" type="password" placeholder="请设置密码" :width="280" :height="40" :maxlength="20" title="密码" pattern="/^((?!<|>).){1,20}$/" @input="checkPwd">
			<div class="msg" slot="tips" slot-scope="textbox">
				<p class="fl">{{textbox.tips}}</p>
				<p class="fr" v-show="isShowPwdLevel">
					<meter max="4" min="0" high="3" low="2" optimum="4" :value="pwdLevel"></meter>
					<span :style="pwdLevelColor">强度{{pwdLevelTips}}</span>
				</p>
			</div>
		</text-box>

		<text-box ref="passwordConfirm" v-model="passwordConfirm" type="password" placeholder="请确认密码" :width="280" :height="40" :maxlength="20" title="确认密码" @blur="checkPwdConfirm()">
			<div class="msg" slot="tips" slot-scope="textbox">
				<p>{{textbox.tips}}</p>
			</div>
		</text-box>

		<btn @click.native="submit">提交</btn>
		<div class="msg">{{tips}}</div>
	</div>
</template>

<script>
	import TextBox from 'components/widgets/textbox.vue';
	import Btn from 'components/button/btn.vue';

	export default {
		name: 'SetPwd',
		data() {
			return {
				password: '',
				passwordConfirm: '',
				isShowPwdLevel: false,
				pwdLevel: 0,
				pwdLevelTips: '低',
				tips: '',
			};
		},
		computed: {
			pwdLevelColor() {
				let _color = 'red';
				switch (this.pwdLevel) {
					case (2): {
						_color = '#ffb400';
					} break;
					case (4): {
						_color = '#00dc04';
					} break;
					default: {
						_color = 'red';
					}
				}
				return {
					color: _color,
				};
			},
		},
		methods: {
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
			checkPwdLevel(pwd) {
				var reg_expg = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,20}$/;//高
				var reg_expz = /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,16}$/;//中

				if (reg_expg.test(pwd)) {
					this.pwdLevel = 4;
					this.pwdLevelTips = '高';
					return true;
				}
				else if (reg_expz.test(pwd)) {
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
			submit() {
				if (this.$refs.password.check() && this.checkPwdLevel(this.password) && this.$refs.passwordConfirm.check() && this.checkPwdConfirm()) {
					this.$emit('setPwd', this.password);
				}
			},
			clear() {
				this.password = '';
				this.passwordConfirm = '';
			},
		},
		components: {
			TextBox,
			Btn,
		},
	};
</script>

<style>
	.setPwd {
		height: calc(100% - 76px);
		margin: auto;
	}

		.setPwd .title {
			width: 380px;
			height: 80px;
			margin: auto;
			padding-top: 30px;
		}

			.setPwd .title p {
				color: var(--color-high-text);
				font-size: 14px;
			}

		.setPwd .textBox {
			width: 280px;
			margin: auto;
		}

		.setPwd input {
			border: 1px solid #c6c6c6;
			text-indent: 10px;
		}

		.setPwd .msg {
			height: 30px;
			color: var(--color-high-text);
			font-size: 14px;
		}

		.setPwd .button {
			background-color: #c62b26;
			width: 280px;
			height: 40px;
			line-height: 40px;
			color: white;
			margin: 30px auto 0px;
		}

		.setPwd > .msg {
			width: 280px;
			margin: auto;
		}
</style>
