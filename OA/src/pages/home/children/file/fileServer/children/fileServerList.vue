<template>
  <div class="fileServerList">
    <grid-view ref="gridview" :gridData="dataList" @selection-change="setFileServerSelection" @sort-change="setSortChange">
      <!-- selection column -->
      <grid-field v-if="showSelection" type="selection" width="50" fixed="left" align="center"> </grid-field>
      <!-- ctrls -->
      <grid-field v-if="showDetail || showEdit || showDel" fixed="left" label="操作" width="100" align="center">
        <template slot-scope="item">
          <icon v-if="showDetail" :icon="iconDetail" title="明细" @click.native="getDetail(item.scope.row)"></icon>
          <icon v-if="showEdit" :icon="iconEdit" title="编辑" @click.native="editItem(item.scope.row)"></icon>
          <icon v-if="showDel" :icon="iconDel" title="删除" @click.native="deleteItem(item.scope.row)"></icon>
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

import { patchObj, deleteObj } from 'netWork/fileServer.js';

export default {
  name: 'FileServerList',
  mixins: [computedIcons, method_detail_edit, computed_show],
  data() {
    return {
      index: 0, //页码
      headItem: [
        {
          prop: 'ipAddress',
          label: '地址',
          width: '200',
          align: 'left',
          sort: 'custom'
        },
        {
          prop: 'path',
          label: '路径',
          width: '200',
          align: 'left'
        },
        {
          prop: 'diskCapacity',
          label: '使用率',
          width: '80',
          align: 'center',
          sort: 'custom'
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
          sort: 'custom'
        }
      ]
    };
  },
  computed: {
    pageIndex() {
      return this.$store.getters['fileServer/pageIndex'];
    },
    totalCount() {
      return this.$store.getters['fileServer/totalCount'];
    },
    pageCount() {
      return this.$store.getters['fileServer/pageCount'];
    },
    dataList() {
      return this.$store.getters['fileServer/dataList'];
    }
  },
  methods: {
    //将选中项目提交至store
    setFileServerSelection(e) {
      this.$store.commit('fileServer/SetSelection', e);
    },
    deleteItem(e) {
      this.$confirm({
        type: 'warning',
        content: '是否删除 ' + e.ipAddress + '\\' + e.path + ' ?',
        confirmTxt: '确认',
        cancelTxt: '取消'
      })
        .then(() => {
          deleteObj(e.id, this).then(() => {
            this.$store.dispatch('fileServer/getDataList', this.pageIndex + 1); //刷新当前页
            this.$toast.show({ type: 'success', text: '删除成功' });
          });
        })
        .catch(() => {});
    },
    setSortChange(e) {
      this.$store.dispatch('fileServer/setOrderBy', e);
      this.$store.dispatch('fileServer/getDataList', this.index + 1);
    },
    setEnable(e) {
      let word = !e.isEnable ? '启用' : '禁用';
      this.$confirm({
        type: 'warning',
        content: '是否' + word + ' "' + e.ipAddress + '\\' + e.path + '" ?',
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
            this.$store.dispatch('fileServer/getDataList', this.pageIndex + 1); //刷新当前页
            this.$toast.show({ type: 'success', text: '修改成功' });
          });
        })
        .catch(() => {});
    }
  },
  created() {
    this.$store.dispatch('fileServer/getDataList', 1); //创建该组件时，默认获取首页
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
        this.$store.dispatch('fileServer/getDataList', current + 1);
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
.fileServerList {
  width: 100%;
  height: calc(100% - 40px);
}

.fileServerList .gridView {
  height: calc(100% - 25px);
}

.fileServerList .gridView tbody div.cell i {
  padding: 0px 3px;
}

.fileServerList .gridView tbody div.cell i.icon-qiyong {
  color: var(--color-success);
}

.fileServerList .gridView tbody div.cell i.icon-jinyong {
  color: var(--color-danger);
}

.fileServerList .gridView tbody div.cell i:hover {
  color: var(--color-high-text);
  cursor: pointer;
}

.fileServerList .bottomBar {
  display: flex;
  width: 100%;
  height: 25px;
  justify-content: space-between;
  background: #ebebeb;
}

.fileServerList .bottomBar .total {
  margin-right: 30px;
  line-height: 25px;
  font-size: 13px;
}
</style>
