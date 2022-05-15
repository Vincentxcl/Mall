<template>
  <div>
    <h1 @click="show = !show">Category</h1>
    <!-- <login></login> -->
    <register verificationImgUrl="http://localhost:8000/api/authentication/img?w=300&h=300"></register>
  </div>
</template>

<script>
import Login from 'components/login/ver1/index.vue';
import Register from 'components/register/ver1/index.vue';

export default {
  name: 'Category',
  data() {
    return {
      show: true
    };
  },
  components:{
    Login,
    Register
  },
};
</script>

<style scoped>
</style>

