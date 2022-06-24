<template>
  <div class="fileServer">
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

import { deleteObj, deleteObjs } from 'netWork/fileServer.js';

export default {
  name: 'FileServer',
  mixins: [computedToolBarItem, redirectChildRoute],
  data() {
    return {
      path: '' //保存离开组件时的路径
    };
  },
  computed: {
    pageIndex() {
      return this.$store.getters['fileServer/pageIndex'];
    },
    readOnlySelectedObj() {
      return this.$store.getters['fileServer/readOnlySelectedObj'];
    },
    selection() {
      return this.$store.getters['fileServer/selection'];
    }
  },
  methods: {
    toolItemsClick(e) {
      switch (e.id) {
        case 9106:
          {
            this.deleteItemsClick();
          }
          break;
        case 9107:
          {
            this.editItemClick();
          }
          break;
        case 9108:
          {
            this.deleteItemClick();
          }
          break;
        case 9102:
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
          content: '是否删除 ' + this.readOnlySelectedObj.ipAddress + '\\' + this.readOnlySelectedObj.path + ' ?',
          confirmTxt: '确认',
          cancelTxt: '取消'
        })
          .then(() => {
            deleteObj(this.readOnlySelectedObj.id, this).then(() => {
              this.$store.dispatch('fileServer/getDataList', this.pageIndex + 1); //刷新当前页
              this.$toast.show({ type: 'success', text: '删除成功' });
              this.$router.push({ name: 'fileServerList' });
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
              this.$store.dispatch('fileServer/getDataList', this.pageIndex + 1); //刷新当前页
              this.$toast.show({ type: 'success', text: '删除成功' });
              //跳转回主要管理列表
              if (this.$route.name != 'fileServerList') {
                this.$router.push({ name: 'fileServerList' });
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
        this.$router.push({ name: 'editFileServer' });
      }
    },
    refreshClick() {
      this.$store.dispatch('fileServer/getDataList', this.pageIndex + 1); //刷新当前页
      this.$toast.show({ type: 'success', text: '刷新成功' });
    }
  },
  beforeDestroy() {
    //清空store
    this.$store.commit('fileServer/SetSelection', []);
  },
  components: {
    MainToolBar
  }
};
</script>

<style scoped>
.fileServer {
  width: 100%;
  min-width: 600px;
  height: 100%;
}

.topBar {
  display: flex;
  background: #ebebeb;
  width: 100%;
  min-width: 600px;
  height: 40px;
}
</style>
