<template>
  <div class="detailShop" v-if="Object.keys(item).length!=0">
    <div class="logo">
      <img :src="item.logo" alt="" />
      <p>{{item.name}}</p>
    </div>
    <div class="info">
      <div class="record">
        <div v-for="(r,index) in item.record" :key="index">
          <p>{{r.num}}</p>
          <p>{{r.ttl}}</p>
        </div>
      </div>
      <div class="status">
        <div v-for="(s,index) in item.status" :key="index">
          <span>{{s.ttl}}</span>
          <span :class="color(s.isBetter)">{{s.num}}</span>
          <span :class="mark(s.isBetter)" class="iconfont"></span>
        </div>
      </div>
    </div>
    <div class="link">
      <a :href="item.link">进店逛逛</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DetailShop',
    props: {
      item: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    methods: {
      mark(val) {
        switch (val) {
          case (1): {
            return { 'icon-jiantou_xiangshang': true };
          }; break;
          case (0): {
            return { 'icon-hengxian': true };
          }; break;
          default: {
            return { 'icon-jiantou_xiangxia': true }
          }; break;
        }
      },
      color(val) {
        switch (val) {
          case (-1): {
            return { 'red': true };
          }; break;
          default: {
            return { 'green': true }
          }; break;
        }
      },
    },
  };
</script>

<style scoped>
  @import '~assets/css/detailShop/iconfont.css';

  /*#region tff*/
  .icon-jiantou_xiangshang, .icon-hengxian, .green {
    color: green;
  }

  .icon-jiantou_xiangxia, .red {
    color: red;
  }
  /*#endregion*/

  .detailShop {
    padding: 0px 5px;
    border-bottom: 2px solid #eeeeee;
  }

  .logo {
    display: flex;
    flex-flow: row;
    align-items: center;
    margin: 20px 0px;
  }

    .logo img {
      width: 50px;
      height: 50px;
      border-radius: 100%;
      overflow: hidden;
    }

    .logo p {
      font-size: 16px;
      color: #8d8d8d;
      margin: 0px 10px;
    }

  .info {
    display: flex;
    flex-flow: row;
    margin-top: 15px;
  }

  .record {
    display: flex;
    flex-flow: row;
    flex: 1;
    color: var(--color-text);
    border-right: 1px solid #d4d4d4;
  }

    .record div {
      flex: 1;
      text-align: center;
    }

      .record div p {
        padding: 5px 0px;
      }

        .record div p:nth-child(1) {
          font-weight: 500;
          font-size: 22px;
        }

        .record div p:nth-child(2) {
          font-size: 13px;
        }

  .status {
    flex: 1;
    color: var(--color-text);
  }

    .status div {
      padding: 5px 10px;
      text-align: center;
    }

      .status div span {
        display: inline-block;
        font-size: 13px;
      }

        .status div span:nth-child(2) {
          width: 50px;
          text-align: center;
        }

  .link {
    margin: 10px 0px 20px 0px;
  }

    .link a {
      display: block;
      width: 100px;
      height: 30px;
      line-height: 30px;
      font-size: 16px;
      color: var(--color-tint);
      text-align: center;
      border-radius: 4px;
      background: #e9e9e9;
      margin: 0px auto;
    }
</style>
