<template>
  <swiper-container v-if="list.length!=0" :showNavigation="false">
    <swiper-slide v-for="(item,index) in list" :key="index">
      <img :src="item" alt="pic" @load="detailSwiperImgLoad" />
    </swiper-slide>
  </swiper-container>
</template>

<script>
  import { SwiperContainer, SwiperSlide } from 'components/album/swiper';

  export default {
    name: 'DetailSwiper',
    data() {
      return {
        isImgLoad: false,
      };
    },
    props: {
      list: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    methods: {
      detailSwiperImgLoad() {
        if (!this.isImgLoad) {
          this.$emit("detailSwiperImgLoad");
          this.isImgLoad = true;
        }
      },

    },
    components: {
      SwiperContainer,
      SwiperSlide,
    },
  };
</script>

<style scoped>
  .swiper-container {
    height: 300px;
  }

  img {
    width: 100%;
    height: auto;
  }
</style>
