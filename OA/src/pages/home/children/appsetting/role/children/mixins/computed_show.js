const computed_show = {
  computed: {
    showSelection() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'role');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 635)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showDetail() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'role');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 638)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showEdit() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'role');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 639)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showDel() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'role');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 6310)) {
          isShow = true;
        }
      }
      return isShow;
    }
  }
};

export { computed_show };
