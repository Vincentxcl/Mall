import Vue from 'vue';
import Vuex from 'vuex';
import navigation from './navigation.js';
import user from './user.js';
import sysParameter from './sysParameter.js';

Vue.use(Vuex);

//模块
const modules = {
  navigation,
  user,
  sysParameter
};

export default new Vuex.Store({
  modules
});
