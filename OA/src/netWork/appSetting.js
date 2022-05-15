import axios from 'axios';
import { getAjaxInstance } from 'common/helper/netWorkHelper.js';
import { tryGetToken } from 'common/helper/tokenHelper.js';

let app;
let cancel; // 用于保存取消请求的函数
const ajax = getAjaxInstance('userManager');

// 添加请求拦截器
ajax.interceptors.request.use(
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
ajax.interceptors.response.use(
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

export function requestData(queryObj, vm) {
  if (typeof queryObj != 'object') {
    throw new Error('In the function requestData, a parameter queryObj must be a objcet, but got a error type' + typeof queryObj);
  }

  app = vm;
  //构建查询参数
  let props = ['id', 'setting', 'search', 'pageIndex', 'pageSize', 'orderBy', 'fields'];
  let params = {
    ver: '1.0'
  };
  for (let prop of props) {
    if (Reflect.get(queryObj, prop) != undefined) {
      params[prop] = Reflect.get(queryObj, prop);
    }
  }
  return ajax({
    method: 'get',
    url: 'appsetting',
    headers: {
      Accept: 'application/json'
    },
    params: params
  });
}

export function requestItem(id, vm) {
  app = vm;
  return ajax({
    method: 'get',
    url: 'appsetting/' + id,
    headers: {
      Accept: 'application/json'
    },
    params: {
      ver: '1.0'
    }
  });
}

export function postData(dto, vm) {
  app = vm;
  return ajax({
    method: 'post',
    url: 'appsetting',
    headers: {
      'content-type': 'application/json'
    },
    data: dto,
    params: {
      ver: '1.0'
    }
  });
}

export function patchObj(id, patch, vm) {
  app = vm;
  return ajax({
    method: 'patch',
    url: 'appsetting/' + id,
    headers: {
      'content-type': 'application/json-patch+json'
    },
    data: patch,
    params: {
      ver: '1.0'
    }
  });
}

export function deleteObj(id, vm) {
  app = vm;
  return ajax({
    method: 'delete',
    url: 'appsetting/' + id,
    params: {
      ver: '1.0'
    }
  });
}

export function deleteObjs(ids, vm) {
  app = vm;
  return ajax({
    method: 'delete',
    url: 'appsettings/' + ids,
    params: {
      ver: '1.0'
    }
  });
}
