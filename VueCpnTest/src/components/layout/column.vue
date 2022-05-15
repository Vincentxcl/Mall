<template>
  <div class="column fl" v-show="isShow" :style="columnStyle">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Column',
  data() {
    return {
      windowWidth: 0,
      ratio: -1,
      isShow: true,
      paddingLeft: 0,
      paddingRight: 0
    };
  },
  props: {
    span: {
      type: Number
    },
    xs: {
      // <768px 响应式栅格数或者栅格属性对象
      type: Number
    },
    sm: {
      // ≥768px 响应式栅格数或者栅格属性对象
      type: Number
    },
    md: {
      // ≥992px 响应式栅格数或者栅格属性对象
      type: Number
    },
    lg: {
      // ≥1200px 响应式栅格数或者栅格属性对象
      type: Number
    },
    xl: {
      // ≥1920px 响应式栅格数或者栅格属性对象
      type: Number
    }
  },
  computed: {
    columnStyle() {
      let style = {};
      if (this.paddingLeft != 0) {
        style['padding-left'] = this.paddingLeft + 'px';
      }
      if (this.paddingRight != 0) {
        style['padding-right'] = this.paddingRight + 'px';
      }

      if (this.ratio > 0 && this.ratio <= 24) {
        style.width = (this.ratio * 100) / 24 + '%';
      }
      return style;
    }
  },
  methods: {
    setRadio(width) {
      if (width > 1920 && this.xl != undefined) {
        this.ratio = this.xl;
      } else if (width >= 1200 && width <= 1920 && this.lg != undefined) {
        this.ratio = this.lg;
      } else if (width >= 992 && width <= 1200 && this.md != undefined) {
        this.ratio = this.md;
      } else if (width >= 768 && width <= 992 && this.sm != undefined) {
        this.ratio = this.sm;
      } else if (width < 768 && this.xs != undefined) {
        this.ratio = this.xs;
      }
    },
    setIsShow(val) {
      if (val == 0) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    }
  },
  watch: {
    windowWidth(cur) {
      this.setRadio(cur);
    },
    ratio(cur) {
      this.setIsShow(cur);
    }
  },
  created() {
    if (this.span != undefined) {
      this.ratio = this.span;
    }
  },
  mounted() {
    if (this.span == undefined && (this.xs != undefined || this.sm != undefined || this.md != undefined || this.lg != undefined || this.xl != undefined)) {
      // 初始化
      this.setRadio(window.innerWidth);
      this.setIsShow(this.ratio);
    }
  }
};
</script>

