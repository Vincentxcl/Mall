<template>
  <el-table-column v-if="type != 'selection'" ref="column" :type="type" :label="label" :prop="prop" :width="width" :fixed="fixed" :align="align" :show-overflow-tooltip="showOverflowTooltip">
    <template slot-scope="scope">
      <slot v-if="type == undefined" :scope="scope">{{ scope.row[ttl] }}</slot>
      <slot v-else-if="type == 'index'" :scope="scope">{{ scope.$index + 1 }}</slot>
    </template>
  </el-table-column>
  <el-table-column v-else ref="column" type="selection" :label="label" :prop="prop" :width="width" :fixed="fixed" :align="align" show-overflow-tooltip></el-table-column>
</template>

<script>
export default {
  name: 'GridField',
  data() {
    return {
      ttl: undefined
    };
  },
  props: {
    type: {
      type: String,
      default() {
        return undefined;
      }
    },
    label: {
      type: String,
      default() {
        return undefined;
      }
    },
    prop: {
      type: String,
      default() {
        return undefined;
      }
    },
    width: {
      type: String,
      default() {
        return undefined;
      }
    },
    fixed: {
      type: String,
      default() {
        return undefined;
      }
    },
    align: {
      type: String,
      default() {
        return undefined;
      }
    },
    showOverflowTooltip: {
      type: Boolean,
      default: () => true
    }
  },
  mounted() {
    this.ttl = this.$refs.column.prop;
  }
};
</script>
