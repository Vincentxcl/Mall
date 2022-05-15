<template>
  <p class="tagItem" :class="tagClass" :style="pStyle">
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
      //默认跳转的index也是
      return this.$route.name == this.item.routeName || this.$route.name == this.item.routeName + 'Index' ? true : false;
    },
    tagClass() {
      return { active: this.isActive };
    },
    pStyle() {
      let obj = { 'z-index': 2000 - this.index };
      if (this.isActive) {
        obj['z-index'] = 2000;
      }
      return obj;
    }
  },
  methods: {
    itemClick() {
      if (!this.isActive) {
        this.$router.push({
          name: this.item.routeName
        });
        this.$store.commit('SetCurrentPath', this.item.path);
      }
    },
    removeItem() {
      let count = this.$store.getters.usedSiteNodes.length;
      if (count > 1) {
        this.$store.commit('RemoveUsedSiteNode', this.index);

        if (this.isActive) {
          //1. 最后一个
          if (this.index == count - 1) {
            this.$router.push({
              name: this.$store.getters.usedSiteNodes[count - 2].routeName
            });
            this.$store.commit('SetCurrentPath', this.$store.getters.usedSiteNodes[count - 2].path);
          }
          //2. 第一项 或 中间项
          else {
            this.$router.push({
              name: this.$store.getters.usedSiteNodes[this.index].routeName
            });
            this.$store.commit('SetCurrentPath', this.$store.getters.usedSiteNodes[this.index].path);
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
  width: 70px;
  height: 23px;
  line-height: 23px;
  font-size: 12px;
  background: rgb(248, 248, 248);
  border: 1px solid rgb(180, 180, 180);
  border-bottom-right-radius: 10px;
}

p.active {
  border-top: 1px solid white;
  background: white;
}

p.active span {
  color: var(--color-high-text);
}

span {
  width: 50px;
  height: 23px;
  line-height: 23px;
  padding: 0px 2px 0px 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}

i {
  width: 20px;
  line-height: 23px;
  font-size: 12px;
  cursor: pointer;
  text-align: center;
}

i:hover {
  color: var(--color-high-text);
}
</style>
