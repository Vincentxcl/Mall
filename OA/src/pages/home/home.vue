<template>
  <div class="home">
    <!-- part1 -->
    <div class="content">
      <aside-bar></aside-bar>
      <div>
        <top></top>
        <section>
          <strip></strip>
          <div class="view">
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </div>
        </section>
      </div>
    </div>
    <!-- part2 -->
    <bottom></bottom>
  </div>
</template>

<script>
import { automaticallyRefreshToken } from 'common/helper/tokenHelper.js';
import AsideBar from 'components/navigation/stl.v1/asideBar.vue';
import Top from './parts/top.vue';
import Bottom from './parts/bottom.vue';
import Strip from './parts/strip.vue';

export default {
  name: 'Home',
  computed: {
    usedSiteNodes() {
      return this.$store.getters.usedSiteNodes;
    }
  },
  methods: {
    // 通过当前正在使用的节点（仅为当前home组件下的子节点）筛选出已经为使用的节点
    clearKeepAliveByUnusedSiteNode(usedSiteNodes) {
      //找到虽然在keepalive缓存，但已经没有在usedSiteNodes集合中的子组件
      this.$children.forEach((item) => {
        // 是一个keepAlive的组件
        if (item.$vnode && item.$vnode.data.keepAlive) {
          // 没有在usedSiteNodes中
          let cpnName = item.$vnode.tag.split('-').pop();
          if (!usedSiteNodes.find((i) => i.routeName.toLowerCase() == cpnName.toLowerCase())) {
            this.clearCpnCache(item);
          }
        }
      });
    },
    // 根据路由名清除keepAlive(未测试)
    clearKeepAliveByRouteName(routeName) {
      //遍历当前组件的子组件
      this.$children.forEach((item) => {
        let cpnName = item.$vnode.tag.split('-').pop();
        if (cpnName.toLowerCase() == routeName.toLowerCase()) {
          this.clearCpnCache(item);
        }
      });
    },
    // 清除某个组件的keepAlive状态,并销毁
    clearCpnCache(keepAliveComponent) {
      // 你可以根据自己的业务更改此处的判断逻辑，酌情决定是否摧毁本层缓存。
      if (keepAliveComponent.$vnode && keepAliveComponent.$vnode.data.keepAlive) {
        if (keepAliveComponent.$vnode.parent && keepAliveComponent.$vnode.parent.componentInstance && keepAliveComponent.$vnode.parent.componentInstance.cache) {
          if (keepAliveComponent.$vnode.componentOptions) {
            var key = keepAliveComponent.$vnode.key == null ? keepAliveComponent.$vnode.componentOptions.Ctor.cid + (keepAliveComponent.$vnode.componentOptions.tag ? `::${keepAliveComponent.$vnode.componentOptions.tag}` : '') : keepAliveComponent.$vnode.key;
            //缓存的组件，以及对应的键
            var cache = keepAliveComponent.$vnode.parent.componentInstance.cache;
            var keys = keepAliveComponent.$vnode.parent.componentInstance.keys;
            if (cache[key]) {
              if (keys.length) {
                var index = keys.indexOf(key);
                if (index > -1) {
                  keys.splice(index, 1); //移除键
                }
              }
              delete cache[key]; //移除组件的缓存
            }
          }
        }
      }
      keepAliveComponent.$destroy();
    }
  },
  watch: {
    usedSiteNodes: {
      handler(current) {
        this.clearKeepAliveByUnusedSiteNode(current); //通过监听使用过的节点，当Tag被删除时，动态删除组件缓存
      }
    }
  },
  created() {
    //定时刷新令牌
    this.$nextTick(() => {
      automaticallyRefreshToken('userAuth');
    });
  },
  beforeRouteLeave(to, from, next) {
    //清除Vue站点内容
    this.$store.commit('RemoveSiteMap');
    this.$store.commit('RemoveSiteMenu');
    this.$store.commit('RemoveAllUsedSiteNodes');
    next();
  },
  components: {
    AsideBar,
    Top,
    Bottom,
    Strip
  }
};
</script>

<style scoped>
.home > div.content {
  height: calc(100vh - 30px);
  display: flex;
}

.home > div.content > div {
  flex: 1;
}

.home > div.content > div > section {
  /* 父腔设为relative  */
  position: relative;
  display: flex;
  height: calc(100% - 45px);
}

.view {
  /* 子腔为absolute, 子腔的大小的不改变父腔，但继承父腔的大小*/
  position: absolute;
  flex: 1;
  width: calc(100% - 5px);
  height: 100%;
  margin-left: 5px;
  overflow: hidden;
}
</style>
