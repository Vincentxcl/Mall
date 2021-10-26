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

import BackTop from 'components/backTop/BackTop.vue';
const cpnBackTop = {
  data() {
    return {
      showBackTop: false,
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
