//网络请求工具
import axios from 'axios';
import { configs } from './configHelper';

// 使用appsetting的配置,返回axios的实例
export function getAjaxInstance(ttl) {
  return axios.create(configs(ttl));
}

// 自定义配置axios实例
export function buildAjax(baseSet) {
  return axios.create(baseSet);
}
