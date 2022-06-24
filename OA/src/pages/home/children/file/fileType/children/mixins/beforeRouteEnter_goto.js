import store from 'store/index.js'; // import the store

const beforeRouteEnter_goto = {
  beforeRouteEnter(to, from, next) {
    //不能直接通过this访问$store
    if (store.getters['fileType/selectedObj']) {
      next();
    } else {
      //导航到列表
      let currentNode = store.getters.siteNodes.find((val) => to.name == val.routeName);
      if (currentNode.substitutionTagSiteNodeId) {
        let subNode = store.getters.siteNodes.find((val) => val.id == currentNode.substitutionTagSiteNodeId); //获取当前节点的替代节点
        next({ name: subNode.routeName });
      }
    }
  }
};

export { beforeRouteEnter_goto };
