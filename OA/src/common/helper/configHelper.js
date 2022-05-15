import appsetting from 'config/appsettings.json';

//根据环境变量,返回appsetting中的相应的对象,key时成员的名称
export function configs(key) {
  let config = process.env.NODE_ENV == 'development' ? appsetting.networkConfigs.development : appsetting.networkConfigs.production;
  if (!config[key]) {
    throw Error(key + ' does not exist in appsettings');
  } else {
    return config[key];
  }
}
