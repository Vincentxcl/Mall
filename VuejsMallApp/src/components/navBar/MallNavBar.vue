<template>
  <nav-bar>
    <nav-bar-item routeName="home">
      <p slot="item-icon" class="icon-home iconfont"></p>
      <p slot="item-text">首页</p>
    </nav-bar-item>
    <nav-bar-item routeName="category">
      <p slot="item-icon" class="icon-category iconfont"></p>
      <p slot="item-text">分类</p>
    </nav-bar-item>
    <nav-bar-item routeName="cart">
      <p slot="item-icon" class="icon-cart iconfont"></p>
      <p slot="item-text">购物车</p>
    </nav-bar-item>
    <nav-bar-item routeName="profile">
      <p slot="item-icon" class="icon-profile iconfont"></p>
      <p slot="item-text">我的</p>
    </nav-bar-item>
  </nav-bar>
</template>

<script>
  import NavBar from "./common/NavBar.vue";
  import NavBarItem from "./common/NavBarItem.vue";

  export default {
    name: "MallNavBar",
    components: {
      NavBar,
      NavBarItem
    },
  };
</script>

<style scoped>
  @import "~assets/css/navBar/iconfont.css";
</style>
