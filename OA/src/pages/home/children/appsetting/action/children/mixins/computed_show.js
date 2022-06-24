const computed_show = {
  computed: {
    showSelection() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'action');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 626)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showDetail() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'action');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 629)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showEdit() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'action');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 6210)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showDel() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'action');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 6211)) {
          isShow = true;
        }
      }
      return isShow;
    },
    ///////////////////////////////
    showAllRole() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'role');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 6312)) {
          isShow = true;
        }
      }
      return isShow;
    }
  }
};

export { computed_show };
