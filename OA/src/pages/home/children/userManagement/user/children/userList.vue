<template>
  <div class="userList">
    <grid-view ref="gridview" :gridData="dataList" @selection-change="setSysParamsSelection">
      <!-- selection column -->
      <grid-field v-if="showSelection" type="selection" width="50" fixed="left" align="center"> </grid-field>
      <!-- ctrls -->
      <grid-field v-if="showEdit || showDel" fixed="left" label="操作" width="100" align="center">
        <template slot-scope="item">
          <icon v-if="showDetail" :icon="iconDetail" class="ctrl" title="明细" @click.native="getDetail(item.scope.row)"></icon>
          <icon v-if="showEdit" :icon="iconEdit" class="ctrl" title="编辑" @click.native="editItem(item.scope.row)"></icon>
          <icon v-if="showDel" :icon="iconDel" class="ctrl" title="删除" @click.native="deleteItem(item.scope.row)"></icon>
        </template>
      </grid-field>
      <!-- content -->
      <grid-field prop="account" label="账号" width="150" align="center" :show-overflow-tooltip="true"></grid-field>
      <grid-field prop="name" label="姓名" width="150" align="center" :show-overflow-tooltip="true"></grid-field>
      <grid-field label="性别" width="50" align="center">
        <template slot-scope="item">
          <icon v-if="item.scope.row.gender == 'Female'" icon="icon-nv" title="女"></icon>
          <icon v-else icon="icon-nan" title="男"></icon>
        </template>
      </grid-field>
      <grid-field prop="phone" label="电话" width="150" align="center" :show-overflow-tooltip="true"></grid-field>
      <grid-field prop="email" label="邮箱" align="left" :show-overflow-tooltip="true"></grid-field>
      <grid-field fixed="right" label="配置" width="100" align="center">
        <template slot-scope="item">
          <span class="btn" title="配置角色" @click="userRolesClick(item.scope.row)">角色</span>
          <span class="btn" title="特殊权限" @click="userActionsClick(item.scope.row)">权限</span>
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
import { method_detail_edit } from './mixins/method_detail_edit';
import { computed_show } from './mixins/computed_show.js';

import appsetting from 'config/appsettings.json';
import { deleteObj } from 'netWork/userinfo.js';

export default {
  name: 'UserList',
  mixins: [method_detail_edit, computed_show],
  data() {
    return {
      index: 0 //页码
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
    pageIndex() {
      return this.$store.getters['user/pageIndex'];
    },
    totalCount() {
      return this.$store.getters['user/totalCount'];
    },
    pageCount() {
      return this.$store.getters['user/pageCount'];
    },
    dataList() {
      return this.$store.getters['user/dataList'];
    }
  },
  methods: {
    //将选中项目提交至store
    setSysParamsSelection(e) {
      this.$store.commit('user/SetSelection', e);
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
            this.$store.dispatch('user/getDataList', this.pageIndex + 1); //刷新当前页
            this.$toast.show({ type: 'success', text: '删除成功' });
          });
        })
        .catch(() => {});
    },
    userRolesClick(e) {
      this.selectedUser = e;
      this.isShowUserRole = true;
      //所有角色
      role
        .requestData(1)
        .then((res) => {
          this.roleList = res.data;
        })
        .catch();
      //相应角色
      userRole
        .requestData(e.id)
        .then((res) => {
          this.selectedUserRoles = res.data.map((i) => i.role.id);
        })
        .catch();
    },
    userActionsClick(e) {
      this.selectedUser = e;
      this.isShowUserAction = true;
    }
  },
  created() {
    this.$store.dispatch('user/getDataList', 1); //创建该组件时，默认获取首页
  },
  watch: {
    pageIndex: {
      handler(current) {
        this.index = current; //通知pagination
      }
    },
    index: {
      handler(current) {
        this.$store.dispatch('user/getDataList', current + 1);
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
.userList {
  width: 100%;
  height: calc(100% - 40px);
}

.userList .gridView {
  height: calc(100% - 25px);
}

.userList .gridView div.cell i.ctrl {
  padding: 0px 3px;
}

.userList .gridView div.cell i.ctrl:hover {
  color: var(--color-high-text);
  cursor: pointer;
}

.userList .bottomBar {
  display: flex;
  width: 100%;
  height: 25px;
  justify-content: space-between;
  background: #ebebeb;
}

.userList .bottomBar .total {
  margin-right: 30px;
  line-height: 25px;
  font-size: 13px;
}

.userList span.btn {
  color: var(--color-brand);
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
  margin: 0px 5px;
}

.userList span.btn:hover {
  color: var(--color-high-text);
}
</style>
