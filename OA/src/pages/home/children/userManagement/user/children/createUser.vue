<template>
  <div class="createUser">
    <div class="workbench">
      <div class="grid">
        <table>
          <tr>
            <td class="ttl">电话:</td>
            <td>
              <text-box ref="phone" :value="phone" placeholder="请输入手机号码" :maxlength="11" title="Tel" pattern="/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/" @blur="phone = $event.target.value" icon="icon-shoujihao">
                <div class="tip" slot="tips" slot-scope="textbox">
                  <p class="fl" :style="isExistPhone ? {} : { color: 'var(--color-success)' }">{{ textbox.tips }}</p>
                </div>
              </text-box>
            </td>
          </tr>
          <tr>
            <td class="ttl">密码:</td>
            <td>
              <text-box ref="password" v-model="password" type="password" placeholder="请设置密码" :maxlength="20" title="密码" pattern="/^((?!<|>).){1,20}$/" @input="checkPwd()" icon="icon-mima">
                <div class="tip" slot="tips" slot-scope="textbox">
                  <p class="fl">{{ textbox.tips }}</p>
                  <p class="fr" v-show="isShowPwdLevel">
                    <meter max="4" min="0" high="3" low="2" optimum="4" :value="pwdLevel"></meter>
                    <span :style="pwdLevelColor">强度{{ pwdLevelTips }}</span>
                  </p>
                </div>
              </text-box>
            </td>
          </tr>
          <tr>
            <td class="ttl">确认:</td>
            <td>
              <text-box ref="passwordConfirm" v-model="passwordConfirm" type="password" placeholder="请确认密码" :maxlength="20" title="确认密码" @blur="checkPwdConfirm()" icon="icon-querenmima">
                <div class="tip" slot="tips" slot-scope="textbox">
                  <p>{{ textbox.tips }}</p>
                </div>
              </text-box>
            </td>
          </tr>
          <tr>
            <td class="ttl">邮箱:</td>
            <td>
              <text-box ref="email" :value="email" placeholder="请输入邮箱" :maxlength="30" title="邮箱" pattern="/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/" @blur="email = $event.target.value" icon="icon-youxiang">
                <div class="tip" slot="tips" slot-scope="textbox">
                  <p class="fl" :style="isExistEmail ? {} : { color: '#00dc04' }">{{ textbox.tips }}</p>
                </div>
              </text-box>
            </td>
          </tr>
          <tr>
            <td class="ttl">验证码:</td>
            <td>
              <text-box ref="randomWords" v-model="randomWords" placeholder="点击获取验证码" :maxlength="4" @focus="showVCode()" icon="icon-yanzhengyanzhengma" @iconClick="reverseVCodeDisplay()" @tab="reverseVCodeDisplay()">
                <div class="tip" slot="tips" slot-scope="textbox">
                  <p class="fl">{{ textbox.tips }}</p>
                </div>
              </text-box>
              <verification-code ref="vCode" v-model="isShowVerificationCode" :x="randomWordsRect.x" :y="randomWordsRect.y + 35" :img-src="verificationImgUrl" :effectiveDuration="verificationDuration" :refreshLockDuration="refreshLockDuration"></verification-code>
            </td>
          </tr>
        </table>
      </div>
      <div class="ctrl">
        <div>
          <div class="message">{{ message }}</div>
          <btn type="brand" :isForbidden="isForbidden" @click="submit">提交</btn>
        </div>
        <div>
          <btn type="normal" @click="back">返回</btn>
        </div>
      </div>
    </div>
    <div class="assistance">
      <assistance-tool-bar :items="assistanceBarItems" @click="toolItemsClick"></assistance-tool-bar>
    </div>
  </div>
</template>

<script>
import { computedAssistanceBarItems } from 'common/mixins/computedAssistanceBarItems';
import Textbox from 'components/widgets/textbox.vue';
import Btn from 'components/button/btn.vue';
import VerificationCode from 'components/verificationCode/verificationCodeFull.vue';
import AssistanceToolBar from 'components/navigation/stl.v1/assistanceToolBar.vue';

import * as userinfo from 'netWork/userinfo.js';

