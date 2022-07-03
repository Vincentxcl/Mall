//当前使用的用户信息
import * as userinfo from 'netWork/userinfo.js';
import * as fileinfo from 'netWork/fileinfo.js';
import appsettings from 'config/appsettings.json';

export default {
  namespaced: true, //开启命名空间，使用'module/method'方式访问
  state: {
    _user: {},
    _portraitUrl: ''
  },
  getters: {
    user(state) {
      return state._user;
    },
    portraitUrl(state) {
      return state._portraitUrl;
    }
  },
  actions: {
    getUser(context, payload) {
      return new Promise((resolve, reject) => {
        // 1.请求用户个人信息
        userinfo
          .requestItem(payload, this._vm)
          .then((res) => {
            context.commit('SetUser', res.data);

            // 2.请求用户头像，如果有头像，需请求完头像再进行下一步，以免同时请求多个导致cancel
            if (res.data.portrait) {
              fileinfo
                .requestFile(res.data.portrait, this._vm)
                .then((res) => {
                  resolve();
                  //匹配 image/jpeg; ver=1.0
                  new RegExp(/^(image\/\w+);\s.+$/g).exec(res.headers['content-type']);
                  //支持的格式
                  if (appsettings.portraitImgType.indexOf(RegExp.$1) > -1) {
                    const url = window.URL.createObjectURL(res.data);
                    context.commit('SetPortraitUrl', url);
                  }
                })
                .catch(() => {
                  this._vm.$toast.show({ type: 'warning', text: '用户头像加载失败' });
                  resolve();
                });
            } else {
              resolve();
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    clearUserInfo(context) {
      context.commit('SetUser', {});
      context.commit('SetPortraitUrl', '');
    }
  },
  mutations: {
    SetUser(state, payLoad) {
      state._user = payLoad;
    },
    SetPortraitUrl(state, payload) {
      state._portraitUrl = payload;
    }
  }
};
