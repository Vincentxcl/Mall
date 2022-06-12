<template>
  <div class="editActionRoles">
    <div class="workbench">
      <div class="grid">
        <table>
          <tr>
            <td colspan="2">
              <p class="ttl">
                正在配置权限
                <span>
                  {{ selectedObj.name }}
                </span>
                所对应的角色
              </p>
            </td>
          </tr>
          <tr>
            <td>角色</td>
            <td>
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
            </td>
          </tr>
        </table>
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
import { computedAssistanceBarItems } from 'common/mixins/computedAssistanceBarItems';
import { beforeRouteEnter_goto } from './mixins/beforeRouteEnter_goto';
import Btn from 'components/button/btn.vue';
import AssistanceToolBar from 'components/navigation/stl.v1/assistanceToolBar.vue';

import * as roleActions from 'netWork/roleAction.js';
import appsetting from 'config/appsettings.json';
import { extractProps, equalObject } from 'common/helper/convertHelper';

export default {
  name: 'EditActionRoles',
  mixins: [computedAssistanceBarItems, beforeRouteEnter_goto],
  data() {
    return {
      roleActionTempList: [], //角色操作范围的列表
      message: '',
      isForbidden: false
    };
  },
  computed: {
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
  methods: {
    mapToRoleActionTempList() {
      //生成角色以及关系对象的列表
      let roles = ['Admin']; //Admin以及当前角色不可编辑 todo/////////////////////////////////
      let list = [];
      for (let rl of this.roleList) {
        //找关系对象
        let ra = this.selectedRoleActions.find((val) => val.roleId == rl.id);
        let item = {
          roleId: rl.id,
          roleName: rl.name,
          isDisabled: roles.find((val) => val == rl.name) != undefined, //未在列表中的角色为true，可选状态
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
      this.roleActionTempList = [];
    },
    back() {
      this.clear();
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
          .postData(this.selectedObj.id, ras)
          .then(() => {
            this.message = '';
            this.isForbidden = false;
            //刷新
            this.$store.dispatch('action/getSelectedRoleActions').then(() => {
              this.$toast.show({ type: 'success', text: '设置成功' });
            });
          })
          .catch((error) => {
            let str = JSON.stringify(error.response.data);
            this.message = str;
          });
      }
    }
  },
  activated() {
    // 角色列表变化较少，只需加载一次。每次进入组件时都要加载的是actionRole关系对象
    if (this.roleList.length == 0) {
      //加载完成角色，再加载角色权限关系对象，同时执行两个请求会取消cancel前一个请求
      this.$store.dispatch('action/getRoleList').then(() => {
        this.$store.dispatch('action/getSelectedRoleActions').then(() => {
          this.mapToRoleActionTempList();
        });
      });
    } else {
      this.$store.dispatch('action/getSelectedRoleActions').then(() => {
        this.mapToRoleActionTempList();
      });
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

/* #region table圆角 */
div.editActionRoles table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

div.editActionRoles table td {
  border: 1px solid rgb(226, 226, 226);
  border-left: none;
  border-bottom: none;
  padding: 5px 10px;
}

div.editActionRoles table tr:first-child td:first-child {
  border-top-left-radius: 5px; /* 设置table左下圆角 */
}

div.editActionRoles table tr:first-child td:last-child {
  border-top-right-radius: 5px; /* 设置table右下圆角 */
}

div.editActionRoles table tr:last-child td:first-child {
  border-bottom-left-radius: 5px; /* 设置table左下圆角 */
}

div.editActionRoles table tr:last-child td:last-child {
  border-bottom-right-radius: 5px; /* 设置table右下圆角 */
}

div.editActionRoles table tr td:first-child {
  border-left: 1px solid rgb(226, 226, 226);
}

div.editActionRoles table tr:last-child td {
  border-bottom: 1px solid rgb(226, 226, 226);
}
/* #endregion */

div.editActionRoles table tr td p.ttl {
  font-size: 16px;
  text-align: left;
  margin: 10px auto 10px 10px;
}

div.editActionRoles table tr td p.ttl span {
  color: var(--color-high-text);
  padding: 0px 5px;
}

div.editActionRoles table tr td:first-child {
  width: 100px;
  text-align: center;
}

div.editActionRoles table .role {
  height: 30px;
  line-height: 30px;
  margin: 0px 8px;
}

div.editActionRoles table tr td .role > label {
  display: inline-block;
  width: 120px;
}

div.editActionRoles table .role .opRange {
  display: inline-block;
}

div.editActionRoles table .role .opRange > label {
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
