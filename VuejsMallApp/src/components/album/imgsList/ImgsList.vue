<template>
  <div class="imgsList" v-if="list.length!=0">
    <slot name="head"></slot>
    <ul>
      <li v-for="(item,index) in list" :key="index">
        <img :src="item" alt="pic" @load="imgLoad" />
      </li>
    </ul>
    <slot name="foot"></slot>
  </div>
</template>

<script>
  import { adjustImgWH } from 'common/utils.js';

  export default {
    name: 'ImgsList',
    data() {
      return {
        bodyWidth: 0,
      };
    },
    props: {
      list: {
        type: Array,
        default() {
          return [];
        },
      },
      itemWidth: {
        type: Number,
        default() {
          return -1;
        },
      },
    },
    computed: {
      adjustW() {
        return this.itemWidth > 0 ? this.itemWidth : this.bodyWidth;
      },
    },
    methods: {
      imgLoad(event) {
        //1.发射加载完成事件
        this.$bus.$emit('imgsListPicLoad');
        //2.调整图片尺寸
        if (event.target.width > this.bodyWidth) {
          adjustImgWH(event.target, this.adjustW, this.adjustW);
        }
      },
    },
    created() {
      this.bodyWidth = document.body.clientWidth;
    },
  };
</script>
