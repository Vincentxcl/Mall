import * as base from 'common/store/baseModule.js';
import * as fileServer from 'netWork/fileServer.js';
import appsettings from 'config/appsettings.json';

export default {
  namespaced: true, //开启命名空间，使用'module/method'方式访问
  state: {
    ...new base.stateModule()
  },
  getters: {
    ...new base.gettersModule()
  },
  actions: {
    ...new base.actionsModules(appsettings, fileServer)
  },
  mutations: {
    ...new base.mutationsModule()
  }
};
