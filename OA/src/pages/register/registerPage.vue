<template>
  <div class="registerPage">
    <register :verificationImgUrl="url" @register="register"></register>
    <copyright></copyright>
  </div>
</template>

<script>
/////无效的组件
import { configs } from 'common/helper/configHelper';
import Register from 'components/register/ver1/register.vue';
import Copyright from 'components/copyright/ver1/copyright.vue';

export default {
  name: 'RegisterPage',
  data() {
    return {
      url: configs('userManager').baseURL + '/authentication/img?w=300&h=300'
    };
  },
  methods: {
    register(e) {
      if (e) {
        this.$router.push({
          name: 'home'
        });
      }
    }
  },
  components: {
    Register,
    Copyright
  }
};
</script>

<style scoped>
.registerPage {
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
