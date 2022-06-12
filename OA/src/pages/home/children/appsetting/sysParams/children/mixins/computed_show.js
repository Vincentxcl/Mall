const computed_show = {
  computed: {
    showSelection() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'sysParams');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 6106)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showDetail() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'sysParams');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 6109)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showEdit() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'sysParams');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 6110)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showDel() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'sysParams');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 6111)) {
          isShow = true;
        }
      }
      return isShow;
    }
  }
};

export { computed_show };