export default {
  name: 'CreateSysParams',
  mixins: [computedAssistanceBarItems],
  data() {
    return {
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

      isForbidden: false,
      message: ''
    };
  },
  computed: {
    pwdLevelColor() {
      let _color = 'red';
      switch (this.pwdLevel) {
        case 2:
          {
            _color = 'var(--color-warning)';
          }
          break;
        case 4:
          {
            _color = 'var(--color-success)';
          }
          break;
        default: {
          _color = 'var(--color-danger)';
        }
      }
      return {
        color: _color
      };
    }
  },
  methods: {
    toolItemsClick(e) {
      switch (e.id) {
        case 61051:
          {
            this.clear();
          }
          break;
        default:
          break;
      }
    },
    //验证手机号
    checkPhone() {
      if (this.$refs.phone.check()) {
        userinfo
          .requestData({
            ver: '1.0',
            fields: 'phone',
            phone: this.phone
          })
          .then((res) => {
            this.isExistPhone = res.data.length > 0;

            if (this.isExistPhone) {
              this.$refs.phone.tips = '已被注册';
            } else {
              this.$refs.phone.tips = '未被注册';
            }
          })
          .catch((error) => {
            this.$refs.phone.tips = error.message;
          });
      }
    },
    //验证密码格式-->密码强度
    checkPwd() {
      if (this.$refs.password.check()) {
        this.isShowPwdLevel = true;
        this.checkPwdLevel(this.password);
      } else {
        this.isShowPwdLevel = false;
      }
    },
    //验证密码强度
    checkPwdLevel() {
      var reg_expg = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,20}$/; //高
      var reg_expz = /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,16}$/; //中

      if (reg_expg.test(this.password)) {
        this.pwdLevel = 4;
        this.pwdLevelTips = '高';
        return true;
      } else if (reg_expz.test(this.password)) {
        this.pwdLevel = 2;
        this.pwdLevelTips = '中';
        return true;
      } else {
        this.pwdLevel = 1;
        this.pwdLevelTips = '低';
        return false;
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
          } else {
            this.$refs.passwordConfirm.tips = '两次输入的密码不相同';
            return false;
          }
        } else {
          this.$refs.passwordConfirm.tips = '请确认密码';
          return false;
        }
      } else {
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
          .then((res) => {
            this.isExistEmail = res.data.length > 0;

            if (this.isExistEmail) {
              this.$refs.email.tips = '已被注册';
            } else {
              this.$refs.email.tips = '未被注册';
            }
          })
          .catch((error) => {
            this.$refs.email.tips = error.message;
          });
      }
    },

    clear() {
      this.$refs.phone.clear();
      this.$refs.password.clear();
      this.$refs.passwordConfirm.clear();
      this.$refs.email.clear();
      this.$refs.randomWords.clear();
      this.message = '';
      this.isForbidden = false;
    },
    back() {
      this.$router.push({
        name: 'sysParamsList'
      });
    },
    validate() {
      return this.$refs.title.check() && this.$refs.value.check() && this.$refs.ord.check() && this.$refs.description.check();
    },
    submit() {
      if (this.validate()) {
        let obj = {
          title: this.title,
          value: this.value,
          description: this.description
        };
        if (this.ord) {
          obj.ord = this.ord;
        }
        this.isForbidden = true; //提交按钮禁用，不能再点击
        this.message = '正在提交数据';
        this.createData(obj);
      }
    },
    createData(e) {
      postData(e, this)
        .then(() => {
          this.$toast.show({ type: 'success', text: '添加成功' });
          this.clear();
        })
        .catch((error) => {
          let str;
          if (error.response.data) {
            str = JSON.stringify(error.response.data.errors);
          }
          this.message = str;
          this.isForbidden = false;
        });
    }
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
		},

  components: {
    Textbox,
    Btn,
    AssistanceToolBar
  }
};
</script>

<style>
div.createUser {
  height: calc(100% - 40px);
}

div.createUser div.workbench {
  height: calc(100% - 25px);
  overflow: auto;
}

div.createUser div.grid {
  padding: 10px;
  font-size: 14px;
}

/* #region table圆角 */
div.createUser table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

div.createUser table td {
  border: 1px solid rgb(226, 226, 226);
  border-left: none;
  border-bottom: none;
  padding: 5px 10px;
}

div.createUser table tr:first-child td:first-child {
  border-top-left-radius: 5px; /* 设置table左下圆角 */
}

div.createUser table tr:first-child td:last-child {
  border-top-right-radius: 5px; /* 设置table右下圆角 */
}

div.createUser table tr:last-child td:first-child {
  border-bottom-left-radius: 5px; /* 设置table左下圆角 */
}

div.createUser table tr:last-child td:last-child {
  border-bottom-right-radius: 5px; /* 设置table右下圆角 */
}

div.createUser table tr td:first-child {
  border-left: 1px solid rgb(226, 226, 226);
}

div.createUser table tr:last-child td {
  border-bottom: 1px solid rgb(226, 226, 226);
}
/* #endregion */

div.createUser table tr td:first-child {
  width: 150px;
}

div.createUser div.grid .textBox {
  width: 100%;
}

div.createUser div.grid input {
  width: 60%;
  min-width: 400px;
}

div.createUser div.grid textarea {
  width: 60%;
  min-width: 400px;
  height: 100px;
}

div.createUser div.grid div.tip {
  display: inline-block;
  color: var(--color-danger);
}

div.createUser div.ctrl {
  display: flex;
}

div.createUser div.ctrl > div {
  width: 50%;
}

div.createUser div.ctrl > div:first-child {
  display: flex;
  justify-content: flex-end;
}

div.createUser div.ctrl button {
  margin: 0px 5px;
}

div.createUser div.ctrl button.isForbidden {
  cursor: not-allowed;
}

div.createUser div.message {
  height: 30px;
  line-height: 30px;
  color: var(--color-danger);
}

div.createUser div.assistance {
  display: flex;
  background: #ebebeb;
  width: 100%;
  min-width: 600px;
  height: 25px;
}
</style>
