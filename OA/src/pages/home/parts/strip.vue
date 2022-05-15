<template>
  <div class="strip">
    <vertical-handler  @click.native="iconHandler"></vertical-handler>
  </div>
</template>

<script>
import verticalHandler from 'components/button/verticalHandler.vue';

export default {
  name: 'Strip',
  methods:{
    iconHandler() {
      let isCollapse = this.$store.getters.isMenuCollapse;
      this.$store.commit('SetMenuCollapse', !isCollapse);
    }
  },
  components: { verticalHandler }
};
</script>

<style scoped>
.strip {
  display: flex;
  align-items: center;
  width: 5px;
  height: 100%;
  background: rgb(235, 235, 235);
}
</style>
