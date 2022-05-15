<template>
  <div class="loginPage">
    <login registerLink="/register" :verificationImgUrl="url" @login="login"></login>
  </div>
</template>

<script>
import { configs } from 'common/helper/configHelper';
import Login from 'components/login/ver1/index.vue';

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
    Login
  }
};
</script>

<style scoped>
.loginPage {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #ccc;
}
</style>
