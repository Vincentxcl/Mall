import * as base from 'common/store/baseModule.js';
import * as action from 'netWork/action.js';
import * as role from 'netWork/role.js';
import * as roleActions from 'netWork/roleAction.js';
import appsettings from 'config/appsettings.json';

export default {
  namespaced: true, //开启命名空间，使用'module/method'方式访问
  state: {
    ...new base.stateModule(),
    _roleList: [], //角色列表
    _selectedRoleActions: [] //当前角色和权限关系对象
  },
  getters: {
    ...new base.gettersModule(),
    roleList(state) {
      return state._roleList;
    },
    selectedRoleActions(state) {
      return state._selectedRoleActions;
    }
  },
  actions: {
    ...new base.actionsModules(appsettings, action),
    getRoleList(context) {
      return new Promise((resolve, reject) => {
        // 1.加载角色列表
        role
          .requestAllData(this._vm)
          .then((res) => {
            let roleList = res.data.sort((a, b) => {
              if (a.establish > b.establish) return -1;
              else if (a.establish < b.establish) return 1;
              else return 0;
            });
            context.commit('SetRoleList', roleList);
            //
            resolve(roleList);
          })
          .catch(() => {
            this._vm.$toast.show({ type: 'danger', text: '请求角色列表失败' });
            //
            reject();
          });
      });
    },
    getSelectedRoleActions(context) {
      // 加载权限对应的角色
      let current = this.getters['action/selectedObj'];
      if (current) {
        return new Promise((resolve, reject) => {
          roleActions
            .requestDataByActionId(current.id)
            .then((res) => {
              //转换为该权限对应的 角色操作范围简化对象
              let selectedRoleActions = res.data.map((i) => {
                return {
                  roleId: i.roleId,
                  operationRange: i.operationRange
                };
              });
              context.commit('SetSelectedRoleActions', selectedRoleActions);
              //
              resolve(selectedRoleActions);
            })
            .catch((error) => {
              if (error.response.status == 404) {
                this.$toast.show({ type: 'warning', text: '并无任何角色有该权限' });
              } else {
                this.$toast.show({ type: 'danger', text: '请求权限对应角色失败' });
              }
              //
              reject();
            });
        });
      }
    }
  },
  mutations: {
    ...new base.mutationsModule(),
    SetRoleList(state, payload) {
      state._roleList = payload;
    },
    SetSelectedRoleActions(state, payload) {
      state._selectedRoleActions = payload;
    }
  }
};
