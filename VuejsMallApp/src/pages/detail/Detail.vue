<template>
  <section id="detail">
    <detail-head-bar v-model="detailTypeIndex" :list="list" @input="scrollTo"></detail-head-bar>
    <back-top @click.native="backTopClick" v-show="showBackTop"></back-top>
    <scroll ref="scroll" :probe-type="3" @position="scrollPosition">
      <detail-swiper :list="images" @detailSwiperImgLoad="detailSwiperImgOnLoad"></detail-swiper>
      <detail-title :item="detailTitle"></detail-title>
      <detail-shop :item="detailShop"></detail-shop>
      <detail-imgs-list ref="imgsList" :list="detailImgs"></detail-imgs-list>
      <detail-params ref="params"></detail-params>
      <detail-comment ref="comment"></detail-comment>
      <detail-recommendation ref="recommendation"></detail-recommendation>
    </scroll>
    <detail-bottom-bar @addCart="addCart"></detail-bottom-bar>
  </section>
</template>

<script>
  import Scroll from 'components/scroll/scroll.vue';
  import DetailHeadBar from './parts/DetailHeadBar.vue';
  import DetailSwiper from './parts/DetailSwiper.vue';
  import DetailTitle from './parts/DetailTitle.vue';
  import DetailShop from './parts/DetailShop.vue';
  import DetailImgsList from './parts/DetailImgsList.vue';
  import DetailParams from './parts/DetailParams.vue';
  import DetailComment from './parts/DetailComment.vue';
  import DetailRecommendation from './parts/DetailRecommendation.vue';
  import DetailBottomBar from './parts/DetailBottomBar.vue';

  import * as detailGit from 'netWork/detailGit.js';
  import * as homeGit from 'netWork/homeGit.js';

  import { cpnBackTop } from 'common/mixins.js';
  import { debounce } from 'common/utils.js';

  export default {
    name: 'Detail',
    data() {
      return {
        detailTypeIndex: '0',
        list: [
          { index: '0', ttl: '商品', scrollY: 0 },
          { index: '1', ttl: '参数', scrollY: 0 },
          { index: '2', ttl: '评论', scrollY: 0 },
          { index: '3', ttl: '推荐', scrollY: 0 },
        ],
        images: [],
        detailItemInfo: {},
        detailTitle: {},
        detailShop: {},
        detailImgs: [],
        imgsListPicLoadListener: null,
        imgsListOffsetTop: 0,
        debouncedSetDetailTypeIndex: null,
      };
    },
    props: {
      login: {
        type: String,
      },
    },
    methods: {
      scrollTo(val) {
        let y = this.list.filter(obj => obj.index == val)[0].scrollY;
        this.$refs.scroll.scrollTo(0, -y, 0);
      },
      getInfoById(val) {
        detailGit.requestData(val)
          .then(res => {
            //console.log(res);
            this.detailItemInfo = new detailGit.detailItemDTO(res.data);
            this.images.push(res.data.avatar_url);
            this.detailTitle = new detailGit.detailTitleDTO(res.data);
            this.detailShop = new detailGit.detailShopDTO(res.data);
          })
          .catch(error => {
            console.log(error);
          });
      },
      searchUsers(val) {
        homeGit.requestData(val, 1)
          .then(res => {
            let imgs = res.data.items.map(obj => obj.avatar_url);
            this.detailImgs.push(...imgs);
          })
          .catch(error => {
            console.log(error);
          });
      },
      detailSwiperImgOnLoad() {
        this.imgsListOffsetTop = this.$refs.imgsList.$el.offsetTop - 44;
      },
      scrollPosition(val) {
        this.showBackTop = val.y < -this.imgsListOffsetTop;
        this.debouncedSetDetailTypeIndex(val);
      },
      setPostion() {
        this.list[1].scrollY = this.$refs.params ? this.$refs.params.$el.offsetTop - 44 : 0;
        this.list[2].scrollY = this.$refs.comment ? this.$refs.comment.$el.offsetTop - 44 : 0;
        this.list[3].scrollY = this.$refs.recommendation ? this.$refs.recommendation.$el.offsetTop - 44 : 0;
      },
      addCart() {
        this.detailItemInfo.isChecked = true;
        this.$store.dispatch("cart/toList", this.detailItemInfo).then((val) => {
          this.$toast.txtColor = "#444";
          this.$toast.width = 150;
          this.$toast.show(val);
        });
      },
    },
    created() {
      this.getInfoById(this.login);
      this.searchUsers(this.login.substr(0, 3));
      this.debouncedSetDetailTypeIndex = debounce((val) => {
        let l = this.list.length
        for (var i = l; i > 0; i--) {
          if (-val.y >= this.list[i - 1].scrollY) {
            if (this.detailTypeIndex != this.list[i - 1].index) {
              this.detailTypeIndex = this.list[i - 1].index;
            }
            break;
          }
        }
      }, 300);
    },
    mounted() {
      let debouncedRefresh = debounce(this.$refs.scroll.refresh);
      let debouncedSetPosition = debounce(this.setPostion);
      this.imgsListPicLoadListener = () => {
        if (this.$refs.scroll) {
          debouncedRefresh();
        }
        debouncedSetPosition();
      };
      this.$bus.$on("imgsListPicLoad", this.imgsListPicLoadListener);
    },
    beforeDestroy() {
      this.$bus.$off("imgsListPicLoad", this.imgsListPicLoadListener);
    },
    components: {
      Scroll,
      DetailHeadBar,
      DetailSwiper,
      DetailTitle,
      DetailShop,
      DetailImgsList,
      DetailParams,
      DetailComment,
      DetailRecommendation,
      DetailBottomBar,
    },
    mixins: [cpnBackTop],
  };
</script>

<style scoped>
  #detail {
    height: 100vh;
  }

  .wrapper {
    height: calc(100% - 89px);
  }
</style>
