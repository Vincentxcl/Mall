<template>
  <div class="searchRoleResult">
    <grid-view ref="gridview" :gridData="dataList" @selection-change="setSysParamsSelection" @sort-change="setSortChange">
      <!-- selection column -->
      <grid-field v-if="showSelection" type="selection" width="50" fixed="left" align="center"> </grid-field>
      <!-- ctrls -->
      <grid-field v-if="showEdit || showDel" fixed="left" label="操作" width="100" align="center">
        <template slot-scope="item">
          <icon v-if="showDetail" :icon="iconDetail" title="明细" @click.native="getDetail(item.scope.row)"></icon>
          <icon v-if="showEdit" :icon="iconEdit" title="编辑" @click.native="editItem(item.scope.row)"></icon>
          <icon v-if="showDel" :icon="iconDel" title="删除" @click.native="deleteItem(item.scope.row)"></icon>
        </template>
      </grid-field>
      <!-- content -->
      <grid-field v-for="item in headItem" :key="item.field" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sort" :show-overflow-tooltip="true"></grid-field>
    </grid-view>

    <div class="bottomBar">
      <pagination v-model="pageIndex" :pageCount="pageCount"></pagination>
      <div class="total">总数据:&nbsp;{{ totalCount }}&nbsp;条</div>
    </div>
  </div>
</template>

<script>
import Icon from 'components/widgets/icon.vue';
import GridView from 'components/grid/oa.v3/GridView.vue';
import GridField from 'components/grid/oa.v3/GridField.vue';
import Pagination from 'components/pagination/v2/Pagination.vue';
import { getSetOrderBy } from 'common/mixins/getSetOrderBy.js';
import { method_detail_edit } from './mixins/method_detail_edit.js';
import { computed_show } from './mixins/computed_show.js';

import appsetting from 'config/appsettings.json';
import { requestData, deleteObj } from 'netWork/role.js';

import { extractProps } from 'common/helper/convertHelper';

export default {
  name: 'SearchRoleResult',
  mixins: [getSetOrderBy, method_detail_edit, computed_show],
  data() {
    return {
      headItem: [
        {
          prop: 'name',
          label: '名称',
          width: '200',
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
          fixed: 'right',
          sort: 'custom'
        }
      ],
      pageIndex: 0,
      totalCount: 1,
      pageCount: 1,
      dataList: []
    };
  },
  props: {
    search: {
      type: String,
      required: true
    }
  },
  computed: {
    iconDetail() {
      return appsetting.systemIcon.toolIcon.detail;
    },
    iconEdit() {
      return appsetting.systemIcon.toolIcon.edit;
    },
    iconDel() {
      return appsetting.systemIcon.toolIcon.del;
    }
  },
  methods: {
    setSortChange(e) {
      this.setOrderBy(e);

      let props = ['search'];
      let queryParams = extractProps(this, props);
      let queryObj = {
        pageIndex: this.pageIndex + 1,
        pageSize: appsetting.request.pageSize,
        orderBy: this.orderBy == '' ? 'establish desc' : this.orderBy, //默认按照创建时间排序,
        ...queryParams
      };
      this.getDataList(queryObj);
    },
    getDataList(queryObj) {
      return requestData(queryObj, this).then((res) => {
        //页码
        let page = JSON.parse(res.headers['x-pagination']);
        //提交
        this.pageIndex = page.pageIndex - 1;
        this.totalCount = page.totalCount;
        this.pageCount = page.pageCount;
        this.dataList = res.data;
      });
    },
    //将选中项目提交至store
    setSysParamsSelection(e) {
      this.$store.commit('role/SetSelection', e);
    },
    deleteItem(e) {
      this.$confirm({
        type: 'warning',
        content: '是否删除 ' + e.name + ' ?',
        confirmTxt: '确认',
        cancelTxt: '取消'
      })
        .then(() => {
          //删除
          deleteObj(e.id, this).then(() => {
            // 1.刷新 搜索结果的当前页
            let props = ['search'];
            let queryParams = extractProps(this, props);
            let queryObj = {
              pageIndex: this.pageIndex + 1,
              pageSize: appsetting.request.pageSize,
              orderBy: this.orderBy == '' ? 'establish desc' : this.orderBy, //默认按照创建时间排序,
              ...queryParams
            };
            this.getDataList(queryObj).then(() => {
              // 2.刷新 主列表的当前页
              this.$store.dispatch('role/getDataList', this.$store.getters['role/pageIndex'] + 1);
              this.$toast.show({ type: 'success', text: '删除成功' });
            });
          });
        })
        .catch(() => {});
    }
  },
  watch: {
    pageIndex: {
      handler(current) {
        let props = ['search'];
        let queryParams = extractProps(this, props);
        let queryObj = {
          pageIndex: current + 1,
          pageSize: appsetting.request.pageSize,
          orderBy: this.orderBy == '' ? 'establish desc' : this.orderBy, //默认按照创建时间排序,
          ...queryParams
        };
        this.getDataList(queryObj);
      }
    }
  },
  activated() {
    //构建搜索参数对象
    let props = ['search'];
    let queryParams = extractProps(this, props);
    if (Object.keys(queryParams).length > 0) {
      let queryObj = {
        pageIndex: 1,
        pageSize: appsetting.request.pageSize,
        orderBy: this.orderBy == '' ? 'establish desc' : this.orderBy, //默认按照创建时间排序,
        ...queryParams
      };
      //
      this.getDataList(queryObj);
    }
  },
  beforeRouteLeave(to, from, next) {
    this.dataList = [];
    this.$store.commit('role/SetSelection', []); //退出时删除
    next();
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
.searchRoleResult {
  width: 100%;
  height: 100%;
}

.searchRoleResult .gridView {
  height: calc(100% - 65px);
}

.searchRoleResult .gridView tbody div.cell i {
  padding: 0px 3px;
}

.searchRoleResult .gridView tbody div.cell i:hover {
  color: var(--color-high-text);
  cursor: pointer;
}

.searchRoleResult .bottomBar {
  display: flex;
  width: 100%;
  height: 25px;
  justify-content: space-between;
  background: #ebebeb;
}

.searchRoleResult .bottomBar .total {
  margin-right: 30px;
  line-height: 25px;
  font-size: 14px;
}
</style>
