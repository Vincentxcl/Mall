<template>
  <div class="gridView">
    <el-table ref="table" :data="gridData" :border="border" :stripe="stripe" :style="tableStyle" height="100%" :header-row-style="headerRowStyle" :header-cell-style="headerCellStyle" :row-style="rowStyle" :cell-style="cellStyle" @selection-change="echoSelectionChange" @sort-change="echoSortChange">
      <slot></slot>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'GridView',
  data() {
    return {
      scrollTop: null //定义新变量-当前表格高度
    };
  },
  props: {
    gridData: {
      type: Array,
      default() {
        return [];
      }
    },
    border: {
      type: Boolean,
      default: () => true
    },
    tableStyle: {
      type: Object,
      default() {
        return {
          width: '100%',
          fontSize: 'var(--font-size)'
        };
      }
    },
    stripe: {
      type: Boolean,
      default: () => true
    },
    headerRowStyle: {
      type: Object,
      default() {
        return {
          color: 'var(--color-text)'
        };
      }
    },
    headerCellStyle: {
      type: Object,
      default() {
        return {
          background: '#f2fdff'
        };
      }
    },
    rowStyle: {
      type: Object,
      default() {
        return {
          height: '0' //最小行高
        };
      }
    },
    cellStyle: {
      type: Object,
      default() {
        return {
          // 调整单元格行高
          paddingTop: '9px',
          paddingBottom: '9px'
        };
      }
    }
  },
  methods: {
    echoSelectionChange(e) {
      this.$emit('selection-change', e);
    },
    echoSortChange(e) {
      this.$emit('sort-change', e);
    },
    resetScroll() {
      //重置滚动条位置
      this.$nextTick(() => {
        setTimeout(() => {
          let scrollTop = this.$el.querySelector('.el-table__body-wrapper');
          scrollTop.scrollTop = 0;
        }, 13);
      });
    }
  },
  mounted() {
    // 监听滚动条的位置
    this.$refs.table.bodyWrapper.addEventListener(
      'scroll',
      (res) => {
        let height = res.target;
        this.scrollTop = height.scrollTop;
      },
      false
    );
  },
  activated() {
    // 这里如果直接赋值给this.$el.querySelector('.el-table__body-wrapper').scrollTop会失效，需要加上setTimeout才行。
    this.$nextTick(() => {
      setTimeout(() => {
        let scrollTop = this.$el.querySelector('.el-table__body-wrapper');
        scrollTop.scrollTop = this.scrollTop;
      }, 13);
    });
  },
  beforeDestroy() {
    this.$refs.table.bodyWrapper.removeEventListener(
      'scroll',
      (res) => {
        let height = res.target;
        this.scrollTop = height.scrollTop;
      },
      false
    );
  }
};
</script>
