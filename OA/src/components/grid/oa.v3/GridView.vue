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
    }
  }
};
</script>
