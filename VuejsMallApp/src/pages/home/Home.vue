<template>
  <section id="home">
    <head-bar>
      <p slot="middle">购物街</p>
    </head-bar>
    <back-top @click.native="backTopClick" v-show="isShowBackTop"></back-top>
    <tab-ctrl :list="goodsNameList" v-model="goodsObjIndex" v-show="showFixedTabCtrl" class="fixedTabCtrl"></tab-ctrl>
    <scroll ref="scroll" :probe-type="3" :pull-up-load="true" @position="scrollPosition" @pullingUp="scrollPullUp">
      <home-swiper :list="banners" @homeSwiperImgLoad="homeSwiperImgOnLoad"></home-swiper>
      <home-recommend-list :list="recommends"></home-recommend-list>
      <home-production></home-production>
      <tab-ctrl :list="goodsNameList" v-model="goodsObjIndex" ref="tabCtrl"></tab-ctrl>
      <goods-list :list="selectedGoodsList"></goods-list>
    </scroll>

  </section>
</template>

<script>
  import Scroll from 'components/scroll/scroll.vue';
  import HeadBar from 'components/headBar/Index.vue';
  import HomeSwiper from 'pages/home/parts/HomeSwiper.vue';
  import HomeRecommendList from 'pages/home/parts/HomeRecommendList.vue';
  import HomeProduction from 'pages/home/parts/HomeProduction.vue';
  import TabCtrl from 'components/tabCtrl/TabCtrl.vue';
  import GoodsList from 'components/goods/goodsList.vue';

  import { cpnBackTop } from 'common/mixins.js';
  import { debounce } from 'common/utils.js';

  import {
    requestBannersAndRecommendsData,
    //requestData,//使用Git来代替了
  } from 'netWork/home.js';
  import { requestData } from 'netWork/homeGit.js';

  export default {
    name: "Home",
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          pop: {
            name: '流行',
            pageIndex: 0,
            list: [],
            positionY: 0,
          },
          new: {
            name: '新款',
            pageIndex: 0,
            list: [],
            positionY: 0,
          },
          sell: {
            name: '精选',
            pageIndex: 0,
            list: [],
            positionY: 0,
          },
        },
        goodsObjIndex: 'pop',
        tabCtrlOffsetTop: 0,
        showFixedTabCtrl: false,
        saveY: 0,
        itemImgOnLoadListener: null,
      }
    },
    computed: {
      goodsNameList() {
        return Object.keys(this.goods).map(key => {
          return {
            index: key,
            name: this.goods[key].name,
          };
        });
      },
      selectedGoodsList() {
        return this.goods[this.goodsObjIndex].list;
      },
    },
    methods: {
      homeSwiperImgOnLoad() {
        this.tabCtrlOffsetTop = this.$refs.tabCtrl.$el.offsetTop;
      },
      scrollPosition(val) {
        this.showFixedTabCtrl = val.y <= -(this.tabCtrlOffsetTop - 44);
        this.isShowBackTop = val.y < -this.tabCtrlOffsetTop;
        this.goods[this.goodsObjIndex].positionY = this.showFixedTabCtrl ? val.y : 0;
      },
      scrollPullUp() {
        this.getData(this.goodsObjIndex);
      },
      getBannersAndRecommendsData() {
        requestBannersAndRecommendsData()
          .then(res => {
            this.banners = res.data.data.banner.list;
            this.recommends = res.data.data.recommend.list;
          })
          .catch(error => {
            console.log(error);
          });
      },
      //here-->>>>>>>>>>>>>>>>>>>>
      getData(type) {
        requestData(type, this.goods[type].pageIndex + 1)
          .then(res => {
            this.goods[type].list.push(...res.data.items);
            this.goods[type].pageIndex += 1;
            this.$refs.scroll.finishPullUp();
          })
          .catch(error => {
            console.log(error);
          });
      },
    },
    watch: {
      goodsObjIndex(current) {
        if (this.showFixedTabCtrl) {
          let y = this.goods[current].positionY == 0 ? -(this.tabCtrlOffsetTop - 44) : this.goods[current].positionY;
          this.$refs.scroll.scrollTo(0, y, 0);
        }
      },
    },
    created() {
      this.getBannersAndRecommendsData();
      this.getData('pop');
      this.getData('new');
      this.getData('sell');
    },
    mounted() {
      let debouncedRefresh = debounce(this.$refs.scroll.refresh);
      this.itemImgOnLoadListener = () => {
        if (this.$refs.scroll) {
          debouncedRefresh();
        }
      };
      this.$bus.$on("itemImgOnLoad", this.itemImgOnLoadListener);
    },
    beforeDestroy() {
      this.$bus.$off("itemImgOnLoad", this.itemImgOnLoadListener);
    },
    activated() {
      this.$refs.scroll.refresh();//避免卡死
      this.$refs.scroll.scrollTo(0, this.saveY, 0);
      this.$bus.$on("itemImgOnLoad", this.itemImgOnLoadListener);
    },
    deactivated() {
      this.saveY = this.$refs.scroll.y();
      this.$bus.$off("itemImgOnLoad", this.itemImgOnLoadListener);
    },
    components: {
      Scroll,
      HeadBar,
      HomeSwiper,
      HomeRecommendList,
      HomeProduction,
      TabCtrl,
      GoodsList,
    },
    mixins: [cpnBackTop],
  };
</script>

<style scoped>
  #home {
    width: 100%;
    height: calc(100% - 45px);
  }

  .headBar {
    background: var(--color-tint);
    color: #fff;
  }

  .wrapper {
    height: calc(100% - 45px);
  }

  .goodsList {
    margin-top: 10px;
  }

  .fixedTabCtrl {
    width: 100%;
    position: fixed;
    top: 44px;
    z-index: 100;
  }
</style>
