<template>
  <div class="cartList">
    <ul>
      <li v-for="item in list" :key="item.id">
        <div class="ctrl">
          <check-button :value="item.isChecked" @input="echoCheck(item)"></check-button>
        </div>
        <div class="img">
          <img :src="item.imgSrc" alt="商品图片">
        </div>
        <div class="info">
          <div class="ttl">{{item.ttl}}</div>
          <div class="params">规格XX</div>
          <div class="bottom">
            <div class="price">{{priceFormat(item.presentPrice)}}</div>
            <number-button :value="item.count" :min="1" @input="adjustNum(item,$event)"></number-button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  import CheckButton from 'components/checkButton/CheckButton.vue';
  import NumberButton from 'components/numberButton/NumberButton.vue';

  export default {
    default: 'CartList',
    computed: {
      ...mapState('cart', ['list']),
    },
    methods: {
      echoCheck(val) {
        val.isChecked = !val.isChecked;
        this.$store.commit("cart/ReplaceItem", val);
      },
      priceFormat(price) {
        return "￥" + price.toFixed(2)
      },
      adjustNum(item, e) {
        if (e != null) {
          item.count = e;
          this.$store.commit('cart/ReplaceItem', item);
        }
      },
    },
    components: {
      CheckButton,
      NumberButton,
    },
  };
</script>

<style scoped>
  li {
    display: flex;
    flex-flow: row;
    align-items: center;
    width: 100%;
    display: flex;
    padding: 5px;
    border-bottom: 1px solid #ccc;
  }

  .ctrl {
    width: 9%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .img {
    overflow: hidden;
    width: 80px;
    height: 80px;
    border-radius: 5px;
  }

    .img img {
      width: 80px;
      height: auto;
    }

  .info {
    flex: 1;
    height: 80px;
    font-size: 17px;
    color: #333;
    overflow: hidden;
    padding-left: 10px;
  }

  .ttl, .params {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .params {
    font-size: 14px;
    color: #666;
    margin-top: 10px;
  }

  .bottom {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    margin-top: 10px;
    padding-right: 10px;
  }

  .price {
    color: orangered;
  }
</style>
