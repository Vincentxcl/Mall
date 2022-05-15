
<template>
  <div id="app">
    <router-view></router-view>
    <mobile-nav-bar :items="menu"></mobile-nav-bar>
  </div>
</template>

<script>
import MobileNavBar from 'components/navigation/stl.v1/mobileNavBar.vue';

export default {
  name: 'app',
  data() {
    return {
      menu: {
        value: [
          { id: 1, routeName: 'home', path: '首页', title: '首页', icon: 'icon-zhuye' },
          { id: 2, routeName: 'category', path: '分类', title: '分类', icon: 'icon-fenlei' },
          { id: 3, routeName: 'cart', path: '购物车', title: '购物车', icon: 'icon-gouwuche' },
          { id: 4, routeName: 'profile', path: '我的', title: '我的', icon: 'icon-zhanghao' }
        ],
        isShow: true
      }
    };
  },
  computed: {
    demo() {
      return this.$route.name;
    }
  },
  created() {
			this.$store.commit('SetSiteMap', this.menu);
		},
  components: {
    MobileNavBar
  }
};
</script>

<style>
@import '~assets/cssBase/base.css';
</style>
