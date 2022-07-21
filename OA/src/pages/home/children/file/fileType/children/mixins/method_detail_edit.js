import { trimInObj, deepClone } from 'common/helper/convertHelper';

// 动态加载主工具栏元素
const method_detail_edit = {
  methods: {
    getDetail(e) {
      let temp = deepClone(e);
      this.$store.dispatch('fileType/setSelectedObj', trimInObj(temp));
      this.$router.push({
        name: 'fileTypeDetail',
        params: {
          id: e.id
        }
      });
    },
    editItem(e) {
      let temp = deepClone(e);
      this.$store.dispatch('fileType/setSelectedObj', trimInObj(temp));
      this.$router.push({
        name: 'editFileType',
        params: {
          id: e.id
        }
      });
    }
  }
};

export { method_detail_edit };
