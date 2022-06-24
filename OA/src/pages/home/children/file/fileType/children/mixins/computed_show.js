const computed_show = {
  computed: {
    showSelection() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'fileType');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 9206)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showDetail() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'fileType');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 9209)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showEdit() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'fileType');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 9210)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showDel() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'fileType');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 9211)) {
          isShow = true;
        }
      }
      return isShow;
    }
  }
};

export { computed_show };
