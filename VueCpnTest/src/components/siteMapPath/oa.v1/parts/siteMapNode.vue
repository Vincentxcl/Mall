<template>
  <div class="siteMapNode" :class="divClass" @click="itemClick">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'SiteMapNode',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    divClass() {
      let obj = { active: this.isActive };
      if (this.item.routeName) {
        obj.route = true;
      }
      return obj;
    },
    isActive() {
      return this.$route.name == this.item.routeName || this.$route.name == this.item.routeName + 'Index' ? true : false;
    }
  },
  methods: {
    itemClick() {
      if (!this.isActive && this.item.routeName) {
        this.$router.push({
          name: this.item.routeName
        });
      }
      this.$emit('click');
    }
  }
};
</script>
