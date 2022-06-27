//当前使用的用户信息
import * as userinfo from 'netWork/userinfo.js';
import * as fileinfo from 'netWork/fileinfo.js';

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
      // 1.请求用户信息
      userinfo.requestItem(payload, this._vm).then((res) => {
        context.commit('SetUser', res.data);
        // 2.请求头像
        if (res.data.portrait) {
          fileinfo.requestFile(res.data.portrait, this._vm).then((res) => {
            if (res.headers['content-type'] == 'image/jpeg; ver=1.0') {
              const url = window.URL.createObjectURL(res.data);
              context.commit('SetPortraitUrl', url);
            }
          });
        }
      });
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
