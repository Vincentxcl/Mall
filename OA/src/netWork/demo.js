import { getAjaxInstanceWithDefaultInterceptor } from 'common/helper/netWorkHelper.js';

export function requestValue(vm) {
  const ajax = getAjaxInstanceWithDefaultInterceptor('userManager', vm);
  return ajax({
    method: 'get',
    url: 'values',
    headers: {
      Accept: 'application/json'
    },
    params: {
      ver: '1.0'
    }
  });
}

export function imgUpload(formData,vm) {
  const ajax = getAjaxInstanceWithDefaultInterceptor('userManager', vm);
	return ajax({
		method: 'post',
		url: 'fileinfo',////////
		headers: {
			'Content-Type': 'multipart/form-data',//发送表单类型的数据
			//'Authorization': this.token
		},
		data: formData,
	});
}
