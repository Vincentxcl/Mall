<template>
  <div class="cartCalculate">
    <div class="checkAll">
      <check-button :value="isAllSelected" @input="echoSelectAll"></check-button>
      全选
    </div>
    <div class="totalPrice">
      合计：{{priceFormat(totalPrice)}}
    </div>
    <div class="submit" @click="sumbit">
      去计算({{selectedCount}})
    </div>
  </div>
</template>

<script>
  import CheckButton from 'components/checkButton/CheckButton.vue';

  export default {
    name: 'CartCalculate',
    props: {
      totalPrice: {
        type: Number,
        default() {
          return 0;
        },
      },
      selectedCount: {
        type: Number,
        default() {
          return 0;
        },
      },
      isAllSelected: {
        type: Boolean,
        default() {
          return false;
        },
      },
    },
    methods: {
      echoSelectAll(val) {
        this.$emit("SelectAll", val);
      },
      priceFormat(price) {
        return "￥" + price.toFixed(2)
      },
      sumbit() { },
    },
    components: {
      CheckButton
    },
  }
</script>

<style scoped>
  .cartCalculate {
    display: flex;
    flex-flow: row;
    height: 40px;
    line-height: 40px;
    background-color: #eee;
    font-size: 14px;
  }

  .checkAll {
    display: flex;
    flex-flow: row;
    justify-content: space-around;
    align-items: center;
    width: 60px;
    margin-left: 10px;
  }

  .totalPrice {
    margin-left: 20px;
    flex: 1;
  }

  .submit {
    width: 100px;
    text-align: center;
    background-color: var(--color-tint);
  }
</style>
