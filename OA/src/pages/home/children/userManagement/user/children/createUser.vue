<template>
  <div class="createUser">
    <div class="workbench">
      <div class="grid">
    <input ref="file"  type="file" name="input1" @change="get" />


        <div>姓名:</div>
        <text-box ref="name" v-model="name" :maxlength="16" title="姓名" pattern="/^[0-9a-zA-Z\u4e00-\u9fa5]{1,16}$/g">
          <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
        </text-box>
        <div>性别:</div>
        <div>
          <label> <input type="radio" name="sex" :value="true" v-model="gender" />男 </label>
          <label> <input type="radio" name="sex" :value="false" v-model="gender" />女 </label>
        </div>
        <div>电话:</div>
        <text-box ref="phone" :value="phone" :maxlength="11" title="Tel" pattern="/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/" @blur="phone = $event.target.value">
          <div class="tip" slot="tips" slot-scope="textbox">
            <p class="fl" :style="isExistPhone ? {} : { color: 'var(--color-success)' }">{{ textbox.tips }}</p>
          </div>
        </text-box>
        <div>密码:</div>
        <text-box ref="password" v-model="password" type="password" :maxlength="20" title="密码" pattern="/^((?!<|>).){1,16}$/" @input="checkPwd()">
          <div class="tip" slot="tips" slot-scope="textbox">
            <p class="fl">{{ textbox.tips }}</p>
            <p class="fr" v-show="isShowPwdLevel">
              <meter max="4" min="0" high="3" low="2" optimum="4" :value="pwdLevel"></meter>
              <span :style="pwdLevelColor">强度{{ pwdLevelTips }}</span>
            </p>
          </div>
        </text-box>
        <div>确认密码</div>
        <text-box ref="passwordConfirm" v-model="passwordConfirm" type="password" :maxlength="20" title="确认密码" @blur="checkPwdConfirm()">
          <div class="tip" slot="tips" slot-scope="textbox">
            <p>{{ textbox.tips }}</p>
          </div>
        </text-box>
        <div>邮箱:</div>
        <text-box ref="email" :value="email" :maxlength="64" title="邮箱" pattern="/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/" @blur="email = $event.target.value">
          <div class="tip" slot="tips" slot-scope="textbox">
            <p class="fl" :style="isExistEmail ? {} : { color: '#00dc04' }">{{ textbox.tips }}</p>
          </div>
        </text-box>
        <div>生日:</div>
        <calender ref="calender" @change="getDate"></calender>
        <div>QQ:</div>
        <text-box ref="qq" v-model="qq" :maxlength="32" title="QQ" :required="false" pattern="/^[0-9]{1,32}$/">
          <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
        </text-box>
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
import { dateFormat } from 'common/helper/convertHelper.js';
import { computedAssistanceBarItems } from 'common/mixins/computedAssistanceBarItems';
import TextBox from 'components/widgets/textbox.vue';
import Btn from 'components/button/btn.vue';
import Calender from 'components/calendar/v1/calender.vue';
import AssistanceToolBar from 'components/navigation/stl.v1/assistanceToolBar.vue';

import * as userinfo from 'netWork/userinfo.js';

export default {
  name: 'CreateUser',
  mixins: [computedAssistanceBarItems],
  data() {
    return {
      uploadfile:undefined,
      name: '',
      gender: true,
      phone: '',
      password: '',
      passwordConfirm: '',
      email: '',
      birthday: '',
      qq: '',

      isExistPhone: true,
      isExistEmail: true,
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
    get() {
      this.uploadfile = this.$refs.file.files[0];
    },


    toolItemsClick(e) {
      switch (e.id) {
        case 51051:
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
            this.$refs.phone.tips = JSON.stringify(error.response);
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
        userinfo
          .requestData({
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
            this.$refs.email.tips = JSON.stringify(error.response);
          });
      }
    },
    getDate(e) {
      this.birthday = e;
    },
    clear() {
      this.$refs.name.clear();
      this.gender = true;
      this.$refs.phone.clear();
      this.$refs.password.clear();
      this.$refs.passwordConfirm.clear();
      this.$refs.email.clear();
      this.$refs.calender.clear();
      this.$refs.qq.clear();
      this.message = '';
      this.isForbidden = false;
    },
    back() {
      this.$router.push({
        name: 'userList'
      });
    },
    validate() {
      //非必填项，但不能填错
      if (this.birthday) {
        if (!this.$refs.calender.check()) {
          this.message = '请选择正确的日期';
          return false;
        }
      }
      if (this.qq) {
        if (!this.$refs.qq.check()) {
          return false;
        }
      }

      return this.$refs.name.check() && !this.isExistPhone && this.$refs.password.check() && this.checkPwdLevel() && this.$refs.passwordConfirm.check() && this.checkPwdConfirm() && !this.isExistEmail;
    },
    submit() {
      if (this.validate()) {
        //表单形式传输
        let formData = new FormData();
        formData.append('name', this.name);
        formData.append('gender', this.gender);
        formData.append('phone', this.phone);
        formData.append('pwd', this.password);
        formData.append('email', this.email);

        if(this.uploadfile){
          formData.append('portrait',this.uploadfile)
        }

        if (this.birthday) {
          formData.append('birthday', dateFormat(this.birthday));
        }
        if (this.qq) {
          formData.append('qq', this.qq);
        }
        this.isForbidden = true; //提交按钮禁用，不能再点击
        this.message = '正在提交数据';
        this.createData(formData);
      }
    },
    createData(e) {
      userinfo
        .postData(e, this)
        .then(() => {
          this.$toast.show({ type: 'success', text: '添加成功' });
          this.clear();
        })
        .catch((error) => {
          let str;
          if (error.response.data) {
            str = JSON.stringify(error.response.data);
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
    }
  },

  components: {
    TextBox,
    Btn,
    AssistanceToolBar,
    Calender
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
