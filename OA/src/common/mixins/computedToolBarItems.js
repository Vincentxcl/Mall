import { siteNodesBuilder } from 'common/helper/siteMapHelper.js';

// 动态加载主工具栏元素
const computedToolBarItem = {
  computed: {
    toolBarItems() {
      //找到该组件对应的节点
      let node = this.$store.getters.siteNodes.find((val) => val.routeName && val.routeName.toLowerCase() == this.$options.name.toLowerCase());
      if (node) {
        // 1.创建该节点所具有的工具项
        let siteToolItemProps = ['id', 'routeName', 'path', 'title', 'icon', 'substitutionTagSiteNodeId', 'type', 'supports'];
        let toolItem = siteNodesBuilder(node.children, 'toolItem', siteToolItemProps); //返回的是一个对象

        // 2.根据路由状态加载工具项目
        let availableToolItem = {
          isShow: toolItem.isShow,
          value: []
        };
        // 添加支持当前路由的工具项
        if (toolItem.value.length > 0) {
          for (let item of toolItem.value) {
            if (item.supports && item.supports.length > 0) {
              //判断 是否支持该路由的工具项
              if (item.supports.find((val) => val.toLowerCase() == this.$route.name.toLowerCase())) {
                availableToolItem.value.push(item);
              }
            }
          }
        }

        return availableToolItem;
      } else {
        throw new Error('Can not find any node in vuex site nodes with ' + this.$options.name);
      }
    }
  }
};

export { computedToolBarItem };
