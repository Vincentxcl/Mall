<template>
  <div class="user">
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

import { deleteObj, deleteObjs } from 'netWork/userinfo.js';

export default {
  name: 'User',
  mixins: [computedToolBarItem, redirectChildRoute],
  data() {
    return {
      path: '' //保存离开组件时的路径
    };
  },
  computed: {
    pageIndex() {
      return this.$store.getters['user/pageIndex'];
    },
    selectedObj() {
      return this.$store.getters['user/selectedObj'];
    },
    selection() {
      return this.$store.getters['user/selection'];
    }
  },
  methods: {
    toolItemsClick(e) {
      switch (e.id) {
        case 5106:
          {
            this.deleteItemsClick();
          }
          break;
        case 5107:
          {
            this.editItemClick();
          }
          break;
        case 5108:
          {
            this.deleteItemClick();
          }
          break;
        case 5102:
          {
            this.refreshClick();
          }
          break;
        default:
          break;
      }
    },
    deleteItemClick() {
      if (this.selectedObj) {
        this.$confirm({
          type: 'warning',
          content: '是否删除 ' + this.selectedObj.account + ' ?',
          confirmTxt: '确认',
          cancelTxt: '取消'
        })
          .then(() => {
            deleteObj(this.selectedObj.id, this).then(() => {
              this.$store.dispatch('user/getDataList', this.pageIndex + 1); //刷新当前页
              this.$toast.show({ type: 'success', text: '删除成功' });
              this.$router.push({ name: 'userList' });
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
              this.$store.dispatch('user/getDataList', this.pageIndex + 1); //刷新当前页
              this.$toast.show({ type: 'success', text: '删除成功' });
              //跳转回主要管理列表
              if (this.$route.name != 'userList') {
                this.$router.push({ name: 'userList' });
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
      if (this.selectedObj) {
        this.$router.push({ name: 'editUser' });
      }
    },
    refreshClick() {
      this.$store.dispatch('user/getDataList', this.pageIndex + 1); //刷新当前页
      this.$toast.show({ type: 'success', text: '刷新成功' });
    }
  },
  beforeDestroy() {
    //清空store
    this.$store.commit('user/SetSelection', []);
  },
  components: {
    MainToolBar
  }
};
</script>

<style scoped>
.user {
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
