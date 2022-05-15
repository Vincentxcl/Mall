<template>
  <div class="registerPage">
    <register :verificationImgUrl="url"></register>
  </div>
</template>

<script>
import { configs } from 'common/helper/configHelper';
import Register from 'components/register/ver1/index.vue';

export default {
  name: 'RegisterPage',
  data() {
    return {
      url: configs('userManager').baseURL + '/authentication/img?w=300&h=300'
    };
  },
  components: {
    Register
  }
};
</script>

<style scoped>
.registerPage {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #ccc;
}
</style>
