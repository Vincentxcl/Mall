//网络请求工具
import axios from 'axios';
import appsetting from 'config/appsettings.json';

const apiConfigs = process.env.NODE_ENV == 'development' ? appsetting.networkConfigs.development : appsetting.networkConfigs.production;

// 使用appsetting的配置
export function getAjaxInstance(ttl) {
  if (!apiConfigs[ttl]) {
    throw Error(ttl + ' does not exist in appsettings');
  }
  return axios.create(apiConfigs[ttl]);
}

// 自定义配置axios实例
export function buildAjax(baseSet) {
  return axios.create(baseSet);
}
