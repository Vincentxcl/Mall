import appsetting from 'config/appsettings.json';
import { trimInObj, deepClone } from 'common/helper/convertHelper';

// 动态加载主工具栏元素
const method_detail_edit = {
  methods: {
    getDetail(e) {
      let temp = deepClone(e); //此时e中httpmethod为字符串
      let hm = appsetting.request.httpMethods.find((val) => val.title == e.httpMethod);
      temp.httpMethod = hm.value; //将字符转为 number

      //提交至vux中时对象的httpMethod必须为number，也就是option的value
      this.$store.dispatch('action/setSelectedObj', trimInObj(temp));
      this.$router.push({
        name: 'actionDetail',
        params: {
          id: e.id
        }
      });
    },
    editItem(e) {
      let temp = deepClone(e);
      let hm = appsetting.request.httpMethods.find((val) => val.title == e.httpMethod);
      temp.httpMethod = hm.value;

      this.$store.dispatch('action/setSelectedObj', trimInObj(temp));
      this.$router.push({
        name: 'editAction',
        params: {
          id: e.id
        }
      });
    },
    editActionRoles(e) {
      let temp = deepClone(e);
      let hm = appsetting.request.httpMethods.find((val) => val.title == e.httpMethod);
      temp.httpMethod = hm.value;

      this.$store.dispatch('action/setSelectedObj', trimInObj(temp));
      this.$router.push({
        name: 'editActionRoles',
        params: {
          id: e.id
        }
      });
    }
  }
};

export { method_detail_edit };
