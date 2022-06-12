import * as action from 'netWork/action.js';
import * as role from 'netWork/role.js';
import * as roleActions from 'netWork/roleAction.js';

import appsetting from 'config/appsettings.json';

export default {
  namespaced: true, //开启命名空间，使用'module/method'方式访问
  state: {
    _pageIndex: 0,
    _totalCount: 1, //总记录条数
    _pageCount: 1, //分页数量
    _dataList: [], //表数据
    _selection: [],
    _selectedObj: null, //待编辑的对象
    _readOnlySelectedObj: null, //待编辑的对象，只读，用于做patch document时,对比发生了什么变化
    _orderBy: [], //保存排序对象{prop:'num',order:'asc'}
    _roleList: [], //角色列表
    _selectedRoleActions: [] //当前角色和权限关系对象
  },
  getters: {
    pageIndex(state) {
      return state._pageIndex;
    },
    totalCount(state) {
      return state._totalCount;
    },
    pageCount(state) {
      return state._pageCount;
    },
    dataList(state) {
      return state._dataList;
    },
    selection(state) {
      return state._selection;
    },
    selectedObj(state) {
      return state._selectedObj;
    },
    readOnlySelectedObj(state) {
      return state._readOnlySelectedObj;
    },
    orderBy(state) {
      if (state._orderBy.Length == 0) {
        return '';
      }
      return state._orderBy
        .filter((item) => item.order != '') //取出有排序类型的对象
        .map((item) => item.prop + ' ' + item.order)
        .join(',');
    },
    roleList(state) {
      return state._roleList;
    },
    selectedRoleActions(state) {
      return state._selectedRoleActions;
    }
  },
  actions: {
    setOrderBy(context, payload) {
      let order = '';
      if (payload.order) {
        /^(asc|desc)\w+$/.exec(payload.order); //正则匹配挖字符
        order = RegExp.$1;
      }

      //判断数组中是否有该排序对象
      let obj = context.state._orderBy.find((item) => item.prop == payload.prop);
      //没有时，就追加
      if (!obj) {
        context.state._orderBy.push({ prop: payload.prop, order: order });
      }
      //存在时，就修改
      else {
        obj.order = order;
      }
    },
    getDataList(context, payload) {
      let queryObj = {
        pageIndex: payload,
        pageSize: appsetting.request.pageSize,
        orderBy: context.getters.orderBy == '' ? 'establish desc' : context.getters.orderBy //默认按照创建时间排序
      };

      action.requestData(queryObj, this._vm).then((res) => {
        //页码
        let page = JSON.parse(res.headers['x-pagination']);
        //提交
        context.commit('SetPageIndex', page.pageIndex - 1);
        context.commit('SetTotalCount', page.totalCount);
        context.commit('SetPageCount', page.pageCount);
        context.commit('SetDataList', res.data);
      });
    },
    setSelectedObj(context, payload) {
      context.commit('SetSelectedObj', payload);
      context.commit('SetReadOnlySelectedObj', payload);
    },
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
    SetPageIndex(state, payload) {
      state._pageIndex = payload;
    },
    SetTotalCount(state, payload) {
      state._totalCount = payload;
    },
    SetPageCount(state, payload) {
      state._pageCount = payload;
    },
    SetDataList(state, payload) {
      state._dataList = payload;
    },
    SetSelection(state, payLoad) {
      state._selection = payLoad;
    },
    SetSelectedObj(state, payload) {
      state._selectedObj = payload;
    },
    SetReadOnlySelectedObj(state, payload) {
      state._readOnlySelectedObj = payload;
    },
    SetRoleList(state, payload) {
      state._roleList = payload;
    },
    SetSelectedRoleActions(state, payload) {
      state._selectedRoleActions = payload;
    }
  }
};
