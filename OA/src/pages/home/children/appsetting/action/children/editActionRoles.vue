<template>
  <div class="editActionRoles">
    <div class="workbench">
      <div class="grid">
        <div>
          <!-- 标题 -->
          <div class="ttl">
            <p>
              正在配置权限<span> {{ title }} </span>所对应的角色
            </p>
          </div>
          <!-- 角色列表 -->
          <div class="form">
            <template v-if="roleActionTempList.length > 0">
              <!-- role list -->
              <div v-for="rl in roleActionTempList" :key="rl.roleId" class="role">
                <label> <input type="checkbox" :disabled="rl.isDisabled" :value="rl.roleId" v-model="rl.isChecked" /> {{ rl.roleName }} </label>
                <!--operation range-->
                <div class="opRange">
                  <label v-for="op in operationRange" :key="op.value" :title="op.description">
                    {{ op.title }}
                    <input type="radio" :value="op.value" :name="rl.roleId" :disabled="rl.isDisabled || !rl.isChecked" v-model="rl.operationRange" />
                  </label>
                </div>
              </div>
            </template>
            <template v-else>
              <div>正在加载角色列表</div>
            </template>
          </div>
        </div>
      </div>
      <div class="ctrl">
        <div>
          <div class="message">{{ message }}</div>
          <btn type="brand" :isForbidden="isForbidden" @click="submit">保存</btn>
        </div>
        <div>
          <btn type="normal" @click="back">返回</btn>
        </div>
      </div>
    </div>
    <div class="assistance">
      <assistance-tool-bar :items="assistanceBarItems" @click="toolItemsClick"></assistance-tool-bar>
    </div>
  </div>
</template>

<script>
import store from 'store/index.js'; // import the store
import { computedAssistanceBarItems } from 'common/mixins/computedAssistanceBarItems';
import Btn from 'components/button/btn.vue';
import AssistanceToolBar from 'components/navigation/stl.v1/assistanceToolBar.vue';

import * as roleActions from 'netWork/roleAction.js';
import appsetting from 'config/appsettings.json';
import { extractProps, equalObject } from 'common/helper/convertHelper';

