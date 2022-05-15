<template>
  <nav-bar>
    <nav-bar-item routeName="home">
      <home slot="icon"></home>
      <template slot="title">
        首页
      </template>
    </nav-bar-item>
    <nav-bar-item routeName="category">
      <category slot="icon"></category>
      <template slot="title">
        分类
      </template>
    </nav-bar-item>
    <nav-bar-item routeName="cart">
      <cart slot="icon"></cart>
      <template slot="title">
        购物车
      </template>
    </nav-bar-item>
    <nav-bar-item routeName="profile">
      <profile slot="icon"></profile>
      <template slot="title">
        我的
      </template>
    </nav-bar-item>
  </nav-bar>
</template>

<script>
  import Home from 'components/widgets/icons/home.vue';
  import Category from 'components/widgets/icons/category.vue';
  import Cart from 'components/widgets/icons/cart.vue';
  import Profile from 'components/widgets/icons/profile.vue';
  import NavBar from "./parts/navBar.vue";
  import NavBarItem from "./parts/navBarItem.vue";

  export default {
    name: "MallNavBar",
    components: {
      Home,
      Category,
      Cart,
      Profile,
      NavBar,
      NavBarItem
    },
  };
</script>

<style scoped>
</style>
