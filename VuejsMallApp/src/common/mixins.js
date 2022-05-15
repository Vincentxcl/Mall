//组件实现双向绑定value-->string v-model 
const vmodel = {
  props: {
    value: {
      type: String,
      default() {
        return '';
      },
    },
  },
  methods: {
    echoInput(val) {
      this.$emit("input", val);
    },
    isActive(val) {
      return (val === this.value);
    },
  },
};

//组件实现双向绑定value-->bool
const vcheck = {
  props: {
    value: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  methods: {
    echoInput() {
      this.$emit("input", !this.value);
    },
  },
};

//返回顶部组件快速混入
import BackTop from 'components/backTop/BackTop.vue';
const cpnBackTop = {
  data() {
    return {
      isShowBackTop: false,
    };
  },
  methods: {
    backTopClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },
  },
  components: {
    BackTop,
  },
};


export {
  vmodel,
  vcheck,
  cpnBackTop,
};
