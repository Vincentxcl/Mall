import axios from 'axios';
import { getAjaxInstance } from 'common/helper/netWorkHelper.js';
import { getCookie, setCookie } from 'common/helper/cookiesHelper';

let handler;
let cancel; // 用于保存取消请求的函数
const ajax = getAjaxInstance('userManager');

// 请求拦截器
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
    cancel = null;
    return res;
  },
  (err) => {
    return Promise.reject(err);
  }
);

//请求token
function requestToken() {
  return ajax({
    method: 'GET',
    url: 'authentication/token'
  });
}

//解码JWT中的payload
function decodeJwtPayload(jwt) {
  let base64Url = jwt.toString().split('.')[1].replace('-', '+').replace('_', '/');
  let orig = JSON.parse(window.atob(base64Url));
  let expiration = new Date(orig.exp * 1000); //过期时间
  let payload = {
    ...orig
  };
  payload.exp = expiration;
  return payload;
}

//获取token，尝试从cookie或者服务器获取token，key为键名，可能有多组令牌
async function tryGetToken(key) {
  //本地获取token
  let token = getCookie(key) || window.sessionStorage.getItem(key);
  // 令牌不存在
  if (token == undefined || token.trim() == '') {
    console.log('令牌 不存在！'); //////////////////////////
    //请求token
    return new Promise((resolve, reject) => {
      requestToken()
        .then((res) => {
          console.log('没有令牌，获取了新的令牌');
          setCookie(key, res.data, 0);
          window.sessionStorage.setItem(key, res.data);
          resolve(res.data); //执行成功时的结果，res.data就是令牌
        })
        .catch((error) => {
          console.log('没有令牌，无法访问链接，链接已过期');
          reject(error); //执行失败时的结果
        });
    });
  }
  // 令牌存在
  else {
    let payload = decodeJwtPayload(token);
    let isExpired = payload.exp < new Date();
    // 1.已过期
    if (isExpired) {
      console.log('令牌虽然存在，但是已过期 ');
      //请求token
      return new Promise((resolve, reject) => {
        requestToken()
          .then((res) => {
            console.log('旧的令牌，获取了新的令牌');
            setCookie(key, res.data, 0);
            window.sessionStorage.setItem(key, res.data);
            resolve(res.data); //执行成功时的结果，res.data就是令牌
          })
          .catch((error) => {
            console.log('旧的令牌，无法访问链接，链接已过期');
            reject(error); //执行失败时的结果
          });
      });
    }
    // 2.未过期
    else {
      console.log('令牌存在，尚未过期');
      return token; //async函数，返回的一个固定值，那就只是一个状态是成功的promise
    }
  }
}

//刷新令牌
function refreshToken(key) {
  requestToken()
    .then((res) => {
      console.log('tokenHelper定时刷新令牌'); /////////////////////////

      setCookie(key, res.data, 0);
      window.sessionStorage.setItem(key, res.data);
      //获取令牌的过期时间
      let payload = decodeJwtPayload(res.data);
      let remainder = payload.exp - new Date() - 30000;
      automaticallyRefreshToken(key, remainder); //令牌有效期还剩30秒的时候，再请求新令牌
    })
    .catch(() => {
      console.log('tokenHelper定时刷新，无法访问链接，链接已过期，停止刷新令牌');
      clearInterval(handler);
    });
}

//定时刷新令牌
function automaticallyRefreshToken(key, remainder) {
  clearTimeout(handler);

  let interval = remainder;
  //第一次执行时，remainder可以不用传入
  if (remainder == undefined) {
    //本地获取token
    let token = getCookie(key) || window.sessionStorage.getItem(key);
    // 令牌不存在
    if (token == undefined || token.trim() == '') {
      throw new Error('automatically refresh token 令牌 不存在');
    }
    let payload = decodeJwtPayload(token);
    interval = payload.exp - new Date() - 30000;
  }

  handler = setTimeout(() => refreshToken(key), interval);
}

export { tryGetToken, decodeJwtPayload, automaticallyRefreshToken };
