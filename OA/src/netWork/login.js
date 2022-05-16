import axios from 'axios';
import { getAjaxInstance } from 'common/helper/netWorkHelper.js';

let cancel; // 用于保存取消请求的函数
const ajax = getAjaxInstance('userManager');

// 添加请求拦截器
ajax.interceptors.request.use((config) => {
  // 准备发请求之前, 取消未完成的请求
  if (typeof cancel === 'function') {
    cancel(); // 取消请求
  }
  // 添加一个 cancelToken 配置
  config.cancelToken = new axios.CancelToken((func) => (cancel = func));
  return config;
});

// 响应拦截器
ajax.interceptors.response.use(
  (res) => {
    // 响应为200时做的事
    cancel = null;
    return res;
  },
  (error) => {
    // 响应不是2xx时做的事
    cancel = null;
    return Promise.reject(error);
  }
);

export function tryLogin(data) {
  return ajax({
    method: 'Post',
    url: 'authentication',
    headers: {
      'content-type': 'application/json'
    },
    data,
    params: {
      ver: '1.0'
    }
  });
}

export function logout() {
  return ajax({
    method: 'Delete',
    url: 'authentication',
    params: {
      ver: '1.0'
    }
  });
}
