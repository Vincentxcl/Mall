import { siteNodesBuilder } from 'common/helper/siteMapHelper.js';

// 动态加载主工具栏元素
const computedAssistanceBarItems = {
  computed: {
    assistanceBarItems() {
      //找到该组件对应的节点
      let node = this.$store.getters.siteNodes.find((val) => val.routeName && val.routeName.toLowerCase() == this.$options.name.toLowerCase());
      if (node) {
        let toolItemProps = ['id', 'title', 'icon', 'type'];
        let toolItem = siteNodesBuilder(node.children, 'assistanceToolItem', toolItemProps); //返回的是一个对象
        return toolItem;
      } else {
        throw new Error('Can not find any node in vuex site nodes with ' + this.$options.name);
      }
    }
  }
};

export { computedAssistanceBarItems };
