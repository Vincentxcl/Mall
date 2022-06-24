const computed_show = {
  computed: {
    showSelection() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'fileServer');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 9106)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showDetail() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'fileServer');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 9109)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showEdit() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'fileServer');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 9110)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showDel() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'fileServer');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 9111)) {
          isShow = true;
        }
      }
      return isShow;
    }
  }
};

export { computed_show };