export default {
  name: 'EditActionRoles',
  mixins: [computedAssistanceBarItems],
  data() {
    return {
      roleActionTempList: [], //角色操作范围的列表
      message: '',
      isForbidden: false
    };
  },
  computed: {
    title() {
      //判断vuex中selectObj是否为null，因为路由离开editRole组件时会清除selectObj，导致缓存中该组件从vuex取值时selectObj为null.name报错
      return this.$store.getters['action/selectedObj'] ? this.$store.getters['action/selectedObj'].name : '';
    },
    selectedObj() {
      return this.$store.getters['action/selectedObj'];
    },
    roleList() {
      return this.$store.getters['action/roleList'];
    },
    selectedRoleActions() {
      return this.$store.getters['action/selectedRoleActions'];
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
    mapToRoleActionTempList() {
      //生成角色以及关系对象的列表
      let forbiddenRoleNames = ['Admin']; //Admin以及当前角色不可编辑 todo/////////////////////////////////
      let list = [];
      for (let rl of this.roleList) {
        //找关系对象
        let ra = this.selectedRoleActions.find((val) => val.roleId == rl.id);
        let item = {
          roleId: rl.id,
          roleName: rl.name,
          isDisabled: forbiddenRoleNames.find((val) => val == rl.name) != undefined, //未在列表中的角色为true，可选状态
          isChecked: ra != undefined, //找到了，说明存在该关系，反之
          operationRange: ra != undefined ? ra.operationRange : 0
        };
        list.push(item);
      }
      this.roleActionTempList = list;
    },
    toolItemsClick(e) {
      switch (e.id) {
        case 62131:
          {
            this.selectAll();
          }
          break;
        case 62132:
          {
            this.clearSelection();
          }
          break;
        default:
          break;
      }
    },
    selectAll() {
      this.roleActionTempList.forEach((el) => {
        el.isChecked = true;
      });
    },
    clearSelection() {
      let forbiddenRoleNames = ['Admin'];
      this.roleActionTempList.forEach((el) => {
        //不在禁止操作的角色列表中
        if (forbiddenRoleNames.find((val) => val == el.roleName) == undefined) {
          el.isChecked = false;
        }
      });
    },
    clear() {
      this.message = '';
      this.isForbidden = false;
      this.roleActionTempList = [];
    },
    back() {
      this.$router.push({
        name: 'actionList'
      });
    },
    equalObjectArr(arr1, arr2) {
      //如有一个为非数组
      if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        return false;
      }
      //如果数组长度不一样
      if (arr1.length !== arr2.length) return false;
      //判断值是否相同
      let count = arr1.length;
      for (let i = 0; i < count; i++) {
        let arr2Item = arr2.find((val) => val.roleId == arr1[i].roleId);
        //如果找不到对应的
        if (arr2Item == undefined) return false;
        //如果找到了，取出所需属性，避免带入__ob__
        const a = extractProps(arr1[i], ['roleId', 'operationRange']);
        const b = extractProps(arr2Item, ['roleId', 'operationRange']);
        if (!equalObject(a, b)) return false;
      }
      return true;
    },
    submit() {
      // 构建提交数据
      let ras = this.roleActionTempList
        .filter((i) => i.isChecked)
        .map((val) => {
          return {
            roleId: val.roleId,
            operationRange: val.operationRange
          };
        });

      //发生变化时提交
      if (!this.equalObjectArr(ras, this.selectedRoleActions)) {
        this.message = '正在提交数据';
        this.isForbidden = true;
        roleActions
          .postData(this.id, ras, this)
          .then(() => {
            this.message = '';
            this.isForbidden = false;
            //刷新
            this.$store
              .dispatch('action/getSelectedRoleActions')
              .then(() => {
                this.$toast.show({ type: 'success', text: '设置成功' });
              })
              .catch(() => {});
          })
          .catch((error) => {
            let str = JSON.stringify(error.response.data);
            this.message = str;
          });
      } else {
        this.message = '已保存';
      }
    }
  },
  activated() {
    if (this.$route.meta.fromList) {
      // 角色列表变化较少，只需加载一次。每次进入组件时都要加载的是actionRole关系对象
      if (this.roleList.length == 0) {
        //加载完成角色，再加载角色权限关系对象，同时执行两个请求会取消cancel前一个请求
        this.$store.dispatch('action/getRoleList').then(() => {
          this.$store
            .dispatch('action/getSelectedRoleActions')
            .then(() => {
              this.mapToRoleActionTempList();
            })
            .catch(() => {
              this.mapToRoleActionTempList(); //不论是否有关系都要编辑
            });
        });
      } else {
        this.$store
          .dispatch('action/getSelectedRoleActions')
          .then(() => {
            this.mapToRoleActionTempList();
          })
          .catch(() => {
            this.mapToRoleActionTempList();
          });
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    //不能直接通过this访问$store
    if (store.getters['action/selectedObj']) {
      let pages = ['actionList', 'searchActionResult', 'actionDetail'];
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

    let arr = ['actionList'];
    // 如果离开到sysParameter之下的其他组件时，再访问edit时会重新dispatch对象，所有数据会重置，因此提示
    if (arr.find((i) => i.toLowerCase() == to.name.toLowerCase())) {
      this.$confirm({
        type: 'warning',
        content: '是否退出设置角色?',
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
    Btn,
    AssistanceToolBar
  }
};
</script>

<style>
div.editActionRoles {
  height: calc(100% - 40px);
}

div.editActionRoles div.workbench {
  height: calc(100% - 25px);
  overflow: auto;
}

div.editActionRoles div.grid {
  padding: 10px;
  font-size: 14px;
}

div.editActionRoles div.grid > div {
  border: 1px solid rgb(226, 226, 226);
  border-radius: 5px;
}

div.editActionRoles div.grid div.ttl {
  font-size: 15px;
  padding: 10px 20px;
  border-bottom: 1px solid rgb(226, 226, 226);
}

div.editActionRoles div.grid div.ttl p span {
  color: var(--color-high-text);
  padding: 0px 5px;
}

div.editActionRoles div.form {
  display: grid;
  grid-template-columns: repeat(auto-fill, 350px);
}

div.editActionRoles div.form .role {
  width: 350px;
  height: 40px;
  line-height: 40px;
  padding: 0px 15px;
}

div.editActionRoles div.form .role > label {
  display: inline-block;
  width: 100px;
}

div.editActionRoles div.form .role .opRange {
  display: inline-block;
  width: 220px;
  text-align: center;
}

div.editActionRoles div.form .role .opRange > label {
  margin: 0px 3px;
  cursor: pointer;
}

div.editActionRoles div.ctrl {
  display: flex;
  margin-bottom: 10px;
}

div.editActionRoles div.ctrl > div {
  width: 50%;
}

div.editActionRoles div.ctrl > div:first-child {
  display: flex;
  justify-content: flex-end;
}

div.editActionRoles div.ctrl button {
  margin: 0px 5px;
}

div.editActionRoles div.ctrl button.isForbidden {
  cursor: not-allowed;
}

div.editActionRoles div.message {
  height: 30px;
  line-height: 30px;
  color: var(--color-danger);
}

div.editActionRoles div.assistance {
  display: flex;
  background: #ebebeb;
  width: 100%;
  min-width: 600px;
  height: 25px;
}
</style>
