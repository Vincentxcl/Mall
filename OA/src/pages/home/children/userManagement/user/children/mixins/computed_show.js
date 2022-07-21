const computed_show = {
  computed: {
    showSelection() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'user');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 5106)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showDetail() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'user');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 5109)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showEdit() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'user');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 5110)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showDel() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'user');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 5111)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showEditUserRoles() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'user');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 5112)) {
          isShow = true;
        }
      }
      return isShow;
    },
    showEditUserActions() {
      let isShow = false;
      let parentNode = this.$store.getters.siteNodes.find((val) => val.routeName == 'user');
      if (parentNode) {
        if (parentNode.children.value.find((val) => val.id == 5113)) {
          isShow = true;
        }
      }
      return isShow;
    }
  }
};

export { computed_show };
