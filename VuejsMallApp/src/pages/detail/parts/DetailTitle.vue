<template>
  <div class="detailTitle" v-if="Object.keys(item).length!=0">
    <div class="ttl">
      <strong>{{item.ttl}}</strong>
    </div>
    <div class="price">
      <div>￥{{item.presentPrice}}</div>
      <div>￥{{item.originalPrice}}</div>
      <div :style="{background:item.label.color}">{{item.label.ttl}}</div>
    </div>
    <div class="state">
      <div>销量 {{item.sales}}</div>
      <div>收藏 {{item.favor}}人</div>
      <div>{{item.deliveryTime}}小时发货</div>
    </div>
    <div class="service">
      <div v-for="(s,index) in item.services" :key="index">
        <span class="iconfont icon-a-">{{s}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DetailTitle',
    props: {
      item: {
        type: Object,
        default() {
          return {};
        },
      },
    },
  };
</script>

<style scoped>
  @import '~assets/css/detailTitle/iconfont.css';

  .detailTitle {
    padding: 10px 5px 0px 5px;
  }

  strong {
    font-family: 'Microsoft YaHei';
    font-size: 18px;
    font-weight: 500;
    color: #535353;
  }

  .price {
    display: flex;
    flex-flow: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: 5px;
  }

    .price div:nth-child(1) {
      font-weight: 500;
      font-size: 24px;
      color: var(--color-tint);
    }

    .price div:nth-child(2) {
      font-size: 14px;
      color: #bdbdbd;
      text-decoration: line-through;
      padding: 0px 10px;
    }

    .price div:nth-child(3) {
      font-size: 14px;
      line-height: 18px;
      border-radius: 7px;
      height: 18px;
      padding: 0px 4px;
      color: white;
    }

  .state {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    font-size: 14px;
    color: #bdbdbd;
    margin-top: 10px;
    padding-bottom: 5px;
    border-bottom: 2px solid #eeeeee;
  }

  .service {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    margin-top: 15px;
    padding-bottom: 15px;
    border-bottom: 2px solid #eeeeee;
  }

    .service span {
      font-size: 14px;
      color: var(--color-text);
    }
</style>
