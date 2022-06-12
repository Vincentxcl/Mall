import { getAjaxInstanceWithDefaultInterceptor } from 'common/helper/netWorkHelper.js';

export function requestItem(id, vm) {
  const ajax = getAjaxInstanceWithDefaultInterceptor('userManager', vm);
  return ajax({
    method: 'get',
    url: 'role/' + id,
    headers: {
      Accept: 'application/json'
    },
    params: {
      ver: '1.0'
    }
  });
}

export function postData(dto, vm) {
  const ajax = getAjaxInstanceWithDefaultInterceptor('userManager', vm);
  return ajax({
    method: 'post',
    url: 'role',
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
  const ajax = getAjaxInstanceWithDefaultInterceptor('userManager', vm);
  return ajax({
    method: 'patch',
    url: 'role/' + id,
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
  const ajax = getAjaxInstanceWithDefaultInterceptor('userManager', vm);
  return ajax({
    method: 'delete',
    url: 'role/' + id,
    params: {
      ver: '1.0'
    }
  });
}

export function requestData(queryObj, vm) {
  if (typeof queryObj != 'object') {
    throw new Error('In the function requestData, a parameter queryObj must be a object, but got a error type ' + typeof queryObj);
  }

  // 构建查询参数对象
  let params = {
    ver: '1.0'
  };

  let props = ['id', 'name', 'search', 'pageIndex', 'pageSize', 'orderBy', 'fields'];
  for (let prop of props) {
    if (Reflect.get(queryObj, prop) != undefined) {
      params[prop] = Reflect.get(queryObj, prop);
    }
  }

  const ajax = getAjaxInstanceWithDefaultInterceptor('userManager', vm);
  return ajax({
    method: 'get',
    url: 'roles',
    headers: {
      Accept: 'application/json'
    },
    params: params
  });
}

export function deleteObjs(ids, vm) {
  const ajax = getAjaxInstanceWithDefaultInterceptor('userManager', vm);
  return ajax({
    method: 'delete',
    url: 'roles/' + ids,
    params: {
      ver: '1.0'
    }
  });
}

export function requestAllData(vm) {
  const ajax = getAjaxInstanceWithDefaultInterceptor('userManager', vm);
  return ajax({
    method: 'get',
    url: 'roles/all',
    headers: {
      Accept: 'application/json'
    },
    params: {
      ver: '1.0'
    }
  });
}
