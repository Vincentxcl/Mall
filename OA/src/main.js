import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import Router from './router/index.js';
import store from './store/index.js';

import { Table, TableColumn } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import Toast from 'common/plugins/toast/slide/index.js';
import Mask from 'common/plugins/mask/index.js';
import Confirm from 'common/plugins/confirm/index.js';
import { realSrc } from 'common/directives/realSrc.js';

Vue.config.productionTip = true;

Vue.use(VueRouter);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Toast);
Vue.use(Mask);
Vue.use(Confirm);

Vue.directive('realSrc', realSrc);

new Vue({
  render: (h) => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
  router: Router,
  store
}).$mount('#app');
