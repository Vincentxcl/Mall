<template>
  <drop-down-list class="avatarInfo">
    <avatar slot="trigger" :url="portraitUrl"></avatar>
    <ul>
      <li @click="toUserProfile">个人中心</li>
      <li @click="logout">退出</li>
    </ul>
  </drop-down-list>
</template>

<script>
import DropDownList from 'components/dropDownList/index.vue';
import Avatar from 'components/avatar/index.vue';
import * as login from 'netWork/login.js';
import { deleteCookie } from 'common/helper/cookiesHelper.js';

export default {
  name: 'AvatarInfo',
  computed: {
    portraitUrl() {
      return this.$store.getters['current/portraitUrl'];
    }
  },
  methods: {
    toUserProfile() {
      this.$router.push({ name: 'profile' });
    },
    logout() {
      //注销服务器登陆身份
      login
        .logout()
        .then(() => {
          this.$toast.show({ type: 'success', text: '退出成功' });
        })
        .catch((error) => {
          let str = JSON.stringify(error.response.data);
          this.$toast.show({ type: 'warning', text: error.response.status + '退出异常' + str });
        });

      //删除本地账号
      deleteCookie('user'); //移除用户账号密码
      deleteCookie('userAuth'); //移除令牌
      window.sessionStorage.removeItem('userAuth'); //移除令牌
      this.$store.dispatch('current/clearUserInfo'); //移除vuex用户信息
      this.$router.push({ name: 'login' });
    }
  },
  components: {
    DropDownList,
    Avatar
  }
};
</script>

<style>
.avatarInfo .avatar:hover {
  cursor: pointer;
}

/* 对话框尺寸 */
.avatarInfo .container-with-arrow {
  width: 100px;
  height: 70px;
  margin-top: 10px;
  margin-left: -60px;
}

/* 箭头位置 */
.avatarInfo .arrow {
  left: 72px;
}

.avatarInfo ul {
  display: flex;
  flex-flow: column;
  justify-content: center;
  height: 100%;
}

.avatarInfo ul li {
  text-align: center;
  line-height: 30px;
  font-size: 14px;
}

.avatarInfo ul li:hover {
  cursor: pointer;
  color: var(--color-high-text);
}
</style>
