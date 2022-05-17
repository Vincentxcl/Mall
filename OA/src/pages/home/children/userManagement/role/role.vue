<template>
  <div class="role">
    <div class="topBar">
      <main-tool-bar :items="toolBarItems" @click="toolItemsClick"></main-tool-bar>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { computedToolBarItem } from 'common/mixins/computedToolBarItems.js';
import { redirectChildRoute } from 'common/mixins/redirectChildRoute.js';
import MainToolBar from 'components/navigation/stl.v1/mainToolBar.vue';

import { deleteObj, deleteObjs } from 'netWork/role.js';

export default {
  name: 'Role',
  mixins: [computedToolBarItem, redirectChildRoute],
  data() {
    return {
      path: '' //保存离开组件时的路径
    };
  },
  computed: {
    pageIndex() {
      return this.$store.getters['role/pageIndex'];
    },
    readOnlySelectedObj() {
      return this.$store.getters['role/readOnlySelectedObj'];
    },
    selection() {
      return this.$store.getters['role/selection'];
    }
  },
  methods: {
    toolItemsClick(e) {
      switch (e.id) {
        case 525:
          {
            this.deleteItemsClick();
          }
          break;
        case 526:
          {
            this.editItemClick();
          }
          break;
        case 527:
          {
            this.deleteItemClick();
          }
          break;
        case 5211:
          {
            this.refreshClick();
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
              this.$store.dispatch('role/getDataList', this.pageIndex + 1); //刷新当前页
              this.$toast.show({ type: 'success', text: '删除成功' });
              this.$router.push({ name: 'roleList' });
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
              this.$store.dispatch('role/getDataList', this.pageIndex + 1); //刷新当前页
              this.$toast.show({ type: 'success', text: '删除成功' });
              //跳转回主要管理列表
              if (this.$route.name != 'roleList') {
                this.$router.push({ name: 'roleList' });
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
        this.$router.push({ name: 'editRole' });
      }
    },
    refreshClick() {
      this.$store.dispatch('role/getDataList', this.pageIndex + 1); //刷新当前页
      this.$toast.show({ type: 'success', text: '刷新成功' });
    }
  },
  beforeDestroy() {
    //清空store
    this.$store.commit('role/SetSelection', []);
  },
  components: {
    MainToolBar
  }
};
</script>

<style scoped>
.role {
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
