<template>
  <div class="searchUserResult">
    <grid-view ref="gridview" :gridData="dataList" @selection-change="setSelection">
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
      <grid-field prop="account" label="账号" width="150" align="center" :show-overflow-tooltip="true"></grid-field>
      <grid-field prop="name" label="姓名" width="120" align="center" :show-overflow-tooltip="true"></grid-field>
      <grid-field label="性别" width="50" align="center">
        <template slot-scope="item">
          <icon v-if="item.scope.row.gender == 'Female'" icon="icon-nv" title="女"></icon>
          <icon v-else icon="icon-nan" title="男"></icon>
        </template>
      </grid-field>
      <grid-field prop="phone" label="电话" width="120" align="center" :show-overflow-tooltip="true"></grid-field>
      <grid-field prop="email" label="邮箱" align="left" :show-overflow-tooltip="true"></grid-field>
      <!-- 是否显示控件，权限校验 -->
      <grid-field v-if="showEditUserRoles || showEditUserActions" label="配置" width="90" align="center">
        <template slot-scope="item">
          <span v-if="showEditUserRoles" class="btn" title="配置角色" @click="editUserRoles(item.scope.row)">角色</span>
          <span v-if="showEditUserActions" class="btn" title="特殊权限" @click="editUserActions(item.scope.row)">权限</span>
        </template>
      </grid-field>

      <!-- state -->
      <grid-field v-if="showEdit" label="状态" width="65" align="center">
        <template slot-scope="item">
          <icon v-show="item.scope.row.isEnable" :icon="iconEnable" title="启用中" @click.native="setEnable(item.scope.row)"></icon>
          <icon v-show="!item.scope.row.isEnable" :icon="iconDisable" title="禁用中" @click.native="setEnable(item.scope.row)"></icon>
        </template>
      </grid-field>
    </grid-view>

    <div class="bottomBar">
      <pagination v-model="pageIndex" :pageCount="pageCount"></pagination>
      <div class="total">总数据:&nbsp;{{ totalCount }}&nbsp;条</div>
    </div>
  </div>
</template>

<script>
import { computedIcons } from 'common/mixins/computedIcons.js';
import { method_detail_edit } from './mixins/method_detail_edit.js';
import { computed_show } from './mixins/computed_show.js';
import Icon from 'components/widgets/icon.vue';
import GridView from 'components/grid/oa.v3/GridView.vue';
import GridField from 'components/grid/oa.v3/GridField.vue';
import Pagination from 'components/pagination/v2/Pagination.vue';

import appsetting from 'config/appsettings.json';
import { requestData, patchUser, deleteObj } from 'netWork/userinfo.js';

import { extractProps } from 'common/helper/convertHelper';

export default {
  name: 'SearchSysParamsResult',
  mixins: [computedIcons, method_detail_edit, computed_show],
  data() {
    return {
      pageIndex: 0,
      totalCount: 1,
      pageCount: 1,
      dataList: []
    };
  },
  props: {
    name: {
      type: String
    },
    gender: {
      type: String
    },
    phone: {
      type: String
    },
    email: {
      type: String
    },
    search: {
      type: String
    }
  },
  methods: {
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
    setSelection(e) {
      //将选中项目提交至store
      this.$store.commit('user/SetSelection', e);
    },
    deleteItem(e) {
      this.$confirm({
        type: 'warning',
        content: '是否删除 ' + e.account + ' ?',
        confirmTxt: '确认',
        cancelTxt: '取消'
      })
        .then(() => {
          //删除
          deleteObj(e.id, this).then(() => {
            // 1.刷新 搜索结果的当前页
            let props = ['name', 'gender', 'phone', 'email', 'search'];
            let queryParams = extractProps(this, props);
            let queryObj = {
              pageIndex: this.pageIndex + 1,
              pageSize: appsetting.request.pageSize,
              orderBy: 'establish desc', //默认按照创建时间排序,
              ...queryParams
            };
            this.getDataList(queryObj).then(() => {
              // 2.刷新 主列表的当前页
              this.$store.dispatch('user/getDataList', this.$store.getters['user/pageIndex'] + 1);
              this.$toast.show({ type: 'success', text: '删除成功' });
            });
          });
        })
        .catch(() => {});
    },
    setEnable(e) {
      let word = !e.isEnable ? '启用' : '禁用';
      this.$confirm({
        type: 'warning',
        content: '是否' + word + ' "' + e.account + '" ?',
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
          patchUser(e.id, operations, this).then(() => {
            // 1.刷新 搜索结果的当前页
            let props = ['name', 'gender', 'phone', 'email', 'search'];
            let queryParams = extractProps(this, props);
            let queryObj = {
              pageIndex: this.pageIndex + 1,
              pageSize: appsetting.request.pageSize,
              orderBy: 'establish desc', //默认按照创建时间排序,
              ...queryParams
            };
            this.getDataList(queryObj).then(() => {
              // 2.刷新 主列表的当前页
              this.$store.dispatch('user/getDataList', this.$store.getters['user/pageIndex'] + 1);
              this.$toast.show({ type: 'success', text: '设置成功' });
            });
          });
        })
        .catch(() => {});
    }
  },
  watch: {
    pageIndex: {
      handler(current) {
        this.$refs.gridview.resetScroll(); //翻页后重置滚动条位置

        let props = ['name', 'gender', 'phone', 'email', 'search'];
        let queryParams = extractProps(this, props);
        let queryObj = {
          pageIndex: current + 1,
          pageSize: appsetting.request.pageSize,
          orderBy: 'establish desc', //默认按照创建时间排序,
          ...queryParams
        };
        this.getDataList(queryObj);
      }
    }
  },
  activated() {
    //判断是否从搜索页跳转而来
    if (this.$route.meta.fromSearch) {
      //构建搜索参数对象
      let props = ['name', 'gender', 'phone', 'email', 'search'];
      let queryParams = extractProps(this, props);
      let queryObj = {
        pageIndex: 1,
        pageSize: appsetting.request.pageSize,
        orderBy: 'establish desc', //默认按照创建时间排序,
        ...queryParams
      };
      //
      this.getDataList(queryObj);
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == 'searchUser') {
      to.meta.fromSearch = true; //使用meta中变量标识是否从搜索控件跳转过来
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('user/SetSelection', []); //退出时删除，以免Vuex保持选择状态
    from.meta.fromSearch = false; //重置meta fromSearch设置
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
.searchUserResult {
  width: 100%;
  height: calc(100% - 40px);
}

.searchUserResult .gridView {
  height: calc(100% - 25px);
}

.searchUserResult .gridView tbody div.cell i {
  padding: 0px 3px;
}

.searchUserResult .gridView tbody div.cell i.icon-nv {
  color: red;
}

.searchUserResult .gridView tbody div.cell i.icon-nan {
  color: blue;
}

.searchUserResult .gridView tbody div.cell i.icon-qiyong {
  color: var(--color-success);
}

.searchUserResult .gridView tbody div.cell i.icon-jinyong {
  color: var(--color-danger);
}

.searchUserResult .gridView tbody div.cell i:hover {
  color: var(--color-high-text);
  cursor: pointer;
}

.searchUserResult .bottomBar {
  display: flex;
  width: 100%;
  height: 25px;
  justify-content: space-between;
  background: #ebebeb;
}

.searchUserResult .bottomBar .total {
  margin-right: 30px;
  line-height: 25px;
  font-size: 13px;
}

.searchUserResult span.btn {
  color: var(--color-brand);
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
  margin: 0px 5px;
}

.searchUserResult span.btn:hover {
  color: var(--color-high-text);
}
</style>
