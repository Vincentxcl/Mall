<template>
  <div class="searchSysParamsResult">
    <grid-view ref="gridview" :gridData="dataList" @selection-change="setSysParamsSelection">
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
      <grid-field v-for="item in headItem" :key="item.field" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :show-overflow-tooltip="true"></grid-field>
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
import { method_detail_edit } from './mixins/method_detail_edit.js';
import { computed_show } from './mixins/computed_show.js';

import appsetting from 'config/appsettings.json';
import { requestData, deleteObj } from 'netWork/appSetting.js';

import { extractProps } from 'common/helper/convertHelper';

export default {
  name: 'SearchSysParamsResult',
  mixins: [method_detail_edit, computed_show],
  data() {
    return {
      headItem: [
        {
          prop: 'title',
          label: '名称',
          width: '200',
          align: 'center'
        },
        {
          prop: 'value',
          label: '值',
          width: '80',
          align: 'center'
        },
        {
          prop: 'description',
          label: '描述',
          align: 'left'
        },
        {
          prop: 'ord',
          label: '排序',
          width: '50',
          align: 'center'
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
    getDataList(queryObj) {
      return requestData(queryObj, this).then((res) => {
        //数据 及排序
        this.dataList = res.data.sort((a, b) => {
          if (a.establish > b.establish) return -1;
          else if (a.establish < b.establish) return 1;
          else return 0;
        });
        //页码
        let page = JSON.parse(res.headers['x-pagination']);
        //提交
        this.pageIndex = page.pageIndex - 1;
        this.totalCount = page.totalCount;
        this.pageCount = page.pageCount;
      });
    },
    //将选中项目提交至store
    setSysParamsSelection(e) {
      this.$store.commit('sysParams/SetSelection', e);
    },
    deleteItem(e) {
      this.$confirm({
        type: 'warning',
        content: '是否删除 ' + e.title + ' ?',
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
              orderBy: 'establish desc',
              ...queryParams
            };
            this.getDataList(queryObj).then(() => {
              // 2.刷新 主列表的当前页
              this.$store.dispatch('sysParams/getDataList', this.$store.getters['sysParams/pageIndex'] + 1);
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
          orderBy: 'establish desc',
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
        orderBy: 'establish desc',
        ...queryParams
      };
      //
      this.getDataList(queryObj);
    }
  },
  beforeRouteLeave(to, from, next) {
    this.dataList = [];
    this.$store.commit('sysParams/SetSelection', []); //退出时删除
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
div.searchSysParamsResult {
  width: 100%;
  height: calc(100% - 40px);
}

.searchSysParamsResult .gridView {
  height: calc(100% - 25px);
}

.searchSysParamsResult .gridView div.cell i {
  padding: 0px 3px;
}

.searchSysParamsResult .gridView div.cell i:hover {
  color: var(--color-high-text);
  cursor: pointer;
}

.searchSysParamsResult .bottomBar {
  display: flex;
  width: 100%;
  height: 25px;
  justify-content: space-between;
  background: #ebebeb;
}

.searchSysParamsResult .total {
  margin-right: 30px;
  line-height: 25px;
  font-size: 14px;
}
</style>
