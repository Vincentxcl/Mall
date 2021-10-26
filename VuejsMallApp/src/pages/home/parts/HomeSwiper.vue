<template>
  <swiper-container :key="list.length" :showNavigation="false" :autoplay="true">
    <swiper-slide v-for="(item) in list" :key="item.acm">
      <a :href="item.link">
        <img :src="item.image" @load="homeSwiperImgLoad" />
      </a>
    </swiper-slide>
  </swiper-container>
</template>

<script>
  import { SwiperContainer, SwiperSlide } from 'components/album/swiper';

  export default {
    name: 'HomeSwiper',
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
      homeSwiperImgLoad() {
        if (!this.isImgLoad) {
          this.$emit("homeSwiperImgLoad");
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
    width: 100%;
    height: 195px;
  }

  .swiper-slide {
    width: 100%;
    height: auto;
  }

    .swiper-slide a, .swiper-slide img {
      display: block;
      width: 100%;
      height: auto;
    }
</style>
