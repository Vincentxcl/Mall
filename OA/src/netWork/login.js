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

// 添加响应拦截器
ajax.interceptors.response.use(
  (response) => {
    cancel = null;
    return response;
  }
  // (error) => {
  //   if (axios.isCancel(error)) {
  //     // 取消请求的错误
  //     console.log('请求取消的错误', error.message); // 做出相应的处理
  //     // 中断 promise 链接
  //     return new Promise(() => {});
  //   }
  //   // 请求出错了
  //   else {
  //     cancel = null;
  //     // 将错误向下传递
  //     // throw error
  //     return Promise.reject(error);
  //   }
  // }
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
