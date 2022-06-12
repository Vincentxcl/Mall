const getSetOrderBy = {
  data() {
    return {
      order: [] //保存排序对象{prop:'num',order:'asc'}
    };
  },
  computed: {
    orderBy() {
      if (this.order.Length == 0) {
        return '';
      }
      return this.order
        .filter((item) => item.order != '') //取出有排序类型的对象
        .map((item) => item.prop + ' ' + item.order)
        .join(',');
    }
  },
  methods: {
    setOrderBy(payload) {
      let order = '';
      if (payload.order) {
        /^(asc|desc)\w+$/.exec(payload.order); //正则匹配挖字符
        order = RegExp.$1;
      }

      //判断数组中是否有该排序对象
      let obj = this.order.find((item) => item.prop == payload.prop);
      //没有时，就追加
      if (!obj) {
        this.order.push({ prop: payload.prop, order: order });
      }
      //存在时，就修改
      else {
        obj.order = order;
      }
    }
  }
};

export { getSetOrderBy };
