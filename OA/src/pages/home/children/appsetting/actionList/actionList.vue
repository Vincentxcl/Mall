<template>
  <div class="actionList">
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
      <!-- 配置 -->
      <grid-field fixed="right" label="配置" width="100" align="center">
        <template slot-scope="item">
          <span class="btn" title="配置角色" @click="roleActionsClick(item.scope.row)">角色</span>
        </template>
      </grid-field>
    </grid-view>

    <div class="strip bottomBar">
      <pagination v-model="pageIndex" :pageCount="pageCount"></pagination>
      <div class="total">总记录:{{ totalCount }}</div>
    </div>
    <!-- popup -->
    <create-Action-item ref="createSettingItem" v-model="isShowCreate" @create="createData"></create-Action-item>
    <edit-Action-item ref="editSettingItem" v-model="isShowEdit" :obj="editObj" @edit="editItem"></edit-Action-item>
    <edit-role-actions ref="editRoleAction" v-model="isShowRoleAction" :selectedAction="selectedAction" :roleList="roleList" :roleActions="selectedRoleActions" @edit="editRoles"></edit-role-actions>
  </div>
</template>

<script>
import GridField from 'components/grid/oa.v3/GridField.vue';
import GridView from 'components/grid/oa.v3/GridView.vue';
import Pagination from 'components/pagination/v2/Pagination.vue';
import CreateActionItem from './parts/createActionItem.vue';
import EditActionItem from './parts/editActionItem.vue';
import EditRoleActions from './parts/editRoleActions.vue';

import { trimInObj, getDifferent } from 'common/helper/convertHelper';
import * as action from 'netWork/action.js';
import * as role from 'netWork/role.js';
import * as roleActions from 'netWork/roleAction.js';
import Icon from 'components/widgets/icon.vue';

export default {
  name: 'ActionList',
  data() {
    return {
      isShowCreate: false,
      isShowEdit: false,
      isShowRoleAction: false,
      pageIndex: 0,
      totalCount: 1,
      pageCount: 1,
      headItem: [
        {
          prop: 'name',
          label: '名称',
          width: '150',
          align: 'center'
        },
        {
          prop: 'controllerTtl',
          label: 'Controller',
          width: '200',
          align: 'center'
        },
        {
          prop: 'actionTtl',
          label: 'Action',
          width: '200',
          align: 'center'
        },
        {
          prop: 'httpMethod',
          label: '请求方式',
          width: '90',
          align: 'center'
        },
        {
          prop: 'description',
          label: '描述',
          align: 'center'
        },
        {
          prop: 'ord',
          label: '排序',
          width: '50',
          align: 'center',
          fixed: 'right'
        }
      ],
      json: [],
      editObj: {},
      roleList: [],
      selectedRoleActions: [],
      selectedAction:{},
      selectedActionId: null
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
      let methods = ['HttpGet', 'HttpPost', 'HttpPut', 'HttpPatch', 'HttpDelete'];
      let index = methods.findIndex((i) => i == e.httpMethod);
      let temp = {
        ...e
      };
      temp.httpMethod = index;
      this.editObj = trimInObj(temp);
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
            action
              .deleteObjs(ids)
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
      action
        .requestData(index)
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
        .catch((error) => this.$toast.show({ type: 'warning', text: error.response.status + ',请重新<a href="/login">登录</a>' }));
    },
    createData(e) {
      action
        .postData(e)
        .then(() => {
          this.turnToFirstPage();
          this.$refs.createSettingItem.close();
          this.$toast.show({ type: 'success', text: '添加成功' });
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
        action
          .patchObj(this.editObj.id, operations)
          .then(() => {
            this.getData(this.pageIndex + 1);
            this.$refs.editSettingItem.close();
            this.$toast.show({ type: 'success', text: '修改成功' });
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
        content: '是否删除 ' + e.name + ' ?',
        confirmTxt: '确认',
        cancelTxt: '取消'
      })
        .then(() => {
          action
            .deleteObj(e.id)
            .then(() => {
              this.getData(this.pageIndex + 1);
              this.$toast.show({ type: 'success', text: '删除成功' });
            })
            .catch((error) => {
              let str = JSON.stringify(error.response.data.errors);
              this.$toast.show({ text: str });
            });
        })
        .catch(() => {});
    },
    roleActionsClick(e) {
      this.selectedAction=e;
      this.isShowRoleAction = true;
      //所有角色
      role
        .requestData(1)
        .then((res) => {
          this.roleList = res.data;
        })
        .catch();
      //相应角色
      roleActions
        .requestData(e.id)
        .then((res) => {
          this.selectedRoleActions = res.data.map((i) => i.role.id);
        })
        .catch();
    },
    editRoles(e) {
      roleActions
        .postData(this.selectedAction.id, e)
        .then(() => {
          this.$refs.editRoleAction.close();
          this.$toast.show({ type: 'success', text: '设置成功' });
        })
        .catch((error) => {
          let str = JSON.stringify(error.response.data.errors);
          this.$refs.editRoleAction.message = str;
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
    Pagination,
    CreateActionItem,
    EditActionItem,
    EditRoleActions,
    GridField,
    GridView,
    Icon
  }
};
</script>

<style scoped>
.actionList {
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
