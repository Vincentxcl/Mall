<template>
  <div class="row clr">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Row',
  props: {
    gutter: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  methods: {
    setChildrenPadding() {
      if (this.gutter > 0 && this.$children.length > 0) {
        let columns = this.$children.filter((n) => n.isShow == true);

        if (columns.length > 1) {
          // gutter的总个数
          let gCount = columns.length - 1;
          // 每个column消费的padding
          let padding = (gCount * this.gutter) / columns.length;

          for (let i = 0; i < columns.length; i++) {
            //恢复默认值
            columns[i].paddingRight = 0;
            columns[i].paddingLeft = 0;
            //set
            if (i == 0) {
              columns[0].paddingRight = padding;
            } else if (i == columns.length - 1) {
              columns[columns.length - 1].paddingLeft = padding;
            } else {
              columns[i].paddingLeft = padding / 2;
              columns[i].paddingRight = padding / 2;
            }
          }
        }
      }
    },
    setChildrenWindowWidth() {
      let width = window.innerWidth;
      for (let item of this.$children) {
        item.windowWidth = width;
      }
    }
  },
  mounted() {
    this.setChildrenWindowWidth();
    this.setChildrenPadding();

    window.addEventListener(
      'resize',
      () => {
        this.setChildrenWindowWidth();
        this.setChildrenPadding();
      },
      false
    );
  }
};
</script>
