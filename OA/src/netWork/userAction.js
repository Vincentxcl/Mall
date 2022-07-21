import { getAjaxInstanceWithDefaultInterceptor } from 'common/helper/netWorkHelper.js';

export function requestDataByUserId(userId, vm) {
  const ajax = getAjaxInstanceWithDefaultInterceptor('userManager', vm);
  return ajax({
    method: 'get',
    url: 'userinfo/' + userId + '/useractions',
    headers: {
      accept: 'application/json'
    },
    params: {
      ver: '1.0'
    }
  });
}

export function postData(userId, actionId, dto, vm) {
  const ajax = getAjaxInstanceWithDefaultInterceptor('userManager', vm);
  return ajax({
    method: 'put',
    url: 'userinfo/' + userId + '/useraction/' + actionId,
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

export function deleteObj(userId, actionId, vm) {
  const ajax = getAjaxInstanceWithDefaultInterceptor('userManager', vm);
  return ajax({
    method: 'delete',
    url: 'userinfo/' + userId + '/useraction/' + actionId,
    params: {
      ver: '1.0'
    }
  });
}
