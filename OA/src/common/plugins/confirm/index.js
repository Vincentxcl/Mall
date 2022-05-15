import Confirm from './confirm.vue';

export default {
  install(vue) {
    //创建组件的实例
    const ctor = vue.extend(Confirm);
    const instance = new ctor().$mount(document.createElement('div'));
    document.body.appendChild(instance.$el);
    //原型链
    vue.prototype.$confirm = function (options) {
      return instance.show(options);
    };
  }
};
