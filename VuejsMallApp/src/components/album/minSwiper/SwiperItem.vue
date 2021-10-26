<template>
  <transition :name="appearance">
    <div class="swiper-slide" v-show="isShow">
      <slot></slot>
    </div>
  </transition>
</template>
<script>
  export default {
    name: 'SwiperItem',
    data() {
      return {
        callIndex: '',
      };
    },
    props: {
      index: {
        type: String,
        required: true,
      },
      appearance: {
        type: String,
        default() {
          let d = ["left", "right", "twinkle"];
          return d[2];
        },
      },
    },
    computed: {
      isShow() {
        return (this.index === this.callIndex);
      },
    },

  };
</script>

<style scoped>
  .swiper-slide {
    position: absolute;
    width: 100%;
    height: auto;
  }

  /*#region 左右滑动*/
  .right-enter {
    transform: translateX(100%);
  }

  .right-enter-active, .right-leave-active {
    transition: all 1s linear;
  }

  .right-enter-to {
    transform: translateX(0);
  }

  .right-leave {
    transform: translateX(0);
  }

  .right-leave-to {
    transform: translateX(-100%);
  }


  .left-enter {
    transform: translateX(-100%);
  }

  .left-enter-active, .left-leave-active {
    transition: all 1s linear;
  }

  .left-enter-to {
    transform: translateX(0);
  }

  .left-leave {
    transform: translateX(0);
  }

  .left-leave-to {
    transform: translateX(100%);
  }
  /*#endregion*/

  /*#region 淡入淡出*/
  .twinkle-enter, .twinkle-leave-to {
    opacity: 0.1;
  }

  .twinkle-enter-active, .right-leave-active {
    transition: all 1s linear;
  }

  .twinkle-enter-to, .twinkle-leave {
    opacity: 1;
  }
  /*#endregion*/
</style>
