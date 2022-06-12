import { getAjaxInstanceWithDefaultInterceptor } from 'common/helper/netWorkHelper.js';

export function requestDataByActionId(actionId, vm) {
  const ajax = getAjaxInstanceWithDefaultInterceptor('userManager', vm);
  return ajax({
    method: 'get',
    url: 'action/' + actionId + '/roleactions',
    headers: {
      accept: 'application/json'
    },
    params: {
      ver: '1.0'
    }
  });
}

export function requestDataByRoleId(roleId, vm) {
  const ajax = getAjaxInstanceWithDefaultInterceptor('userManager', vm);
  return ajax({
    method: 'get',
    url: 'role/' + roleId + '/roleactions',
    headers: {
      accept: 'application/json'
    },
    params: {
      ver: '1.0'
    }
  });
}

export function postData(actionId, dto, vm) {
  const ajax = getAjaxInstanceWithDefaultInterceptor('userManager', vm);
  return ajax({
    method: 'put',
    url: 'action/' + actionId + '/roleactions',
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
