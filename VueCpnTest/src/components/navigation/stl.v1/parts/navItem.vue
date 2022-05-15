<template>
  <li class="navItem" @mouseenter="enter" @mouseleave="leave">
    <div class="content" :class="divClass" @click="itemClick">
      <slot name="content"></slot>
    </div>
    <slot></slot>
  </li>
</template>

<script>
export default {
  name: 'NavItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    divClass() {
      return { active: this.isActive, relative: this.isRelative };
    },
    isRelative() {
    // 位于导航路径中
      return this.$store.getters.path.indexOf(this.item.title) != -1;
    },
    isActive() {
      // 当前路由或者默认跳转的index
      return this.$route.name == this.item.routeName || this.$route.name == this.item.routeName + 'Index' ? true : false;
    }
  },
  methods: {
    enter() {
      this.$emit('mouseenter');
    },
    leave() {
      this.$emit('mouseleave');
    },
    itemClick() {
      if (!this.isActive && this.item.routeName) {
        this.$router.push({
          name: this.item.routeName,
        });
      }
      this.$emit('click');
    }
  }
};
</script>
