<template>
  <div class="sysParameter">
    <div class="topBar">
      <main-tool-bar :items="toolBarItems" @click="toolItemsClick"></main-tool-bar>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import MainToolBar from 'components/navigation/stl.v1/mainToolBar.vue';

import { deleteObj, deleteObjs } from 'netWork/appSetting.js';
import { siteNodesBuilder } from 'common/helper/siteMapHelper.js';

export default {
  name: 'SysParameter',
  data() {
    return {
      path: '', //保存离开组件时的路径
    };
  },
  computed: {
    toolBarItems() {
      //找到该组件对应的节点
      let node = this.$store.getters.siteNodes.find((val) => val.routeName && val.routeName.toLowerCase() == this.$options.name.toLowerCase());
      if (node) {
        // 1.创建该节点所具有的工具项
        let siteToolItemProps = ['id', 'routeName', 'path', 'title', 'icon', 'substitutionTagSiteNodeId', 'type', 'supports'];
        let toolItem = siteNodesBuilder(node.children, 'toolItem', siteToolItemProps); //返回的是一个对象

        // 2.根据路由状态加载工具项目
        let availableToolItem = {
          isShow: toolItem.isShow,
          value: []
        };
        // 添加支持当前路由的工具项
        if (toolItem.value.length > 0) {
          for (let item of toolItem.value) {
            if (item.supports && item.supports.length > 0) {
              //判断 是否支持该路由的工具项
              if (item.supports.find((val) => val.toLowerCase() == this.$route.name.toLowerCase())) {
                availableToolItem.value.push(item);
              }
            }
          }
        }

        return availableToolItem;
      } else {
        throw new Error('Can not find any node in vuex site nodes with ' + this.$options.name);
      }
    },
    pageIndex() {
      return this.$store.getters['sysParameter/pageIndex'];
    },
    readOnlySelectedObj() {
      return this.$store.getters['sysParameter/readOnlySelectedObj'];
    },
    selection() {
      return this.$store.getters['sysParameter/selection'];
    }
  },
  methods: {
    toolItemsClick(e) {
      switch (e.id) {
        case 613:
          {
            this.deleteItemsClick();
          }
          break;
        case 618:
          {
            this.editItemClick();
          }
          break;
        case 619:
          {
            this.deleteItemClick();
          }
          break;
        default:
          break;
      }
    },
    deleteItemClick() {
      if (this.readOnlySelectedObj) {
        this.$confirm({
          type: 'warning',
          content: '是否删除 ' + this.readOnlySelectedObj.title + ' ?',
          confirmTxt: '确认',
          cancelTxt: '取消'
        })
          .then(() => {
            deleteObj(this.readOnlySelectedObj.id, this).then(() => {
              this.$store.dispatch('sysParameter/getDataList', this.pageIndex + 1); //刷新当前页
              this.$toast.show({ type: 'success', text: '删除成功' });
              this.$router.push({ name: 'sysParameterList' });
            });
          })
          .catch(() => {});
      }
    },
    deleteItemsClick() {
      if (this.selection.length > 0) {
        let ids = this.selection.map((obj) => obj.id).join(',');
        this.$confirm({
          type: 'warning',
          content: '是否删除这 ' + this.selection.length + ' 项数据?',
          confirmTxt: '确认',
          cancelTxt: '取消'
        })
          .then(() => {
            deleteObjs(ids, this).then(() => {
              this.$store.dispatch('sysParameter/getDataList', this.pageIndex + 1); //刷新当前页
              this.$toast.show({ type: 'success', text: '删除成功' });
              //跳转回主要管理列表
              if (this.$route.name != 'sysParameterList') {
                this.$router.push({ name: 'sysParameterList' });
              }
            });
          })
          .catch(() => {});
      }
      //
      else {
        this.$toast.show({ type: 'normal', text: '请选择' });
      }
    },
    editItemClick() {
      if (this.readOnlySelectedObj) {
        this.$router.push({ name: 'editSettingItem' });
      }
    }
  },
  activated() {
    // keepalive 当组件在激活时跳转到一个默认地址，或者跳转到离开时的地址
    if (this.path.trim() != '') {
      this.$router.push(this.path);
    }
    // 跳转至默认子路由
    else {
      let current = this.$store.getters.siteNodes.find((val) => val.routeName && val.routeName.toLowerCase() == this.$options.name.toLowerCase());
      if (current) {
        //在其包含节点中找到 以 index default list结尾的路由
        if (current.children && current.children.value) {
          let exts = ['index', 'default', 'list'];
          let child = undefined;

          for (let ext of exts) {
            //目标node的route name
            let target = (this.$options.name + ext).toLowerCase();
            //找到与target 同名的child
            child = current.children.value.find((val) => val.routeName && target == val.routeName.toLowerCase());
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
    }
  },
  beforeRouteLeave(to, from, next) {
    // 离开组件时，记录离开时的地址，当回来的时候，还可以继续访问子组件，Deactive仅在keepalive中有用，因此不用
    this.path = this.$route.path;
    next();
  },
  beforeDestroy() {
    //清空store
    this.$store.commit('sysParameter/SetSelection', []);
  },
  components: {
    MainToolBar
  }
};
</script>

<style scoped>
.sysParameter {
  width: 100%;
  height: 100%;
}

.topBar {
  display: flex;
  background: #ebebeb;
  width: 100%;
  height: 40px;
}
</style>
