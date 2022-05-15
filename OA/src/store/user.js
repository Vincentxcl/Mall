export default {
  state: {
    _account: ''
  },
  getters: {
    account(state) {
      return state._account;
    }
  },
  actions: {},
  mutations: {
    //配置站点菜单
    SetAccount(state, payLoad) {
      state._account = payLoad;
    }
  }
};
