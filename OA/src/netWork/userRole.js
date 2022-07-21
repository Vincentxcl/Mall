import { getAjaxInstanceWithDefaultInterceptor } from 'common/helper/netWorkHelper.js';

export function requestDataByUserId(userId, vm) {
  const ajax = getAjaxInstanceWithDefaultInterceptor('userManager', vm);
  return ajax({
    method: 'get',
    url: 'userinfo/' + userId + '/userroles',
    headers: {
      accept: 'application/json'
    },
    params: {
      ver: '1.0'
    }
  });
}

export function postData(userId, dto, vm) {
  const ajax = getAjaxInstanceWithDefaultInterceptor('userManager', vm);
  return ajax({
    method: 'put',
    url: 'userinfo/' + userId + '/userroles',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json'
    },
    data: dto,
    params: {
      ver: '1.0'
    }
  });
}
