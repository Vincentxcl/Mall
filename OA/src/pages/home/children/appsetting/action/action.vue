<template>
  <div class="action">
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

import { deleteObj, deleteObjs, resetActions } from 'netWork/action.js';
import { deleteCookie } from 'common/helper/cookiesHelper.js';
import { tryGetToken } from 'common/helper/tokenHelper.js';

export default {
  name: 'Action',
  mixins: [computedToolBarItem, redirectChildRoute],
  data() {
    return {
      path: '' //保存离开组件时的路径
    };
  },
  computed: {
    pageIndex() {
      return this.$store.getters['action/pageIndex'];
    },
    readOnlySelectedObj() {
      return this.$store.getters['action/readOnlySelectedObj'];
    },
    selection() {
      return this.$store.getters['action/selection'];
    },
    roleList() {
      return this.$store.getters['action/roleList'];
    }
  },
  methods: {
    toolItemsClick(e) {
      switch (e.id) {
        case 626:
          {
            this.deleteItemsClick();
          }
          break;
        case 627:
          {
            this.editItemClick();
          }
          break;
        case 628:
          {
            this.deleteItemClick();
          }
          break;
        case 622:
          {
            this.refreshClick();
          }
          break;
        case 6212:
          {
            this.resetActions();
          }
          break;
        case 6214:
          {
            this.selectAll();
          }
          break;
        case 6215:
          {
            this.clearSelection();
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
          content: '是否删除 ' + this.readOnlySelectedObj.name + ' ?',
          confirmTxt: '确认',
          cancelTxt: '取消'
        })
          .then(() => {
            deleteObj(this.readOnlySelectedObj.id, this).then(() => {
              this.$store.dispatch('action/getDataList', this.pageIndex + 1); //刷新当前页
              this.$toast.show({ type: 'success', text: '删除成功' });
              this.$router.push({ name: 'actionList' });
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
              this.$store.dispatch('action/getDataList', this.pageIndex + 1); //刷新当前页
              this.$toast.show({ type: 'success', text: '删除成功' });
              //跳转回主要管理列表
              if (this.$route.name != 'actionList') {
                this.$router.push({ name: 'actionList' });
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
        this.$router.push({ name: 'editAction' });
      }
    },
    refreshClick() {
      this.$store.dispatch('action/getDataList', this.pageIndex + 1); //刷新当前页
      this.$toast.show({ type: 'success', text: '刷新成功' });
    },
    resetActions() {
      resetActions(this)
        .then((res) => {
          this.$toast.show({ type: 'success', text: '重置成功，' + res.data });
          deleteCookie('userAuth');
          tryGetToken('userAuth')
            .then(() => {
              this.$toast.show({ type: 'success', text: '刷新令牌，' });
            })
            .catch(() => {
              this.$toast.show({ type: 'warning', text: '令牌刷新失败，' });
            });
        })
        .catch(() => {});
    },
    selectAll() {
      let roleIds = this.roleList.map((val) => val.id);
      this.$store.commit('action/SetSelectedRoleIds', roleIds);
    },
    clearSelection() {
      // 选出当前角色 和 admin 的id////////////
      let roleNames = ['Admin'];
      let role = this.roleList.filter((val) => {
        let result = roleNames.find((n) => {
          return n == val.name;
        });
        return result != undefined;
      });

      if (role.length > 0) {
        let roleIds = role.map((val) => {
          return val.id;
        });
        this.$store.commit('action/SetSelectedRoleIds', roleIds);
      }
    }
  },
  beforeDestroy() {
    //清空store
    this.$store.commit('action/SetSelection', []);
  },
  components: {
    MainToolBar
  }
};
</script>

<style scoped>
.action {
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
