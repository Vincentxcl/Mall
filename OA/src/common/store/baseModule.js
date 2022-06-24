//Vuex crud模板

export function stateModule() {
  this._pageIndex = 0;
  this._totalCount = 1; //总记录条数
  this._pageCount = 1; //分页数量
  this._dataList = []; //表数据
  this._selection = [];
  this._selectedObj = null; //待编辑的对象
  this._readOnlySelectedObj = null; //待编辑的对象，只读，用于做patch document时,对比发生了什么变化
  this._orderBy = []; //保存排序对象{prop:'num',order:'asc'}
}

export function gettersModule() {
  this.pageIndex = function (state) {
    return state._pageIndex;
  };
  this.totalCount = function (state) {
    return state._totalCount;
  };
  this.pageCount = function (state) {
    return state._pageCount;
  };
  this.dataList = function (state) {
    return state._dataList;
  };
  this.selection = function (state) {
    return state._selection;
  };
  this.selectedObj = function (state) {
    return state._selectedObj;
  };
  this.readOnlySelectedObj = function (state) {
    return state._readOnlySelectedObj;
  };
  this.orderBy = function (state) {
    if (state._orderBy.Length == 0) {
      return '';
    }
    return state._orderBy
      .filter((item) => item.order != '') //取出有排序类型的对象
      .map((item) => item.prop + ' ' + item.order)
      .join(',');
  };
}

export function actionsModules(appsettings, netWork) {
  this.setOrderBy = function (context, payload) {
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
  };
  this.getDataList = function (context, payload) {
    let queryObj = {
      pageIndex: payload,
      pageSize: appsettings.request.pageSize,
      orderBy: context.getters.orderBy == '' ? 'establish desc' : context.getters.orderBy //默认按照创建时间排序
    };

    netWork.requestData(queryObj, this._vm).then((res) => {
      //页码
      let page = JSON.parse(res.headers['x-pagination']);
      //提交
      context.commit('SetPageIndex', page.pageIndex - 1);
      context.commit('SetTotalCount', page.totalCount);
      context.commit('SetPageCount', page.pageCount);
      context.commit('SetDataList', res.data);
    });
  };
  this.setSelectedObj = function (context, payload) {
    context.commit('SetSelectedObj', payload);
    context.commit('SetReadOnlySelectedObj', payload);
  };
}

export function mutationsModule() {
  this.SetPageIndex = function (state, payload) {
    state._pageIndex = payload;
  };
  this.SetTotalCount = function (state, payload) {
    state._totalCount = payload;
  };
  this.SetPageCount = function (state, payload) {
    state._pageCount = payload;
  };
  this.SetDataList = function (state, payload) {
    state._dataList = payload;
  };
  this.SetSelection = function (state, payLoad) {
    state._selection = payLoad;
  };
  this.SetSelectedObj = function (state, payload) {
    state._selectedObj = payload;
  };
  this.SetReadOnlySelectedObj = function (state, payload) {
    state._readOnlySelectedObj = payload;
  };
}
