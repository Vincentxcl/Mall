import appsettings from 'config/appsettings.json';

const buildActionTtl = {
  computed: {
    operationRange() {
      return appsettings.operationRange;
    }
  },
  methods: {
    getOpTtl(val) {
      const item = this.operationRange.find((i) => {
        return i.value == val;
      });
      if (item) {
        return item.title;
      }
    },
    buildActionTtl(e) {
      return e.action.name + '(' + this.getOpTtl(e.operationRange) + ')';
    }
  }
};

export { buildActionTtl };
