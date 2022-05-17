//网络请求工具
import axios from 'axios';
import { configs } from './configHelper';
import { tryGetToken } from './tokenHelper.js';

let cancel; // 用于保存取消请求的函数

// 使用appsetting的配置,返回axios的实例
export function getAjaxInstance(ttl) {
  return axios.create(configs(ttl));
}

// 使用appsetting的配置,以及默认拦截器,返回axios的实例
// ttl 网络连接配置key
// app vm
export function getAjaxInstanceWithDefaultInterceptor(ttl, app) {
  let ajaxInstance = axios.create(configs(ttl));

  // 请求拦截器
  ajaxInstance.interceptors.request.use(
    (config) => {
      // 1.发请求之前, 取消未完成的请求
      if (typeof cancel === 'function') {
        cancel(); // 取消请求
      }
      // 添加一个 cancelToken 配置
      config.cancelToken = new axios.CancelToken((func) => (cancel = func));

      // 2.添加令牌
      tryGetToken('userAuth')
        .then((res) => {
          config.headers.Authorization = 'Bearer ' + res;
        })
        .catch((error) => {
          // 获取令牌失败时，取消请求
          if (typeof cancel === 'function') {
            cancel(); // 取消请求
          }
          app.$toast.show({ type: 'warning', text: error.response.status + '错误，登陆验证失效，请重新<a href="/login">登陆</a>' });
        });

      return config;
    },
    (error) => {
      //请求未成功时做的事
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  ajaxInstance.interceptors.response.use(
    (res) => {
      // 响应为200时做的事
      cancel = null;
      return res;
    },
    (error) => {
      // 响应不是2xx时做的事
      cancel = null;
      let str = JSON.stringify(error.response.data.errors);
      app.$toast.show({ type: 'warning', text: error.response.status + '错误' + str });
      return Promise.reject(error);
    }
  );

  return ajaxInstance;
}

// 自定义配置axios实例
export function buildAjax(baseSet) {
  return axios.create(baseSet);
}
