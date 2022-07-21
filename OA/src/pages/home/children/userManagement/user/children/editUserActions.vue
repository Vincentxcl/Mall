<template>
  <div class="editUserActions">
    <div class="workbench">
      <!-- 标题 -->
      <div class="ttl">
        <p>
          正在配置用户<span> {{ title }} </span>的特殊权限
        </p>
      </div>
      <!-- 权限列表 -->
      <template v-if="userActionTempList.length > 0">
        <grid-view ref="gridview" :gridData="userActionTempList" @sort-change="setSortChange">
          <grid-field v-for="item in headItem" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sort" :show-overflow-tooltip="true"></grid-field>
          <!-- ctrls -->
          <grid-field label="操作" width="260" align="left">
            <div class="ctrl" slot-scope="item">
              <div class="radio">
                <!-- enable -->
                <div class="enable">
                  <label>
                    允许
                    <input type="radio" :name="item.scope.row.id" :value="true" v-model="item.scope.row.isEnable" />
                  </label>
                  <label>
                    禁止
                    <input type="radio" :name="item.scope.row.id" :value="false" v-model="item.scope.row.isEnable" />
                  </label>
                </div>
                <!--operation range-->
                <div class="opRange">
                  <label v-for="op in operationRange" :key="op.value" :title="op.description">
                    {{ op.title }}
                    <input type="radio" :value="op.value" :name="'op' + item.scope.row.id" :disabled="isDisableOp(item.scope.row)" v-model="item.scope.row.operationRange" />
                  </label>
                </div>
              </div>
              <div class="btn">
                <btn type="brand" @click.native="setUserAction(item)">提交</btn>
                <btn type="normal" @click.native="delUserAction(item)">清除</btn>
              </div>
            </div>
          </grid-field>
        </grid-view>
      </template>
      <template v-else>
        <div>正在加载角色列表</div>
      </template>
    </div>
    <div class="bottomBar">
      <pagination v-model="index" :pageCount="pageCount"></pagination>
      <div class="total">总数据:&nbsp;{{ totalCount }}&nbsp;条</div>
    </div>
  </div>
</template>

<script>
import store from 'store/index.js'; // import the store
import GridView from 'components/grid/oa.v3/GridView.vue';
import GridField from 'components/grid/oa.v3/GridField.vue';
import Pagination from 'components/pagination/v2/Pagination.vue';
import Btn from 'components/button/btn.vue';
import { extractProps, equalObject } from 'common/helper/convertHelper';
import appsetting from 'config/appsettings.json';
import * as userAction from 'netWork/userAction.js';

