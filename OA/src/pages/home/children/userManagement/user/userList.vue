<template>
  <div class="userList">
    <div class="strip topBar">
      <div @click="addClick">添加</div>
      <div @click="deleteClick">删除</div>
    </div>

    <grid-view ref="gridview" :gridData="json">
      <!-- selection column -->
      <grid-field type="selection" width="50" fixed="left" align="center"> </grid-field>
      <!-- ctrls -->
      <grid-field fixed="left" label="操作" width="100" align="center">
        <template slot-scope="item">
          <icon icon="icon-bianji" title="编辑" @click.native="editClick(item.scope.row)"></icon>
          <icon icon="icon-shanchu" title="删除" @click.native="deleteItem(item.scope.row)"></icon>
        </template>
      </grid-field>
      <!-- content -->
      <grid-field v-for="item in headItem" :key="item.field" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :show-overflow-tooltip="true"></grid-field>
      <grid-field fixed="right" label="配置" width="100" align="center">
        <template slot-scope="item">
          <span class="btn" title="配置角色" @click="userRolesClick(item.scope.row)">角色</span>
          <span class="btn" title="特殊权限" @click="userActionsClick(item.scope.row)">权限</span>
        </template>
      </grid-field>
    </grid-view>

    <div class="strip bottomBar">
      <pagination v-model="pageIndex" :pageCount="pageCount"></pagination>
      <div class="total">总记录:{{ totalCount }}</div>
    </div>
    <!-- popup -->
    <create-user-info-item ref="createSettingItem" v-model="isShowCreate" @create="createData"></create-user-info-item>
    <edit-user-info-item ref="editSettingItem" v-model="isShowEdit" :obj="editObj" @edit="editItem"></edit-user-info-item>
    <edit-user-roles ref="editUserRoles" v-model="isShowUserRole" :selectedUser="selectedUser" :roleList="roleList" :userRoles="selectedUserRoles" @edit="editRoles"></edit-user-roles>
    <edit-user-actions v-model="isShowUserAction" :selectedUser="selectedUser"></edit-user-actions>
  </div>
</template>

<script>
import GridField from 'components/grid/oa.v3/GridField.vue';
import GridView from 'components/grid/oa.v3/GridView.vue';
import Icon from 'components/widgets/icon.vue';
import Pagination from 'components/pagination/v2/Pagination.vue';
import CreateUserInfoItem from './parts/createUserInfoItem.vue';
import EditUserInfoItem from './parts/editUserInfoItem.vue';
import EditUserRoles from './parts/editUserRoles.vue';
import EditUserActions from './parts/editUserActions.vue';

import { trimInObj, getDifferent } from 'common/helper/convertHelper';
import { requestData, postData, patchObj, deleteObj, deleteObjs } from 'netWork/userinfo.js';
import * as role from 'netWork/role.js';
import * as userRole from 'netWork/userRole.js';

