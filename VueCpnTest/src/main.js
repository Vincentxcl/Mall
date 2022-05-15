import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import Router from './router/index.js';
import store from './store/Index.js';

import Mask from 'common/plugins/mask/index.js';
import Confirm from 'common/plugins/confirm/index.js';
import Toast from 'common/plugins/toast/slide/index.js';

Vue.config.productionTip = true;

Vue.use(VueRouter);
Vue.use(Mask);
Vue.use(Confirm);
Vue.use(Toast);

new Vue({
  render: (h) => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
  router: Router,
  store
}).$mount('#app');
