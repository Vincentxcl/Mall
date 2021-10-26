<template>
  <div class="swiper-container" :style="{width:w+'px',height:height+'px'}" @mouseenter="enter()" @mouseleave="leave()">

    <div class="swiper-wrapper">
      <slot name="item"></slot>
    </div>

    <slot name="pageBtn">
      <page-btn @flip="btnFlip"></page-btn>
    </slot>

    <slot name="shortCut" :swiperItems="swiperItems">
      <short-cut-bar :currentIndex="currentSwiperItemsIndex">
        <short-cut-item v-for="(item,index) in swiperItems" :key="index" :index="index" @itemClick="sendCurrent">
        </short-cut-item>
      </short-cut-bar>
    </slot>

  </div>
</template>

<script>
  import PageBtn from '../common/PageBtn.vue';
  import { ShortCutBar, ShortCutItem } from '../shortCut';

  export default {
    name: 'Swiper',
    data() {
      return {
        swiperItems: [],
        handler: null,
      };
    },
    props: {
      width: {
        type: Number,
        default() {
          return -1;
        },
      },
      height: {
        type: Number,
        default() {
          return 195;
        }
      },
      autoRoll: {
        type: Boolean,
        default() {
          return true;
        }
      },
      interval: {
        type: Number,
        default() {
          return 3000;
        }
      },
      value: {
        type: String,
        default() {
          return '';
        },
      },
    },
    computed: {
      swiperItemsCount() {
        return this.swiperItems.length;
      },
      swiperItemsIndex() {
        return this.swiperItems.map(obj => obj.index);
      },
      currentSwiperItemsIndex() {
        return this.swiperItemsIndex.indexOf(this.value);
      },
    },
    methods: {
      enter() {
        clearInterval(this.handler);
        this.handler = null;
      },
      leave() {
        if (this.handler == null) {
          this.roll();
        }
      },
      callItem() {
        this.$children.forEach((value) => {
          value.callIndex = this.value;
        });
      },
      echoInput(val) {
        this.$emit("input", val);
      },
      roll() {
        this.handler = setInterval(() => {
          let currentIndex = this.swiperItemsIndex.indexOf(this.value);
          let nextIndex = (currentIndex + 1) % parseInt(this.swiperItemsCount);
          this.echoInput(this.swiperItemsIndex[nextIndex]);
        }, this.interval);
      },
      btnFlip(val) {
        let next;
        if (val > 0) {
          next = (this.currentSwiperItemsIndex + 1) % this.swiperItemsCount;
        }
        else {
          next = (this.currentSwiperItemsIndex + this.swiperItemsCount - 1) % this.swiperItemsCount;
        }
        this.echoInput(this.swiperItemsIndex[next]);
      },
      sendCurrent(val) {
        this.echoInput(this.swiperItemsIndex[val]);
      },
    },
    watch: {
      value() {
        this.callItem();
      },
    },
    created() {
      this.w = this.width < 0 ? document.body.clientWidth : this.width;
    },
    mounted() {
      this.swiperItems = this.$children.filter(obj => 'index' in obj);
      if (this.value == '') {
        this.echoInput(this.$children[0].index);
      }
      else {
        this.callItem();
      }
      if (this.autoRoll) {
        this.roll();
      }
    },
    components: {
      PageBtn,
      ShortCutBar,
      ShortCutItem,
    },
  };
</script>

<style scoped>
  .pageBtn {
    top: -100px;
  }

  .swiper-container {
    background: #f1f1f1;
    overflow: hidden;
  }

  .swiper-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;
    justify-content: center;
  }

  .shortCutBar {
    top: -20px;
  }
</style>
