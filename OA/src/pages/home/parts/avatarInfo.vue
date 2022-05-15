<template>
  <drop-down-list class="avatarInfo">
    <avatar slot="trigger"></avatar>
    <ul>
      <li>个人中心</li>
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
  methods: {
    logout() {
      login
        .logout()
        .then(() => {
          deleteCookie('user');
          deleteCookie('userAuth');
          this.$router.push({ name: 'login' });
        })
        .catch((error) => console.log(error));
    }
  },
  components: {
    DropDownList,
    Avatar
  }
};
</script>

<style>
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
