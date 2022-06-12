const redirectChildRoute = {
  activated() {
    // keepalive 当组件在激活时跳转到一个默认地址，或者跳转到离开时的地址
    if (this.path.trim() != '') {
      this.$router.push(this.path);
    }
    // 跳转至默认子路由
    else {
      let current = this.$store.getters.siteNodes.find((val) => val.routeName && val.routeName.toLowerCase() == this.$options.name.toLowerCase());
      if (current) {
        //在其包含节点中找到 以 index default list结尾的路由
        if (current.children && current.children.value) {
          let exts = ['index', 'default', 'list'];
          let child = undefined;

          for (let ext of exts) {
            //目标node的route name
            let target = (this.$options.name + ext).toLowerCase();
            //找到与target 同名的child
            child = current.children.value.find((val) => val.routeName && target == val.routeName.toLowerCase());
            if (child) {
              break;
            }
          }
          //跳转到子节点
          if (child && this.$route.name != child.routeName) {
            this.$router.push({ name: child.routeName });
          }
        }
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    // 离开组件时，记录离开时的地址，当回来的时候，还可以继续访问子组件，Deactive仅在keepalive中有用，因此不用
    this.path = this.$route.fullPath;//必须是全路径，包含query部分
    next();
  }
};

export { redirectChildRoute };
