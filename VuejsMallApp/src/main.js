
import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import Router from './router';
import store from './store';
import toast from './plugins/toast';

Vue.config.productionTip = true;
Vue.use(VueRouter);
Vue.use(toast);

new Vue({
  render: h => h(App),
  router: Router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
  //mounted() {
  //  console.log(this);
  //},
}).$mount('#app');
