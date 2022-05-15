export default {
  state: {
    _siteMap: {}, //导航地图
    _siteNodes: [], //导航菜单所有的节点
    _usedSiteNodes: [], //使用过的导航菜单节点
    _siteMenu: {}, //导航菜单
    _path: '',
    _isMenuCollapse: false
  },
  getters: {
    siteMap(state) {
      return state._siteMap;
    },
    siteNodes(state) {
      return state._siteNodes;
    },
    usedSiteNodes(state) {
      return state._usedSiteNodes;
    },
    siteMenu(state) {
      return state._siteMenu;
    },
    path(state) {
      return state._path;
    },
    isMenuCollapse(state) {
      return state._isMenuCollapse;
    }
  },
  actions: {},
  mutations: {
    //配置站点地图
    SetSiteMap(state, payLoad) {
      // 1.站点菜单
      state._siteMap = payLoad;
      // 2.解析出所有节点
      for (let item of payLoad.value) {
        addNode(item);
      }
      function addNode(obj) {
        state._siteNodes.push(obj);
        if (obj.children) {
          for (let item of obj.children.value) {
            addNode(item);
          }
        }
      }
    },
    //添加访问过的节点(后置路由守卫)
    AddUsedSiteNodes(state, payLoad) {
      let o = state._usedSiteNodes.find((val) => val.id == payLoad.id);
      if (!o) {
        state._usedSiteNodes.push(payLoad);
      }
    },
    //移除访问过的节点
    RemoveUsedSiteNode(state, payLoad) {
      state._usedSiteNodes.splice(payLoad, 1);
    },
    //配置站点菜单
    SetSiteMenu(state, payLoad) {
      state._siteMenu = payLoad;
    },
    //当前路径(后置路由守卫)
    SetCurrentPath(state, payLoad) {
      state._path = payLoad;
    },
    //设置菜单显示状态
    SetMenuCollapse(state, payLoad) {
      state._isMenuCollapse = payLoad;
    }
  }
};
