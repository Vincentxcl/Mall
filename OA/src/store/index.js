import Vue from 'vue';
import Vuex from 'vuex';
import navigation from './navigation.js';
import user from './user.js';
import role from './role.js';
import sysParams from './sysParams.js';
import action from './action.js';

Vue.use(Vuex);

//模块
const modules = {
  navigation,
  user,
  role,
  sysParams,
  action
};

export default new Vuex.Store({
  modules
});
