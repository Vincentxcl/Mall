// siteMapBuilder 根据appsetting中站点地图模板，依据jwtClaim动态加载站点地图
// template 菜单模板 appsetting中siteMap
// jwt令牌的claims
// props从appsettings节点中取出的属性
function siteMapBuilder(template, jwtClaim, props) {
  return {
    value: siteItemsBuilder(template.value, jwtClaim, props),
    isShow: template.isShow
  };
}

// 创建站点菜单 //选出类型是menu item的元素
function siteNodesBuilder(template, type, props) {
  return {
    value: itemsSelector(template.value, type, props),
    isShow: template.isShow
  };
}

//#region 工具方法
//创建站点元素列表，其中用到了递归 children子节点
//objs appsettings节点 jwtClaim声明 props从appsettings节点中取出的属性
function siteItemsBuilder(objs, jwtClaim, props) {
  let arr = [];
  for (let obj of objs) {
    //验证是否需要动态添加菜单项
    if (Reflect.get(obj, 'claim')) {
      let claim = Reflect.get(obj, 'claim');
      let type = claim.type;
      let value = claim.value;
      // 判断令牌中claim是否满足该claim，如果不满足 直接过
      let jwtClaimValue = Reflect.get(jwtClaim, type);
      if (jwtClaimValue == undefined || jwtClaimValue != value) {
        continue;
      }
    }
    //创建菜单项
    let item = new siteItem(obj, props);
    //子菜单
    if (Reflect.get(obj, 'children')) {
      let children = Reflect.get(obj, 'children');
      let _o = {
        value: siteItemsBuilder(children.value, jwtClaim, props), //递归，注意传值进来
        isShow: children.isShow
      };
      item['children'] = _o;
    }

    //入队
    arr.push(item);
  }
  return arr;
}

// 节点选择器
// 遍历数组中各个对象，选择其type属性是指定的type的对象，并筛选出指定的属性props
function itemsSelector(objs, type, props) {
  let arr = [];
  for (let obj of objs) {
    // 验证该对象是否为指定类型
    if (Reflect.get(obj, 'type') == type) {
      // 创建对象
      let item = new siteItem(obj, props);

      // 添加子菜单
      if (Reflect.get(obj, 'children')) {
        let children = Reflect.get(obj, 'children');
        let _o = {
          value: itemsSelector(children.value, type, props), //递归
          isShow: children.isShow
        };
        item['children'] = _o;
      }

      //入队
      arr.push(item);
    }
  }
  return arr;
}

// 基于base对象创建对象，菜单元素对象
function siteItem(base, props) {
  if (typeof props == 'object' && props.length && props.length > 0) {
    for (let prop of props) {
      if (Reflect.get(base, prop)) {
        this[prop] = Reflect.get(base, prop);
      }
    }
  } else {
    throw new Error('siteItem function, props type error');
  }
}
//#endregion

export { siteMapBuilder, siteNodesBuilder };
