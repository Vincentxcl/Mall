<template>
  <div class="dropDownList" @mouseenter="enter" @mouseleave="leave">
    <slot name="trigger"></slot>
    <transition name="fade">
      <container-with-arrow v-show="isShow">
        <slot></slot>
      </container-with-arrow>
    </transition>
  </div>
</template>

<script>
import ContainerWithArrow from 'components/dialog/parts/containerWithArrow.vue';

export default {
  name: 'DropDownList',
  data() {
    return {
      isShow: false
    };
  },
  methods: {
    enter() {
      this.isShow = !this.isShow;
    },
    leave() {
      this.isShow = !this.isShow;
    }
  },
  components: {
    ContainerWithArrow
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
