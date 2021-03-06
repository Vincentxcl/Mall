import Vue from 'vue';
import Vuex from 'vuex';
import current from './current.js';
import navigation from './navigation.js';
import user from './user.js';
import role from './role.js';
import sysParams from './sysParams.js';
import action from './action.js';
import fileServer from './fileServer.js';
import fileType from './fileType.js';

Vue.use(Vuex);

//模块
const modules = {
  current,
  navigation,
  user,
  role,
  sysParams,
  action,
  fileServer,
  fileType
};

export default new Vuex.Store({
  modules
});
