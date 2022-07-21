<template>
  <div class="editUserRoles">
    <div class="workbench">
      <div class="grid">
        <div>
          <!-- 标题 -->
          <div class="ttl">
            <p>
              正在配置用户<span> {{ title }} </span>所对应的角色
            </p>
          </div>
          <!-- 角色列表 -->
          <div class="form">
            <template v-if="userRoleTempList.length > 0">
              <!-- role list -->
              <div v-for="rl in userRoleTempList" :key="rl.roleId" class="role">
                <label> <input type="checkbox" :disabled="rl.isDisabled" :value="rl.roleId" v-model="rl.isChecked" /> {{ rl.roleName }} </label>
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

import * as userRole from 'netWork/userRole.js';

export default {
  name: 'EditUserRoles',
  mixins: [computedAssistanceBarItems],
  data() {
    return {
      userRoleTempList: [], //角色的列表
      message: '',
      isForbidden: false
    };
  },
  computed: {
    title() {
      //判断vuex中selectObj是否为null，因为路由离开editRole组件时会清除selectObj，导致缓存中该组件从vuex取值时selectObj为null.name报错
      return this.$store.getters['user/selectedObj'] ? this.$store.getters['user/selectedObj'].account : '';
    },
    selectedObj() {
      return this.$store.getters['user/selectedObj'];
    },
    roleList() {
      return this.$store.getters['user/roleList'];
    },
    selectedUserRoles() {
      return this.$store.getters['user/selectedUserRoles'];
    }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  methods: {
    mapToUserRoleTempList() {
      //生成角色以及关系对象的列表
      let forbiddenRoleNames = []; //不可编辑的角色比如 ['材料员']
      let list = [];
      for (let rl of this.roleList) {
        //找关系对象
        let item = {
          roleId: rl.id,
          roleName: rl.name,
          isDisabled: forbiddenRoleNames.find((val) => val == rl.name) != undefined, //未在列表中的角色为true，可选状态
          isChecked: this.selectedUserRoles.find((val) => val.roleId == rl.id) != undefined //找到了，说明存在该关系，反之
        };
        list.push(item);
      }
      this.userRoleTempList = list;
    },
    toolItemsClick(e) {
      switch (e.id) {
        case 51121:
          {
            this.selectAll();
          }
          break;
        case 51122:
          {
            this.clearSelection();
          }
          break;
        default:
          break;
      }
    },
    selectAll() {
      this.userRoleTempList.forEach((el) => {
        el.isChecked = true;
      });
    },
    clearSelection() {
      let forbiddenRoleNames = [];
      this.userRoleTempList.forEach((el) => {
        //不在禁止操作的角色列表中
        if (forbiddenRoleNames.find((val) => val == el.roleName) == undefined) {
          el.isChecked = false;
        }
      });
    },
    clear() {
      this.message = '';
      this.isForbidden = false;
      this.userRoleTempList = [];
    },
    back() {
      this.$router.push({
        name: 'userList'
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
      }
      return true;
    },
    submit() {
      // 构建提交数据
      let urs = this.userRoleTempList
        .filter((i) => i.isChecked)
        .map((val) => {
          return {
            roleId: val.roleId
          };
        });

      //发生变化时提交
      if (!this.equalObjectArr(urs, this.selectedUserRoles)) {
        this.message = '正在提交数据';
        this.isForbidden = true;
        userRole
          .postData(this.id, urs, this)
          .then(() => {
            this.message = '';
            this.isForbidden = false;
            //刷新
            this.$store
              .dispatch('user/getSelectedUserRoles')
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
      // 角色列表变化较少，只需加载一次。每次进入组件时都要加载的是userRole关系对象
      if (this.roleList.length == 0) {
        //加载完成角色，再加载用户角色关系对象，同时执行两个请求会取消cancel前一个请求
        this.$store.dispatch('user/getRoleList').then(() => {
          this.$store
            .dispatch('user/getSelectedUserRoles')
            .then(() => {
              this.mapToUserRoleTempList();
            })
            .catch(() => {
              this.mapToUserRoleTempList(); //不论是否有关系都要编辑
            });
        });
      } else {
        this.$store
          .dispatch('user/getSelectedUserRoles')
          .then(() => {
            this.mapToUserRoleTempList();
          })
          .catch(() => {
            this.mapToUserRoleTempList();
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
div.editUserRoles {
  height: calc(100% - 40px);
}

div.editUserRoles div.workbench {
  height: calc(100% - 25px);
  overflow: auto;
}

div.editUserRoles div.grid {
  padding: 10px;
  font-size: 14px;
}

div.editUserRoles div.grid > div {
  border: 1px solid rgb(226, 226, 226);
  border-radius: 5px;
}

div.editUserRoles div.grid div.ttl {
  font-size: 15px;
  padding: 10px 20px;
  border-bottom: 1px solid rgb(226, 226, 226);
}

div.editUserRoles div.grid div.ttl p span {
  color: var(--color-high-text);
  padding: 0px 5px;
}

div.editUserRoles div.form {
  display: grid;
  grid-template-columns: repeat(auto-fill, 120px);
}

div.editUserRoles div.form .role {
  width: 120px;
  height: 40px;
  line-height: 40px;
  padding: 0px 10px;
}

div.editUserRoles div.ctrl {
  display: flex;
  margin-bottom: 10px;
}

div.editUserRoles div.ctrl > div {
  width: 50%;
}

div.editUserRoles div.ctrl > div:first-child {
  display: flex;
  justify-content: flex-end;
}

div.editUserRoles div.ctrl button {
  margin: 0px 5px;
}

div.editUserRoles div.ctrl button.isForbidden {
  cursor: not-allowed;
}

div.editUserRoles div.message {
  height: 30px;
  line-height: 30px;
  color: var(--color-danger);
}

div.editUserRoles div.assistance {
  display: flex;
  background: #ebebeb;
  width: 100%;
  min-width: 600px;
  height: 25px;
}
</style>

