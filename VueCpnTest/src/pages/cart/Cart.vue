<template>
  <div>
    <h1>Cart</h1>
    <button @click="demo">XXX</button>
    <button @click="demo2">XXX</button>
    <div class="j" v-resize>虎虎虎虎虎虎虎虎虎虎虎虎</div>
  </div>
</template>

<script>
import { resize } from 'common/directives/resize.js';
import { drag } from 'common/directives/drag.js';

export default {
  name: 'Cart',
  data() {
    return {
      isShow: false
    };
  },
  methods: {
    demo() {
      this.$toast.show({ text: '这是警告', type: 'warning' }, 4000);
    },
    demo2() {
      this.$toast.show({ text: '这是文本' ,type:"success"}, 4000);
    }
  },
  components: {},
  directives: {
    resize,
    drag
  }
};
</script>

<style scoped>
.j {
  width: 200px;
  height: 200px;
  border: 1px solid red;
}
</style>
