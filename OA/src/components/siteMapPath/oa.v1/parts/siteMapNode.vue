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
      let obj = {
        active: this.isCurrentNode,
        substitution: this.isSubstitutionTagSiteNode
      };
      if (this.item.routeName) {
        obj.route = true;
      }
      return obj;
    },
    isCurrentNode() {
      return this.$route.name == this.item.routeName || this.$route.name == this.item.routeName + 'Index' ? true : false;
    },
    isSubstitutionTagSiteNode() {
      let isSubstitutionTagSiteNode = false;
      //1.当前构造的这个节点，是否就是当前正在使用的节点，其替代节点
      let currentNode = this.$store.getters.siteNodes.find((val) => this.$route.name == val.routeName);
      if (currentNode.substitutionTagSiteNodeId) {
        let subNode = this.$store.getters.siteNodes.find((val) => val.id == currentNode.substitutionTagSiteNodeId); //获取当前节点的替代节点
        isSubstitutionTagSiteNode = this.item.routeName == subNode.routeName ? true : false;
      }
      // 或运算，构造节点时，只要是当前访问的节点，或者是当前访问节点的替代节点，那么该节点都为激活
      return isSubstitutionTagSiteNode;
    }
  },
  methods: {
    itemClick() {
      if (!this.isCurrentNode && this.item.routeName) {
        // 1.是替代节点，跳转至其子节点路由
        if (this.isSubstitutionTagSiteNode) {
          //在其包含节点中找到 以 index default list结尾的路由
          if (this.item.children && this.item.children.value) {
            let exts = ['index', 'default', 'list'];
            let child = undefined;

            for (let ext of exts) {
              //目标node的route name
              let target = (this.item.routeName + ext).toLowerCase();
              //找到与target 同名的child
              child = this.item.children.value.find((val) => val.routeName && target == val.routeName.toLowerCase());
              if (child) {
                break;
              }
            }
            //跳转到子节点
            if (child && this.$route.name != child.routeName) {
              this.$router.push({ name: child.routeName });
            }
          }
        }
        // 2.非替代节点
        else {
          this.$router.push({ name: this.item.routeName });
        }
      }

      this.$emit('click');
    }
  }
};
</script>
