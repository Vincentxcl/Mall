<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <slot></slot>
    </div>
    <!-- Add Pagination -->
    <div v-if="showPagination" class="swiper-pagination"></div>
    <!-- Add Arrows -->
    <div v-if="showNavigation" class="swiper-button-next"></div>
    <div v-if="showNavigation" class="swiper-button-prev"></div>
  </div>
</template>

<script>
  import Swiper from 'swiper/dist/js/swiper.js';//swiper@4.5.1

  export default {
    name: 'SwiperContainer',
    props: {
      initialSlide: {
        type: Number,
        default() {
          return 0;
        },
      },
      direction: {
        type: String,
        default() {
          let arr = ['horizontal', 'vertical'];
          return arr[0];
        },
      },
      speed: {
        type: Number,
        default() {
          return 300;
        },
      },
      slidesPerView: {
        type: Number,
        default() {
          return 1;
        },
      },
      spaceBetween: {
        type: Number,
        default() {
          return 0;
        },
      },
      loop: {
        type: Boolean,
        default() {
          return true;
        },
      },
      longSwipesRatio: {
        type: Number,
        default() {
          return 0.4;
        },
      },
      autoplay: {
        type: Boolean,
        default() {
          return false;
        },
      },
      delay: {
        type: Number,
        default() {
          return 3000;
        },
      },
      effect: {
        type: String,
        default() {
          let arr = [null, 'fade', 'cube', 'coverflow', 'flip'];
          return arr[0];
        },
      },
      showPagination: {
        type: Boolean,
        default() {
          return true;
        },
      },
      showNavigation: {
        type: Boolean,
        default() {
          return true;
        },
      },
    },
    computed: {
      autoPlayProps() {
        if (this.autoplay) {
          return {
            delay: this.delay,
          };
        }
        else {
          return false;
        }
      },
    },
    methods: {
      initSwiper() {
        let mySwiper = new Swiper('.swiper-container', {
          initialSlide: this.initialSlide,
          direction: this.direction,
          speed: this.speed,
          slidesPerView: this.slidesPerView,
          spaceBetween: this.spaceBetween,
          loop: this.loop,
          longSwipesRatio: this.longSwipesRatio,
          autoplay: this.autoPlayProps,
          effect: this.effect,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        });
        mySwiper.el.onmouseover = function () {
          mySwiper.autoplay.stop();
        }
        mySwiper.el.onmouseout = function () {
          mySwiper.autoplay.start();
        }
      },
    },
    mounted() {
      this.initSwiper();
    },
  };
</script>

<style scoped>
  @import '~swiper/dist/css/swiper.css';
</style>
