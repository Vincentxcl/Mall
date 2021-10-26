import { buildAjax } from 'netWork/ajax.js';

let ajax = buildAjax({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/json',
  },
  responseType: 'json',
  timeout: 5000,
});

function requestData(login) {
  return ajax({
    method: 'get',
    url: 'users/' + login,
  });
}

class detailItemDTO {
  constructor(val) {
    this.id = val.id;
    this.ttl = val.name;
    this.presentPrice = val.following;
    this.imgSrc = val.avatar_url;
  }
}

class detailTitleDTO {
  constructor(val) {
    this.ttl = val.name;
    this.presentPrice = val.following;
    this.originalPrice = val.followers;
    this.label = {
      ttl: val.location,
      color: '#ff8198',
    };
    this.sales = val.public_repos;
    this.favor = val.public_gists;
    this.deliveryTime = 72;
    this.services = ['退货补运费', '全国包邮', '7天无条件退货'];
  }
}

class detailShopDTO {
  constructor(val) {
    this.logo = val.avatar_url;
    this.name = val.login;
    this.link = val.html_url;
    this.record = [
      {
        ttl: '总销量',
        num: val.followers,
      },
      {
        ttl: '全部宝贝',
        num: val.following,
      },
    ];
    this.status = [
      {
        ttl: '描述相符',
        num: 4.72,
        isBetter: 1,
      },
      {
        ttl: '发货速度',
        num: 4.8,
        isBetter: 0,
      },
      {
        ttl: '质量满意',
        num: 4.9,
        isBetter: -1,
      },
    ];
  }
}

export {
  requestData,
  detailItemDTO,
  detailTitleDTO,
  detailShopDTO,
};