export default {
  name: 'EditUserActions',
  data() {
    return {
      userActionTempList: [], //用户特权的列表
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
          align: 'center'
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
    actionList() {
      return this.$store.getters['action/dataList'];
    },
    title() {
      //判断vuex中selectObj是否为null，因为路由离开editRole组件时会清除selectObj，导致缓存中该组件从vuex取值时selectObj为null.name报错
      return this.$store.getters['user/selectedObj'] ? this.$store.getters['user/selectedObj'].account : '';
    },
    selectedObj() {
      return this.$store.getters['user/selectedObj'];
    },
    selectedUserActions() {
      return this.$store.getters['user/selectedUserActions'];
    },
    operationRange() {
      return appsetting.operationRange;
    }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  methods: {
    mapToUserActionTempList() {
      //生成角色以及关系对象的列表
      let list = [];
      for (let action of this.actionList) {
        //查询关系对象
        const userAction = this.selectedUserActions.find((val) => val.actionId == action.id);
        const temp = extractProps(action, ['id', 'name', 'description', 'controllerTtl', 'actionTtl', 'httpMethod']);
        let item = {
          ...temp,
          operationRange: userAction != undefined ? userAction.operationRange : undefined, //特权操作范围
          isEnable: userAction != undefined ? userAction.isEnable : undefined //启用、禁用
        };
        list.push(item);
      }
      this.userActionTempList = list;
    },
    setSortChange(e) {
      this.$store.dispatch('action/setOrderBy', e);
      this.$store.dispatch('action/getDataList', this.index + 1);
    },
    isDisableOp(e) {
      if (e.isEnable == undefined || e.isEnable == false) {
        return true;
      } else {
        return false;
      }
    },
    setUserAction(item) {
      if (item.scope.row.isEnable == undefined) {
        this.$toast.show({ type: 'warning', text: '请设置特权' });
        return;
      }

      const dto = {
        isEnable: item.scope.row.isEnable
      };
      if (item.scope.row.operationRange != undefined) {
        dto.operationRange = item.scope.row.operationRange;
      }
      const actionId = item.scope.row.id;

      //判断是否有变化
      const temp = this.selectedUserActions.find((val) => {
        return val.actionId == actionId;
      });
      if (temp) {
        const pre = extractProps(temp, ['isEnable', 'operationRange']);
        if (equalObject(pre, dto)) {
          this.$toast.show({ type: 'warning', text: '已经保存' });
          return;
        }
      }

      //提交
      userAction
        .postData(this.id, actionId, dto, this)
        .then(() => {
          this.$store
            .dispatch('user/getSelectedUserActions')
            .then(() => {
              this.mapToUserActionTempList();
              this.$toast.show({ type: 'success', text: '设置成功' });
            })
            .catch(() => {
              this.$toast.show({ type: 'warning', text: '刷新失败' });
            });
        })
        .catch((error) => {
          const str = JSON.stringify(error.response.data);
          this.$toast.show({ type: 'danger', text: str });
        });
    },
    delUserAction(item) {
      if (item.scope.row.isEnable == undefined) {
        this.$toast.show({ type: 'warning', text: '无需清除' });
        return;
      }

      const actionId = item.scope.row.id;
      //判断是否存在该特权
      const temp = this.selectedUserActions.find((val) => {
        return val.actionId == actionId;
      });
      if (temp == undefined) {
        //清除本地设置
        let userAction = this.userActionTempList.find((val) => {
          return val.id == actionId;
        });
        userAction.isEnable = undefined;
        userAction.operationRange = undefined;

        this.$toast.show({ type: 'warning', text: '已经清除' });
        return;
      }

      userAction
        .deleteObj(this.id, actionId, this)
        .then(() => {
          this.$store
            .dispatch('user/getSelectedUserActions')
            .then(() => {
              this.mapToUserActionTempList();
              this.$toast.show({ type: 'success', text: '删除成功' });
            })
            .catch(() => {
              this.mapToUserActionTempList();
              this.$toast.show({ type: 'success', text: '删除成功' }); //全部删除后，404响应没找到，也是成功的
            });
        })
        .catch((error) => {
          let str = JSON.stringify(error.response.data);
          this.$toast.show({ type: 'danger', text: str });
        });
    },
    clear() {
      this.index = 0; //返回第一页
    }
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
        this.$store.dispatch('action/getDataList', current + 1).then(() => {
          this.mapToUserActionTempList();
        });
      }
    }
  },
  activated() {
    if (this.$route.meta.fromList) {
      // 角色列表变化较少，只需加载一次。每次进入组件时都要加载的是userRole关系对象
      if (this.actionList.length == 0) {
        //加载完成角色，再加载用户角色关系对象，同时执行两个请求会取消cancel前一个请求
        this.$store.dispatch('action/getDataList', 1).then(() => {
          this.$store
            .dispatch('user/getSelectedUserActions')
            .then(() => {
              this.mapToUserActionTempList();
            })
            .catch(() => {
              this.mapToUserActionTempList(); //不论是否有关系都要编辑
            });
        });
      } else {
        this.$store
          .dispatch('user/getSelectedUserActions')
          .then(() => {
            this.mapToUserActionTempList();
          })
          .catch(() => {
            this.mapToUserActionTempList();
          });
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    //不能直接通过this访问$store
    if (store.getters['user/selectedObj']) {
      let pages = ['userList', 'searchUserResult', 'userDetail'];
      if (pages.indexOf(from.name) > -1) {
        to.meta.fromList = true; //使用meta中变量标识是否从搜索控件跳转过来
      }
      next();
    } else {
      //导航到列表
      let currentNode = store.getters.siteNodes.find((val) => to.name == val.routeName);
      if (currentNode.substitutionTagSiteNodeId) {
        let subNode = store.getters.siteNodes.find((val) => val.id == currentNode.substitutionTagSiteNodeId); //获取当前节点的替代节点
        next({ name: subNode.routeName });
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    from.meta.fromList = false; //重置meta fromSearch设置

    let arr = ['userList'];
    // 如果离开到sysParameter之下的其他组件时，再访问edit时会重新dispatch对象，所有数据会重置，因此提示
    if (arr.find((i) => i.toLowerCase() == to.name.toLowerCase())) {
      this.$confirm({
        type: 'warning',
        content: '是否退出设置特权?',
        confirmTxt: '确认',
        cancelTxt: '取消'
      })
        .then(() => {
          this.clear();
          next();
        })
        .catch(() => {});
    }
    //
    else {
      next();
    }
  },
  components: {
    GridView,
    GridField,
    Pagination,
    Btn
  }
};
</script>

<style>
div.editUserActions {
  width: 100%;
  height: calc(100% - 40px);
}

div.editUserActions .workbench {
  height: calc(100% - 25px);
}

div.editUserActions div.workbench div.ttl {
  height: 30px;
  line-height: 30px;
  font-size: 15px;
  padding: 0px 10px;
}

div.editUserActions div.workbench div.ttl p span {
  color: var(--color-high-text);
  padding: 0px 5px;
}

div.editUserActions div.workbench .gridView {
  height: calc(100% - 30px);
}

div.editUserActions div.workbench .gridView .ctrl {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}

div.editUserActions div.workbench .gridView .ctrl > div.radio label {
  margin: 0px 3px;
  cursor: pointer;
}

div.editUserActions div.workbench .gridView .ctrl > div.btn {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  width: 40px;
}

div.editUserActions div.workbench .gridView .ctrl > div.btn button {
  width: 35px;
  height: 18px;
  line-height: 18px;
  margin: 1px 0px;
}

.editUserActions .bottomBar {
  display: flex;
  width: 100%;
  height: 25px;
  justify-content: space-between;
  background: #ebebeb;
}

.editUserActions .bottomBar .total {
  margin-right: 30px;
  line-height: 25px;
  font-size: 14px;
}
</style>
