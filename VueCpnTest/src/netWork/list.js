import { buildAjax } from "common/helper/netWorkHelper.js";

let ajax = buildAjax({
	baseURL: "http://localhost:8001/api",
	headers: {
		Accept: 'application/json',
	},
	responseType: "json",
	timeout: 3000,
});


export function requestData(pageIndex) {
	return ajax({
		method: 'get',
		url: 'appsetting',
		params: {
			pageIndex: pageIndex,
			pageSize: 10,
			ver: '1.0'
		},
	});
}

export function createData(dto) {
	return ajax({
		method: 'post',
		url: 'appsetting',
		'content-type': 'application/json',
		data: dto,
		params: {
			ver: '1.0'
		},
	});
}

export function requestDeleteData(id) {
	return ajax({
		method: 'delete',
		url: 'appsetting/' + id,
	});
}
