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
    // 位于导航路径中
    isRelative() {
      return this.$store.getters.path.indexOf(this.item.title) != -1;
    },
    isActive() {
      //构造节点时，通过当前路由，判断是否为正在访问的节点，或者其代表的子节点正在被访问，可以避免重复push路由导致报错
      let isSubstitutionTagSiteNode = false;
      let isCurrentNode = false;

      //1.当前构造的这个节点，是否就是当前正在使用的节点，其替代节点
      let currentNode = this.$store.getters.siteNodes.find((val) => this.$route.name == val.routeName);
      if (currentNode.substitutionTagSiteNodeId) {
        let subNode = this.$store.getters.siteNodes.find((val) => val.id == currentNode.substitutionTagSiteNodeId); //获取当前节点的替代节点
        isSubstitutionTagSiteNode = this.item.routeName == subNode.routeName ? true : false;
      }

      //2.当前路由或者默认跳转的index!!!
      isCurrentNode = this.$route.name == this.item.routeName || this.$route.name == this.item.routeName + 'Index' ? true : false;

      // 或运算，构造节点时，只要是当前访问的节点，或者是当前访问节点的替代节点，那么该节点都为激活
      return isSubstitutionTagSiteNode || isCurrentNode;
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
          name: this.item.routeName
        });
      }
      this.$emit('click');
    }
  }
};
</script>
