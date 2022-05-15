<template>
  <p class="tagItem" :class="tagClass">
    <span :title="item.title" @click="itemClick()">{{ item.title }}</span>
    <icon icon="icon-guanbi" @click.native="removeItem()"></icon>
  </p>
</template>

<script>
import icon from 'components/widgets/icon.vue';

export default {
  name: 'TagItem',
  props: {
    index: {
      type: Number,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
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
    },
    tagClass() {
      return { active: this.isActive };
    }
  },
  methods: {
    itemClick() {
      if (!this.isActive) {
        this.$router.push({
          name: this.item.routeName
        });
      }
    },
    removeItem() {
      let count = this.$store.getters.usedSiteNodes.length;
      if (count > 1) {
        this.$store.commit('RemoveUsedSiteNode', this.index);
        //如果移除的是当前正在显示的节点，那下一步应该显示哪一个节点
        if (this.isActive) {
          //1. 最后一个
          if (this.index == count - 1) {
            this.$router.push({
              name: this.$store.getters.usedSiteNodes[count - 2].routeName
            });
          }
          //2. 第一项 或 中间项
          else {
            this.$router.push({
              name: this.$store.getters.usedSiteNodes[this.index].routeName
            });
          }
        }
      }
    }
  },
  components: { icon }
};
</script>

<style scoped>
p {
  position: absolute;
  display: flex;
  width: 100px;
  height: 30px;
  line-height: 30px;
  margin-top: 15px;
  font-size: 14px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
p.active > i,
p:hover > i {
  display: block;
}

p.active {
  background: rgba(255, 255, 255, 0.8);
}

p.active span {
  color: #333;
}

span {
  width: 80px;
  height: 30px;
  line-height: 35px;
  text-align: center;
  padding: 0px 4px;
  color: white;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}

i {
  color: rgba(255, 255, 255, 0.6);
  display: none;
  width: 20px;
  line-height: 30px;
  font-size: 10px;
  cursor: pointer;
  text-align: center;
}

i:hover {
  color: var(--color-high-text);
}
</style>
