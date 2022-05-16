<template>
  <div class="sysParameterList">
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
      <pagination v-model="index" :pageCount="pageCount"></pagination>
      <div class="total">总记录:{{ totalCount }}</div>
    </div>
  </div>
</template>

<script>
import Icon from 'components/widgets/icon.vue';
import GridView from 'components/grid/oa.v3/GridView.vue';
import GridField from 'components/grid/oa.v3/GridField.vue';
import Pagination from 'components/pagination/v2/Pagination.vue';

import appsetting from 'config/appsettings.json';
import { deleteObj } from 'netWork/appSetting.js';
import { trimInObj } from 'common/helper/convertHelper';

export default {
  name: 'SysParameterList',
  data() {
    return {
      index: 0, //页码
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
      ]
    };
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
    },
    showSelection() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'sysParameter');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 613)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showDetail() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'sysParameter');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 616)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showEdit() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'sysParameter');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 614)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showDel() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'sysParameter');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 615)) {
          isShow = true;
        }
      }
      return isShow;
    },
    pageIndex() {
      return this.$store.getters['sysParameter/pageIndex'];
    },
    totalCount() {
      return this.$store.getters['sysParameter/totalCount'];
    },
    pageCount() {
      return this.$store.getters['sysParameter/pageCount'];
    },
    dataList() {
      return this.$store.getters['sysParameter/dataList'];
    }
  },
  methods: {
    //将选中项目提交至store
    setSysParamsSelection(e) {
      this.$store.commit('sysParameter/SetSelection', e);
    },
    getDetail(e) {
      this.$store.dispatch('sysParameter/setSelectedObj', trimInObj(e));
      this.$router.push({
        name: 'settingItemDetail',
        params: {
          id: e.id
        }
      });
    },
    editItem(e) {
      this.$store.dispatch('sysParameter/setSelectedObj', trimInObj(e));
      this.$router.push({
        name: 'editSettingItem'
      });
    },
    deleteItem(e) {
      this.$confirm({
        type: 'warning',
        content: '是否删除 ' + e.title + ' ?',
        confirmTxt: '确认',
        cancelTxt: '取消'
      })
        .then(() => {
          deleteObj(e.id, this).then(() => {
            this.$store.dispatch('sysParameter/getDataList', this.pageIndex + 1); //刷新当前页
            this.$toast.show({ type: 'success', text: '删除成功' });
          });
        })
        .catch(() => {});
    }
  },
  created() {
    this.$store.dispatch('sysParameter/getDataList', 1); //创建该组件时，默认获取首页
  },
  watch: {
    pageIndex: {
      handler(current) {
        this.index = current; //通知pagination
      }
    },
    index: {
      handler(current) {
        this.$store.dispatch('sysParameter/getDataList', current + 1);
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

<style scoped>
.sysParameterList {
  width: 100%;
  height: 100%;
}

.bottomBar {
  display: flex;
  width: 100%;
  height: 25px;
  justify-content: space-between;
  background: #ebebeb;
}

.total {
  margin-right: 30px;
  line-height: 25px;
  font-size: 14px;
}

.gridView {
  height: calc(100% - 65px);
}

.gridView div.cell i {
  padding: 0px 3px;
  cursor: pointer;
}
</style>
