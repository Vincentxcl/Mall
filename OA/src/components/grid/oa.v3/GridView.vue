<template>
  <div class="gridView">
    <el-table ref="table" :data="gridData" :border="border" :stripe="stripe" style="width: 100%" height="100%" :header-row-style="headerRowStyle" :header-cell-style="headerCellStyle" @selection-change="echoSelectionChange">
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
    }
  },
  methods: {
    echoSelectionChange(e) {
      this.$emit('selection-change', e);
    }
  }
};
</script>
