<template>
  <div class="loginPage">
    <login registerLink="/register" :verificationImgUrl="url" @login="login"></login>
    <copyright></copyright>
  </div>
</template>

<script>
import { configs } from 'common/helper/configHelper';
import Login from 'components/login/ver1/login.vue';
import Copyright from 'components/copyright/ver1/copyright.vue';

export default {
  name: 'LoginPage',
  data() {
    return {
      url: configs('userManager').baseURL + '/authentication/img?w=300&h=300'
    };
  },
  methods: {
    login(e) {
      if (e) {
        this.$router.push({
          name: 'home'
        });
      }
    }
  },
  components: {
    Login,
    Copyright
  }
};
</script>

<style scoped>
.loginPage {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: linear-gradient(#f5f5f5, #ccc);
}

.copyright {
  margin-top: 20px;
}
</style>
