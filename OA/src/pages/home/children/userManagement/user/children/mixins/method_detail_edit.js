import { trimInObj, deepClone } from 'common/helper/convertHelper';

// 动态加载主工具栏元素
const method_detail_edit = {
  methods: {
    getDetail(e) {
      let temp = deepClone(e);
      this.$store.dispatch('user/setSelectedObj', trimInObj(temp));
      this.$router.push({
        name: 'userDetail',
        params: {
          id: e.id
        }
      });
    },
    editItem(e) {
      let temp = deepClone(e);
      this.$store.dispatch('user/setSelectedObj', trimInObj(temp));
      this.$router.push({
        name: 'editUser',
        params: {
          id: e.id
        }
      });
    },
    editUserRoles(e) {
      let temp = deepClone(e);
      this.$store.dispatch('user/setSelectedObj', trimInObj(temp));
      this.$router.push({
        name: 'editUserRoles',
        params: {
          id: e.id
        }
      });
    },
    editUserActions(e) {
      let temp = deepClone(e);
      this.$store.dispatch('user/setSelectedObj', trimInObj(temp));
      this.$router.push({
        name: 'editUserActions',
        params: {
          id: e.id
        }
      });
    }
  }
};

export { method_detail_edit };
