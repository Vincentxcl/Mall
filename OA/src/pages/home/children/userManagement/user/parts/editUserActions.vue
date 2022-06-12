<template>
  <dialog-window v-show="isShowField" class="editUserActions" @iconClick="close">
    <template slot="title">配置用户"{{ selectedUser.account }}"的特殊权限</template>
    <template slot="content">
      <template v-if="json.length > 0">
        <grid-view ref="table" :gridData="json">
          <!-- content -->
          <grid-field v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align"></grid-field>
          <!-- ctrls -->
          <grid-field label="操作" width="200" align="center">
            <template slot-scope="item">
              <label>
                <input type="radio" :name="item.scope.row.id" value="true" v-model="item.scope.row.enable" @click="setUserAction(item, true)" />
                允许
              </label>
              <label>
                <input type="radio" :name="item.scope.row.id" value="false" v-model="item.scope.row.enable" @click="setUserAction(item, false)" />
                禁止
              </label>
              <btn type="brand" @click.native="delUserAction(item)">清除</btn>
            </template>
          </grid-field>
        </grid-view>
      </template>
      <template v-else>
        <div>正在加载角色列表</div>
      </template>
    </template>
    <template slot="ctrl">
      <pagination v-model="pageIndex" :pageCount="pageCount"></pagination>
    </template>
  </dialog-window>
</template>

<script>
import DialogWindow from 'components/dialog/v2/dialogWindow.vue';
import GridView from 'components/grid/oa.v3/GridView.vue';
import GridField from 'components/grid/oa.v3/GridField.vue';
import Pagination from 'components/pagination/v1/Pagination.vue';
import Btn from 'components/button/btn.vue';

import * as action from 'netWork/action.js';
import * as userAction from 'netWork/userAction.js';

export default {
  name: 'EditUserActions',
  data() {
    return {
      isShowField: false,
      pageIndex: 0,
      totalCount: 1,
      pageCount: 1,
      json: [],
      columns: [
        {
          prop: 'name',
          label: '名称',
          width: '200',
          align: 'center'
        },
        {
          prop: 'controllerTtl',
          label: 'Control',
          width: '150',
          align: 'center'
        },
        {
          prop: 'actionTtl',
          label: 'Action',
          width: '150',
          align: 'center'
        },
        {
          prop: 'httpMethod',
          label: '请求方式',
          width: '100',
          align: 'center'
        },
        {
          prop: 'description',
          label: '描述',
          align: 'center'
        }
      ],
      userActionList: []
    };
  },
  props: {
    isShow: {
      type: Boolean
    },
    selectedUser: {
      type: Object,
      required: true
    }
  },
  methods: {
    async getActionData(index) {
      //有分页，所以在组件中连接api
      return action
        .requestData(index)
        .then((res) => {
          //页码
          let page = JSON.parse(res.headers['x-pagination']);
          this.totalCount = page.totalCount;
          this.pageCount = page.pageCount;
          this.pageIndex = page.pageIndex - 1;
          //列表
          this.json = res.data
            .map((item) => {
              return { ...item, enable: undefined }; //添加一个字段
            })
            .sort((a, b) => {
              if (a.establish > b.establish) return -1;
              else if (a.establish < b.establish) return 1;
              else return 0;
            });
        })
        .catch((error) => console.log(error));
    },
    getUserActionData(id) {
      userAction
        .requestData(id)
        .then((res) => {
          this.userActionList = res.data;
        })
        .catch((error) => console.log(error));
    },
    //将用户权限关系对象应用权限列表上，显示用户具有的特殊权限
    setUserActionToActionList(userActionList) {
      //清除所有特殊权限
      this.json.forEach((o) => {
        o.enable = undefined;
      });
      //设置特殊权限
      if (userActionList.length > 0) {
        for (var item of userActionList) {
          let actionId = item.action.id;
          //需要等this.json中有数据,才会正常显示设置的特殊权限数据信息!!!
          this.json.forEach((o) => {
            if (o.id == actionId) {
              o.enable = item.isEnable;
            }
          });
        }
      }
    },
    setUserAction(rel, enable) {
      let actionId = rel.scope.row.id;

      if (rel.scope.row.enable != enable) {
        userAction
          .postData(this.selectedUser.id, actionId, enable)
          .then(() => {
            this.getUserActionData(this.selectedUser.id);
            this.$toast.show({ type: 'success', text: '设置成功' });
          })
          .catch((error) => {
            let str = JSON.stringify(error.response.data.errors);
            this.$toast.show({ type: 'danger', text: str });
          });
      }
    },
    delUserAction(e) {
      if (e.scope.row.enable != undefined) {
        let actionId = e.scope.row.id;
        userAction
          .deleteObj(this.selectedUser.id, actionId)
          .then(() => {
            this.getUserActionData(this.selectedUser.id);
            this.$toast.show({ type: 'success', text: '删除成功' });
          })
          .catch((error) => {
            let str = JSON.stringify(error.response.data.errors);
            this.$toast.show({ type: 'danger', text: str });
          });
      }
    },

    clear() {},
    close() {
      this.clear();
      this.isShowField = false;
    }
  },
  watch: {
    isShow: {
      handler(current) {
        this.isShowField = current;
      }
    },
    isShowField: {
      handler(current) {
        if (current) {
          //获取'权限列表'
          this.getActionData(1).then(() => {
            //获取'用户权限'列表
            if (this.selectedUser.id && this.selectedUser.id.trim() != '') {
              this.getUserActionData(this.selectedUser.id);
            }
          });
        }
        if (this.$mask) {
          current ? this.$mask.show() : this.$mask.hide();
        }
        this.$emit('show', current);
      }
    },
    pageIndex: {
      handler(current) {
        this.getActionData(current + 1).then(() => {
          this.setUserActionToActionList(this.userActionList);
        });
      }
    },
    userActionList: {
      handler(current) {
        this.setUserActionToActionList(current);
      }
    }
  },
  components: {
    DialogWindow,
    GridView,
    GridField,
    Pagination,
    Btn
  },
  model: {
    prop: 'isShow',
    event: 'show'
  }
};
</script>

<style scoped>
div.editUserActions {
  width: 95%;
  min-width: 800px;
  height: 95%;
  margin: auto;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}

div.gridView {
  height: 100%;
}

button.btn {
  width: 50px;
}

div.pagination {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
