<template>
  <div class="actionList">
    <grid-view ref="gridview" :gridData="dataList" @selection-change="setSysParamsSelection" @sort-change="setSortChange">
      <!-- selection column -->
      <grid-field v-if="showSelection" type="selection" width="50" fixed="left" align="center"> </grid-field>
      <!-- ctrls -->
      <grid-field v-if="showDetail||showEdit || showDel" fixed="left" label="操作" width="100" align="center">
        <template slot-scope="item">
          <icon v-if="showDetail" :icon="iconDetail" title="明细" @click.native="getDetail(item.scope.row)"></icon>
          <icon v-if="showEdit" :icon="iconEdit" title="编辑" @click.native="editItem(item.scope.row)"></icon>
          <icon v-if="showDel" :icon="iconDel" title="删除" @click.native="deleteItem(item.scope.row)"></icon>
        </template>
      </grid-field>
      <grid-field v-if="showAllRole" label="配置" width="70" align="center">
        <template slot-scope="item">
          <span class="btn" title="配置角色" @click="editActionRoles(item.scope.row)">角色</span>
        </template>
      </grid-field>
      <!-- content -->
      <grid-field v-for="item in headItem" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sort" :show-overflow-tooltip="true"></grid-field>
      <!-- state -->
      <grid-field v-if="showEdit" label="状态" width="65" align="center">
        <template slot-scope="item">
          <icon v-show="item.scope.row.isEnable" :icon="iconEnable" title="启用中" @click.native="setEnable(item.scope.row)"></icon>
          <icon v-show="!item.scope.row.isEnable" :icon="iconDisable" title="禁用中" @click.native="setEnable(item.scope.row)"></icon>
        </template>
      </grid-field>
    </grid-view>

    <div class="bottomBar">
      <pagination v-model="index" :pageCount="pageCount"></pagination>
      <div class="total">总数据:&nbsp;{{ totalCount }}&nbsp;条</div>
    </div>
  </div>
</template>

<script>
import Icon from 'components/widgets/icon.vue';
import GridView from 'components/grid/oa.v3/GridView.vue';
import GridField from 'components/grid/oa.v3/GridField.vue';
import Pagination from 'components/pagination/v2/Pagination.vue';
import { computedIcons } from 'common/mixins/computedIcons.js';
import { method_detail_edit } from './mixins/method_detail_edit';
import { computed_show } from './mixins/computed_show.js';

import { patchObj, deleteObj } from 'netWork/action.js';

export default {
  name: 'ActionList',
  mixins: [computedIcons, method_detail_edit, computed_show],
  data() {
    return {
      index: 0, //页码
      headItem: [
        {
          prop: 'name',
          label: '名称',
          width: '150',
          align: 'left',
          sort: 'custom'
        },
        {
          prop: 'controllerTtl',
          label: 'Controller',
          width: '180',
          align: 'left',
          sort: 'custom'
        },
        {
          prop: 'actionTtl',
          label: 'Action',
          width: '200',
          align: 'left'
        },
        {
          prop: 'httpMethod',
          label: '请求方式',
          width: '90',
          align: 'left'
        },
        {
          prop: 'description',
          label: '描述',
          align: 'left'
        },
        {
          prop: 'ord',
          label: '排序',
          width: '65',
          align: 'center',
          fixed: 'right',
          sort: 'custom'
        }
      ]
    };
  },
  computed: {
    pageIndex() {
      return this.$store.getters['action/pageIndex'];
    },
    totalCount() {
      return this.$store.getters['action/totalCount'];
    },
    pageCount() {
      return this.$store.getters['action/pageCount'];
    },
    dataList() {
      return this.$store.getters['action/dataList'];
    }
  },
  methods: {
    //将选中项目提交至store
    setSysParamsSelection(e) {
      this.$store.commit('action/SetSelection', e);
    },
    deleteItem(e) {
      this.$confirm({
        type: 'warning',
        content: '是否删除 ' + e.name + ' ?',
        confirmTxt: '确认',
        cancelTxt: '取消'
      })
        .then(() => {
          deleteObj(e.id, this).then(() => {
            this.$store.dispatch('action/getDataList', this.pageIndex + 1); //刷新当前页
            this.$toast.show({ type: 'success', text: '删除成功' });
          });
        })
        .catch(() => {});
    },
    setSortChange(e) {
      this.$store.dispatch('action/setOrderBy', e);
      this.$store.dispatch('action/getDataList', this.index + 1);
    },
    setEnable(e) {
      let word = !e.isEnable ? '启用' : '禁用';
      this.$confirm({
        type: 'warning',
        content: '是否' + word + ' "' + e.name + '" ?',
        confirmTxt: '确认',
        cancelTxt: '取消'
      })
        .then(() => {
          //提交修改
          let operations = [
            {
              path: '/isEnable',
              op: 'replace',
              value: !e.isEnable
            }
          ];
          patchObj(e.id, operations, this).then(() => {
            this.$store.dispatch('action/getDataList', this.pageIndex + 1); //刷新当前页
            this.$toast.show({ type: 'success', text: '修改成功' });
          });
        })
        .catch(() => {});
    }
  },
  created() {
    this.$store.dispatch('action/getDataList', 1); //创建该组件时，默认获取首页
  },
  watch: {
    pageIndex: {
      handler(current) {
        this.$refs.gridview.resetScroll(); //翻页后重置滚动条位置
        if (this.index != current) {
          this.index = current; //一定要判断一下，避免响应式重复执行getDataList，通知pagination
        }
      }
    },
    index: {
      handler(current) {
        this.$store.dispatch('action/getDataList', current + 1);
      }
    }
  },
  components: {
    Icon,
    GridView,
    GridField,
    Pagination
  }
};
</script>

<style>
.actionList {
  width: 100%;
  height: calc(100% - 40px);
}

.actionList .gridView {
  height: calc(100% - 25px);
}

.actionList .gridView tbody div.cell i {
  padding: 0px 3px;
}

.actionList .gridView tbody div.cell i.icon-qiyong {
  color: var(--color-success);
}

.actionList .gridView tbody div.cell i.icon-jinyong {
  color: var(--color-danger);
}

.actionList .gridView tbody div.cell i:hover {
  color: var(--color-high-text);
  cursor: pointer;
}

.actionList .bottomBar {
  display: flex;
  width: 100%;
  height: 25px;
  justify-content: space-between;
  background: #ebebeb;
}

.actionList .bottomBar .total {
  margin-right: 30px;
  line-height: 25px;
  font-size: 14px;
}

.actionList span.btn {
  color: var(--color-brand);
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
  margin: 0px 5px;
}

.actionList span.btn:hover {
  color: var(--color-high-text);
}
</style>
