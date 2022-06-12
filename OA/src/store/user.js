import * as appSetting from 'netWork/userinfo.js';
import appsettings from 'config/appsettings.json';

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
    _account: '' ////////////////////////TODO
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
    /////////////////////////
    account(state) {
      return state._account;
    }
  },
  actions: {
    getDataList(context, payload) {
      let queryObj = {
        pageIndex: payload,
        pageSize: appsettings.request.pageSize,
        orderBy: 'establish desc'
      };

      appSetting.requestData(queryObj, this._vm).then((res) => {
        //数据 及排序
        let json = res.data.sort((a, b) => {
          if (a.establish > b.establish) return -1;
          else if (a.establish < b.establish) return 1;
          else return 0;
        });
        //页码
        let page = JSON.parse(res.headers['x-pagination']);
        //提交
        context.commit('SetPageIndex', page.pageIndex - 1);
        context.commit('SetTotalCount', page.totalCount);
        context.commit('SetPageCount', page.pageCount);
        context.commit('SetDataList', json);
      });
    },
    setSelectedObj(context, payload) {
      context.commit('SetSelectedObj', payload);
      context.commit('SetReadOnlySelectedObj', payload);
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
    ////////////////////////配置站点
    SetAccount(state, payLoad) {
      state._account = payLoad;
    }
  }
};
