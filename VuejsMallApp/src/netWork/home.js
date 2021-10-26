import { buildAjax } from "netWork/ajax.js";

let ajax = buildAjax({
  baseURL: "http://123.207.32.32:8000/",
  headers: {
    Accept: 'application/json',
  },
  responseType: "json",
  timeout: 3000,
});


function requestBannersAndRecommendsData() {
  return ajax({
    url: '/home/multidata',
  });
}

function requestData(type, page) {
  return ajax({
    url: '/home/data',
    params: {
      type,
      page,
    },
  });
}

export {
  requestBannersAndRecommendsData,
  requestData,
};
