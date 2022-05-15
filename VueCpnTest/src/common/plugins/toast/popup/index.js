import Toast from './toast.vue';

export default {
  install(vue) {
    const toastCtor = vue.extend(Toast);//生成组件的构造函数
    const toast = new toastCtor().$mount(document.createElement("div"));//将组件的实例对象挂载到dom对象上，挂载后才有对象
    document.body.appendChild(toast.$el);//将生成的标签追加到body中
    vue.prototype.$toast = toast;//在vue的原型链上添加一个属性为toast实例对象
  },
}
