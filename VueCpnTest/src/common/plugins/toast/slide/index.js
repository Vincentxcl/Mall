// 滑动提示窗
// 使用show({})方法将消息入队

import Toast from './toastSets.vue';

export default {
  install(vue) {
    const toastCtor = vue.extend(Toast);
    const toast = new toastCtor().$mount(document.createElement('div'));
    document.body.appendChild(toast.$el); //将生成的标签追加到body中
    vue.prototype.$toast = toast; //在vue的原型链上添加一个属性为toast实例对象
  }
};
