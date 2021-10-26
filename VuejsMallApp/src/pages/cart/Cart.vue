<template>
  <section id="cart">
    <head-bar>
      <p slot="middle">购物车({{listLength}})</p>
    </head-bar>
    <scroll ref="scroll" :probe-type="3" @position="scrollPosition">
      <cart-list v-if="listLength>0"></cart-list>
    </scroll>
    <cart-calculate v-if="listLength>0" :isAllSelected="isAllSelected" :totalPrice="selectedItemsTotalPrice" :selectedCount="selectedItemsCount" @SelectAll="cartListCheckItems"></cart-calculate>
  </section>
</template>

<script>
  import { mapState, mapGetters } from 'vuex';

  import HeadBar from 'components/headBar/Index.vue';
  import Scroll from 'components/scroll/scroll.vue';
  import CartList from './parts/CartList.vue';
  import CartCalculate from './parts/CartCalculate.vue';

  export default {
    name: "Cart",
    data() {
      return {
        n: 1,
      };
    },
    computed: {
      ...mapState('cart', ['list']),
      ...mapGetters('cart', ['listLength', 'selectedItemsCount', 'selectedItemsTotalPrice']),
      isAllSelected() {
        if (this.listLength > 0) {
          return this.listLength == this.selectedItemsCount;
        }
        return false;
      },

    },
    methods: {
      demo() {
        this.$refs.scroll.refresh();
      },
      scrollPosition() {

      },
      cartListCheckItems(val) {
        if (this.listLength > 0) {
          this.$store.dispatch('cart/checkAllItems', val);
        }
      },
    },
    activated() {
      console.log("cart activated");
      this.$refs.scroll.refresh();//避免卡死
    },
    deactivated() {
      console.log("cart deactivated");
    },
    components: {
      Scroll,
      HeadBar,
      CartList,
      CartCalculate,
    },
  };
</script>

<style scoped>
  #cart {
    height: calc(100% - 45px);
  }

  .headBar {
    color: white;
    background: var(--color-tint);
  }

  .wrapper {
    height: calc(100% - 84px);
  }
</style>
