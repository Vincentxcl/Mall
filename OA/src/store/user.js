import * as base from 'common/store/baseModule.js';
import * as userinfo from 'netWork/userinfo.js';
import * as role from 'netWork/role.js';
import * as userRole from 'netWork/userRole.js';
import * as userAction from 'netWork/userAction.js';
import appsettings from 'config/appsettings.json';

export default {
  namespaced: true, //开启命名空间，使用'module/method'方式访问
  state: {
    ...new base.stateModule(),
    _roleList: [], //角色列表
    _selectedUserRoles: [],
    _selectedUserActions: []
  },
  getters: {
    ...new base.gettersModule(),
    roleList(state) {
      return state._roleList;
    },
    selectedUserRoles(state) {
      return state._selectedUserRoles;
    },
    selectedUserActions(state) {
      return state._selectedUserActions;
    }
  },
  actions: {
    ...new base.actionsModules(appsettings, userinfo),
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
    getSelectedUserRoles(context) {
      // 加载权限对应的角色
      let current = this.getters['user/selectedObj'];
      if (current) {
        return new Promise((resolve, reject) => {
          userRole
            .requestDataByUserId(current.id, this._vm)
            .then((res) => {
              //转换为该权限对应的 角色操作范围简化对象
              let selectedUserRoles = res.data.map((i) => {
                return {
                  roleId: i.roleId
                };
              });
              context.commit('SetSelectedUserRoles', selectedUserRoles);
              //
              resolve(selectedUserRoles);
            })
            .catch((error) => {
              context.commit('SetSelectedUserRoles', []);
              if (error.response.status == 404) {
                this._vm.$toast.show({ type: 'warning', text: '该用户并无任何角色' });
              } else {
                this._vm.$toast.show({ type: 'danger', text: '请求用户的角色失败' });
              }
              //
              reject();
            });
        });
      }
    },
    getSelectedUserActions(context) {
      // 加载权限对应的角色
      let current = this.getters['user/selectedObj'];
      if (current) {
        return new Promise((resolve, reject) => {
          userAction
            .requestDataByUserId(current.id, this._vm)
            .then((res) => {
              //转换为简化对象
              let selectedUserActions = res.data.map((i) => {
                return {
                  actionId: i.actionId,
                  operationRange: i.operationRange,
                  isEnable: i.isEnable
                };
              });
              context.commit('SetSelectedUserActions', selectedUserActions);
              //
              resolve(selectedUserActions);
            })
            .catch((error) => {
              context.commit('SetSelectedUserActions', []);
              if (error.response.status == 404) {
                this._vm.$toast.show({ type: 'warning', text: '该用户并无任何特权' });
              } else {
                this._vm.$toast.show({ type: 'danger', text: '请求用户的特权失败' });
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
    SetSelectedUserRoles(state, payload) {
      state._selectedUserRoles = payload;
    },
    SetSelectedUserActions(state, payload) {
      state._selectedUserActions = payload;
    }
  }
};
