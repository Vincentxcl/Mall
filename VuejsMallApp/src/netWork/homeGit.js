import { buildAjax } from "netWork/ajax.js";

let ajax = buildAjax({
  baseURL: "https://api.github.com",
  headers: {
    Accept: 'application/json',
  },
  responseType: "json",
  timeout: 5000,
});


function requestData(type, page) {
  return ajax({
    method: 'get',
    url: '/search/users',
    params: {
      q: type,
      page,
    },
  });
}

export {
  requestData
};
