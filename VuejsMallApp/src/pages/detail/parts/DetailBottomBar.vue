<template>
  <div class="detailBottomBar">
    <div class="bar bar-left">
      <div>
        <i class="img service"></i>
        <span>客服</span>
      </div>
      <div>
        <i class="img shop"></i>
        <span>店铺</span>
      </div>
      <div>
        <i class="img star"></i>
        <span>收藏</span>
      </div>
    </div>
    <div class="bar bar-right">
      <div class="cart" @click="addToCart">加入购物车</div>
      <div class="buy">购买</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DetailBottomBar',
    methods: {
      addToCart() {
        this.$emit('addCart')
      }
    }
  }
</script>

<style>
  .detailBottomBar {
    background: #fff;
    height: 45px;
    display: flex;
    text-align: center;
  }

  .bar {
    flex: 1;
    display: flex;
  }

    .bar div {
      flex: 1;
    }

  .bar-left span {
    font-size: 12px;
  }

  .bar-left .img {
    display: block;
    width: 22px;
    height: 22px;
    margin: 5px auto -2px;
    background: url('~assets/img/detailBottomBar/detail_bottom.png') 0 0 / 100%; /* 设置完背景后，再用background-position 展示具体的背景图片 */
  }

  .bar-left .service {
    background-position: 0 -54px;
  }

  .bar-left .shop {
    background-position: 0 -98px;
  }

  .bar-right {
    font-size: 14px;
    color: #fff;
    line-height: 45px;
  }

  .cart {
    height: 45px;
    background-color: #ffe817;
    color: #333;
  }

  .buy {
    height: 45px;
    background-color:var(--color-tint);
  }
</style>
