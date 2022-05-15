import Vue from 'vue';
import Vuex from 'vuex';
import navigation from './navigation.js';

Vue.use(Vuex);

//模块
const modules = {
  navigation
};

export default new Vuex.Store({
  modules
});
