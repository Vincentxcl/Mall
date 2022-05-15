<template>
  <div class="grid">
    <el-table ref="table" :data="objects" border :stripe="true" style="width: 100%" height="100%" :header-row-style="headerRowStyle" :header-cell-style="headerCellStyle">
      <!-- selection column -->
      <el-table-column type="selection" width="50" fixed="left" align="center"> </el-table-column>
      <!-- ctrls -->
      <el-table-column fixed="left" label="操作" width="100" align="center">
        <template slot-scope="item">
          <icon icon="icon-bianji" title="编辑" @click.native="editClick(item.row)"></icon>
          <icon icon="icon-shanchu" title="删除" @click.native="delClick(item.row)"></icon>
        </template>
      </el-table-column>
      <!-- content -->
      <el-table-column v-for="item in redefinedColumns" :key="item.field" :prop="item.field" :label="item.alias" :width="item.width" :align="item.align" :show-overflow-tooltip="true"></el-table-column>
      <slot></slot>
    </el-table>
  </div>
</template>

<script>
import Icon from 'components/widgets/icon.vue';

export default {
  name: 'Grid',
  props: {
    columns: {
      type: Array,
      require: true,
      default() {
        return [
          {
            field: 'email',
            alias: '邮箱',
            width: 100,
            align: 'center'
          }
        ];
      }
    },
    objects: {
      type: Array,
      require: true,
      default() {
        return [];
      }
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
  computed: {
    redefinedColumns() {
      return this.columns.map(function (o) {
        return {
          field: o.field,
          alias: o.alias,
          width: o.width ? o.width : {},
          align: o.align ? o.align : 'center'
        };
      });
    }
  },
  methods: {
    editClick(val) {
      this.$emit('editClick', val);
    },
    delClick(val) {
      this.$emit('delClick', val);
    }
  },
  components: {
    Icon
  }
};
</script>

<style scoped>
div.cell i {
  padding: 0px 3px;
  cursor: pointer;
}
</style>
