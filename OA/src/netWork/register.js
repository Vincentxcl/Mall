// 专用于注册请求，不带令牌
import axios from 'axios';
import { getAjaxInstance } from 'common/helper/netWorkHelper.js';

let cancel; // 用于保存取消请求的函数
const ajax = getAjaxInstance('userManager');

// 添加请求拦截器
ajax.interceptors.request.use(
  (config) => {
    // 准备发请求之前, 取消未完成的请求
    if (typeof cancel === 'function') {
      cancel(); // 取消请求
    }
    // 添加一个 cancelToken 配置
    config.cancelToken = new axios.CancelToken((func) => (cancel = func));
    return config;
  },
  (error) => {
    //请求未成功时做的事
    return Promise.reject(error);
  }
);

// 响应拦截器
ajax.interceptors.response.use(
  (res) => {
    // 响应为200时做的事
    cancel = null;
    return res;
  },
  (error) => {
    // 响应不是2xx时做的事
    // cancel = null;//特别注意:响应不成功时不要取消，否则会自我放行，出现间隔一次又发出请求的特殊情况，比如连续10次请求，有5次成功发出
    return Promise.reject(error);
  }
);

export function requestData(queryObj) {
  if (typeof queryObj != 'object') {
    throw new Error('In the function requestData, a parameter queryObj must be a object, but got a error type ' + typeof queryObj);
  }

  // 构建查询参数对象
  let params = {
    ver: '1.0'
  };

  let props = ['email', 'phone', 'fields'];
  for (let prop of props) {
    if (Reflect.get(queryObj, prop) != undefined) {
      params[prop] = Reflect.get(queryObj, prop);
    }
  }

  return ajax({
    method: 'get',
    url: 'userinfos',
    headers: {
      Accept: 'application/json'
    },
    params: params
  });
}

//新用户注册专用，不需要token
export function postData(data) {
  return ajax({
    method: 'Post',
    url: 'userinfo',
    headers: {
      'content-type': 'application/json'
    },
    data,
    params: {
      ver: '2.0' // 注册用的接口版本
    }
  });
}
