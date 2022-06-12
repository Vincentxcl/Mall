import { trimInObj, deepClone } from 'common/helper/convertHelper';

// 动态加载主工具栏元素
const method_detail_edit = {
  methods: {
    getDetail(e) {
      let temp = deepClone(e);
      this.$store.dispatch('sysParams/setSelectedObj', trimInObj(temp));
      this.$router.push({
        name: 'sysParamsDetail',
        params: {
          id: e.id
        }
      });
    },
    editItem(e) {
      let temp = deepClone(e);
      this.$store.dispatch('sysParams/setSelectedObj', trimInObj(temp));
      this.$router.push({
        name: 'editSysParams'
      });
    }
  }
};

export { method_detail_edit };