export default {
  name: 'UserList',
  data() {
    return {
      isShowCreate: false,
      isShowEdit: false,
      isShowUserRole: false,
      isShowUserAction: false,
      pageIndex: 0,
      totalCount: 1,
      pageCount: 1,
      headItem: [
        {
          prop: 'account',
          label: '账号',
          width: '150',
          align: 'center'
        },
        {
          prop: 'name',
          label: '昵称',
          width: '100',
          align: 'center'
        },
        {
          prop: 'gender',
          label: '性别',
          width: '80',
          align: 'center'
        },
        {
          prop: 'phone',
          label: '电话',
          width: '150',
          align: 'center'
        },
        {
          prop: 'email',
          label: '邮箱',
          align: 'center'
        }
      ],
      json: [],
      editObj: {},
      roleList: [],
      selectedUser: {},
      selectedUserRoles: []
    };
  },
  methods: {
    turnToFirstPage() {
      //刷新页面
      if (this.pageIndex == 0) {
        this.getData(1);
      } else {
        this.pageIndex = 0;
      }
    },
    addClick() {
      this.isShowCreate = true;
    },
    editClick(e) {
      this.editObj = trimInObj(e);
      this.isShowEdit = true;
    },
    deleteClick() {
      let arr = this.$refs.gridview.$refs.table.selection;
      if (arr.length > 0) {
        let ids = arr.map((obj) => obj.id).join(',');
        this.$confirm({
          type: 'warning',
          content: '是否删除这 ' + arr.length + ' 项数据?',
          confirmTxt: '确认',
          cancelTxt: '取消'
        })
          .then(() => {
            deleteObjs(ids)
              .then(() => {
                this.getData(this.pageIndex + 1);
                this.$toast.show({ type: 'success', text: '删除成功' });
              })
              .catch((error) => {
                let str = JSON.stringify(error.response.data.errors);
                this.$toast.show({ type: 'danger', text: str });
              });
          })
          .catch(() => {});
      }
    },
    getData(index) {
      requestData(index)
        .then((res) => {
          //页码
          let page = JSON.parse(res.headers['x-pagination']);
          this.totalCount = page.totalCount;
          this.pageCount = page.pageCount;
          this.pageIndex = page.pageIndex - 1;
          //列表
          this.json = res.data.sort((a, b) => {
            if (a.establish > b.establish) return -1;
            else if (a.establish < b.establish) return 1;
            else return 0;
          });
        })
        .catch((error) => {
          this.$toast.show({ type: 'warning', text: error.response.status + ',请重新<a href="/login">登录</a>' });
        });
    },
    createData(e) {
      postData(e)
        .then(() => {
          this.turnToFirstPage();
          this.$refs.createSettingItem.close();
          this.$toast.show({ text: '添加成功' });
        })
        .catch((error) => {
          let str = JSON.stringify(error.response.data.errors);
          this.$refs.createSettingItem.message = str;
        });
    },
    editItem(e) {
      let diff = getDifferent(this.editObj, e);
      if (Object.keys(diff).length > 0) {
        let operations = [];
        for (let prop in diff) {
          let operation = { op: 'replace' };
          operation.path = '/' + prop;
          operation.value = diff[prop];
          operations.push(operation);
        }
        patchObj(this.editObj.id, operations)
          .then(() => {
            this.getData(this.pageIndex + 1);
            this.$refs.editSettingItem.close();
            this.$toast.show({ text: '修改成功' });
          })
          .catch((error) => {
            let str = JSON.stringify(error.response.data.errors);
            this.$refs.editSettingItem.message = str;
          });
      }
      //无变动
      else {
        this.$refs.editSettingItem.close();
      }
    },
    deleteItem(e) {
      this.$confirm({
        type: 'warning',
        content: '是否删除 ' + e.account + ' ?',
        confirmTxt: '确认',
        cancelTxt: '取消'
      })
        .then(() => {
          deleteObj(e.id)
            .then(() => {
              this.getData(this.pageIndex + 1);
              this.$toast.show({ type: 'success', text: '删除成功' });
            })
            .catch((error) => {
              let str = JSON.stringify(error.response.data.errors);
              this.$toast.show({ type: 'danger', text: str });
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
    },
    editRoles(e) {
      userRole
        .postData(this.selectedUser.id, e)
        .then(() => {
          this.$refs.editUserRoles.close();
          this.$toast.show({ type: 'success', text: '设置成功' });
        })
        .catch((error) => {
          let str = JSON.stringify(error.response.data.errors);
          this.$refs.editUserRoles.message = str;
        });
    }
  },
  watch: {
    pageIndex: {
      handler(current) {
        this.getData(current + 1);
      }
    }
  },
  created() {
    this.getData(1);
  },
  components: {
    GridField,
    GridView,
    Icon,
    Pagination,
    CreateUserInfoItem,
    EditUserInfoItem,
    EditUserRoles,
    EditUserActions
  }
};
</script>

<style scoped>
.userList {
  width: 100%;
  height: 100%;
}

.strip {
  display: flex;
  background: #ebebeb;
  width: 100%;
}

.topBar {
  height: 40px;
}

.topBar > div {
  width: 60px;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  margin: 0px 10px;
}

.topBar > div:hover {
  cursor: pointer;
  color: var(--color-high-text);
}

.bottomBar {
  display: flex;
  height: 25px;
  justify-content: space-between;
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

span.btn {
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
  margin: 0px 5px;
}
</style>
