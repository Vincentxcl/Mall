<template>
  <div class="login">
    <h3><slot name="title">登&nbsp;&nbsp;录</slot></h3>

    <text-box ref="account" v-model="account" placeholder="账号" pattern="/^[a-zA-Z0-9_-]{5,30}$/" title="账号" icon="icon-zhanghao">
      <div class="msg" slot="tips" slot-scope="textbox">
        <p class="fl">{{ textbox.tips }}</p>
        <template v-if="registerLink.trim() != ''">
          <a v-if="preUrl.trim() != ''" class="fr" :href="registerLink + '?preUrl=' + preUrl">注册账号</a>
          <a v-else class="fr" :href="registerLink">注册账号</a>
        </template>
      </div>
    </text-box>

    <text-box ref="password" v-model="password" type="password" placeholder="密码" :maxlength="20" pattern="/^((?!<|>).){1,20}$/" title="密码" icon="icon-mima">
      <div class="msg" slot="tips" slot-scope="textbox">
        <p class="fl">{{ textbox.tips }}</p>
        <a v-if="getPwdLink.trim() != ''" class="fr" :href="getPwdLink">忘记密码</a>
      </div>
    </text-box>

    <text-box ref="randomWords" v-model="randomWords" placeholder="点击获取验证码" :maxlength="4" @focus="showVCode()" @iconClick="reverseVCodeDisplay()" @tab="reverseVCodeDisplay()" title="验证码" icon="icon-yanzhengyanzhengma">
      <div class="msg" slot="tips" slot-scope="textbox">
        <p class="fl">{{ textbox.tips }}</p>
      </div>
    </text-box>
    <verification-code ref="vCode" v-model="isShowVerificationCode" :img-src="verificationImgUrl" :x="randomWordsRect.x" :y="randomWordsRect.y + 35" :effectiveDuration="effectiveDuration" :refreshLockDuration="refreshLockDuration"></verification-code>

    <btn type="warning" @click.native="submit()">登&nbsp;&nbsp;&nbsp;录</btn>
    <div class="msg">
      <p class="fl">{{ message }}</p>
      <label class="fr">
        <input type="checkbox" v-model="autoLogin" />
        <span>&nbsp;{{ num }}日内自动登录</span>
      </label>
    </div>
  </div>
</template>

<script>
import TextBox from 'components/widgets/textbox.vue';
import Btn from 'components/button/btn.vue';
import VerificationCode from 'components/verificationCode/verificationCodeFull.vue';

import { tryLogin } from 'netWork/login';
import { getCookie } from 'common/helper/cookiesHelper';

export default {
  name: 'Login',
  data() {
    return {
      isShowVerificationCode: false,
      account: '',
      password: '',
      randomWords: '',
      autoLogin: false,
      randomWordsRect: {},
      message: ''
    };
  },
  props: {
    //验证码图片url
    verificationImgUrl: {
      type: String,
      required: true,
      default() {
        return '';
      }
    },
    //验证码有效时间
    effectiveDuration: {
      type: Number,
      default() {
        return 1000 * 60 * 5;
      }
    },
    //刷新间隔时间
    refreshLockDuration: {
      type: Number,
      default() {
        return 1000 * 5;
      }
    },
    //前一页地址url
    preUrl: {
      type: String,
      default() {
        return '';
      }
    },
    //注册账号链接地址
    registerLink: {
      type: String,
      default() {
        return '';
      }
    },
    //找回密码链接地址
    getPwdLink: {
      type: String,
      default() {
        return '';
      }
    },
    //自动登录的有效期
    num: {
      type: Number,
      default() {
        return 5;
      }
    }
  },
  methods: {
    clear() {
      this.$refs.account.clear();
      this.$refs.password.clear();
      this.$refs.randomWords.clear();
      this.autoLogin = false;
      this.message = '';
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
    submit() {
      if (this.$refs.account.check() && this.$refs.password.check() && this.$refs.randomWords.check()) {
        this.message = '正在登陆...';

        let user = {
          account: this.account,
          password: this.password,
          randomWords: this.randomWords,
          autoLogin: this.autoLogin,
          durationDay: this.num
        };

        tryLogin(user)
          .then((res) => {
            this.clear();
            this.message = decodeURI(res.data);
            //返回是否登录成功 true
            this.$emit('login', true);
          })
          .catch((error) => {
            this.refreshVCode();
            this.clear();
            this.message = decodeURI(error.response.data);
          });
      }
    }
  },
  watch: {
    isShowVerificationCode: {
      handler(current) {
        if (current) {
          //尺寸位置
          this.randomWordsRect = this.$refs.randomWords.$el.getBoundingClientRect();
        }
      }
    }
  },
  created() {
    //尝试登陆
    if (getCookie('user')) {
      tryLogin({ durationDay: 5 }).then(() => {
        this.$emit('login', true);
      });
    }
  },
  components: {
    TextBox,
    Btn,
    VerificationCode
  }
};
</script>

<style>
/*控件外观*/
div.login {
  background-image: linear-gradient(to bottom, #7a7a7a, #3d3d3d);
  border-radius: 3px;
  width: 350px;
  height: 500px;
}

div.login h3 {
  text-align: center;
  color: white;
  font-size: 25px;
  font-weight: 200;
  padding: 30px 0px 30px;
}

div.login div.textBox,
div.login button.btn {
  display: block;
  width: 260px;
  margin: auto;
}

div.login button.btn {
  font-size: 16px;
}

/*输入框*/
div.login input[type='text'],
div.login input[type='password'] {
  width: 100%;
}

div.login span.ext {
  position: absolute;
  color: var(--color-hight-text);
}

div.login div.msg {
  width: 260px;
  height: 40px;
  margin: 8px auto 0px;
}

div.login div.msg p {
  color: var(--color-high-text);
  font-size: 14px;
}

div.login div.msg a,
div.login div.msg label {
  font-size: 15px;
  color: white;
  cursor: pointer;
}
</style>
