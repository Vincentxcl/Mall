<template>
  <ul v-if="items && items.value && items.value.length > 0" v-show="isShow" class="navGroup" :class="ulClass">
    <template v-for="item in value">
      <nav-item v-show="showItem(item)" :key="item.id" :item="item" @mouseenter="movein(item)" @mouseleave="moveout(item)" @click="itemClick(item)">
        <template slot="content">
          <!-- icon -->
          <div v-if="isFolded && level == 0" class="icon">
            <icon :icon="item.icon" :title="item.title" />
          </div>
          <div v-else-if="!isFolded" class="icon">
            <icon v-if="level == 0" :icon="item.icon" :title="item.title" />
          </div>

          <!-- title -->
          <div v-if="isFolded && level > 0" class="ttl">{{ item.title }}</div>
          <transition name="slide-fade">
            <div v-if="!isFolded" class="ttl">{{ item.title }}</div>
          </transition>

          <!-- child menu pointer icon -->
          <div v-if="isFolded && item.children && item.children.value.length > 0 && level > 0" class="wrap">
            <icon icon="icon-xiayiyehouyiye" />
          </div>
          <div v-else-if="!isFolded && item.children && item.children.value.length > 0" class="wrap">
            <icon icon="icon-xiangshang" v-show="item.children.isShow" />
            <icon icon="icon-xiangxia" v-show="!item.children.isShow" />
          </div>
        </template>

        <!-- recursion child menu-->
        <nav-group v-if="item.children" :isFolded="isFolded" :items="item.children" :level="nextLevel()" />
      </nav-item>
    </template>
  </ul>
</template>

<script>
//使用组合指南 1.Vuex module navigation.js记录使用的节点; 2.VueRouter 将节点使用过程登记到Vuex中

import icon from 'components/widgets/icon.vue';
import NavItem from './navItem.vue';

export default {
  name: 'NavGroup',
  data() {
    return {
      value: [], //子节点的数组
      isShow: true //子节点是否显示
    };
  },
  props: {
    //主菜单是否收缩为图标模式
    isFolded: {
      type: Boolean,
      default() {
        return false;
      }
    },
    //
    items: {
      type: Object,
      required: true
    },
    //递归时内部使用，传递该组件递归的次数，外部不需要调用该属性
    level: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  computed: {
    ulClass() {
      let obj = {};
      obj['lv' + this.level] = true;
      obj.fold = this.isFolded;
      obj.unfold = !this.isFolded;
      return obj;
    }
  },
  methods: {
    showItem(item) {
      //是否显示当前节点
      if (item.isShow) {
        return item.isShow;
      }
      return true;
    },
    nextLevel() {
      return this.level + 1;
    },
    movein(val) {
      if (this.isFolded && val.children) {
        val.children.isShow = true;
      }
    },
    moveout(val) {
      if (this.isFolded && val.children) {
        val.children.isShow = false;
      }
    },
    itemClick(val) {
      if (!this.isFolded && val.children) {
        val.children.isShow = !val.children.isShow;
      }
      this.$emit('click', val);
    }
  },
  watch: {
    isFolded: {
      handler(current) {
        if (current) {
          for (let i of this.value) {
            if (i.children) {
              i.children.isShow = false; //设置子菜单的显示
            }
          }
        }
      }
    },
    items: {
      deep: true,
      handler(current) {
        this.value = current.value;
        this.isShow = current.isShow;
      }
    }
  },
  created() {
    if (this.items) {
      this.value = this.items.value;
      this.isShow = this.items.isShow;
    }
  },
  components: {
    icon,
    NavItem
  }
};
</script>
