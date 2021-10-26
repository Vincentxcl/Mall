<template>
  <div id="app">
    <keep-alive :exclude="['Detail']">
      <router-view></router-view>
    </keep-alive>
    <mall-nav-bar v-if="showNavBar"></mall-nav-bar>
  </div>
</template>

<script>
  import MallNavBar from "components/navBar/MallNavBar.vue";

  export default {
    name: 'app',
    data() {
      return {
        routeNames: ['detail'],
      };
    },
    computed: {
      showNavBar() {
        return (this.routeNames.indexOf(this.$route.name) < 0);
      },
    },
    components: {
      MallNavBar
    }
  };
</script>

<style>
  @import "~assets/css/base.css";

  #app {
    height: 100vh;
  }
</style>
