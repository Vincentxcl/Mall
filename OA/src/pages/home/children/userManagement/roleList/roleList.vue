<template>
  <div class="roleList">
    <div class="strip topBar">
      <div @click="addClick">添加</div>
      <div @click="deleteClick">删除</div>
    </div>

    <grid-view ref="gridview" :gridData="json">
      <!-- selection column -->
      <grid-field type="selection" width="50" fixed="left" align="center"> </grid-field>
      <!-- ctrls -->
      <grid-field fixed="left" label="操作" width="100" align="center">
        <template slot-scope="item">
          <icon icon="icon-bianji" title="编辑" @click.native="editClick(item.scope.row)"></icon>
          <icon icon="icon-shanchu" title="删除" @click.native="deleteItem(item.scope.row)"></icon>
        </template>
      </grid-field>
      <!-- content -->
      <grid-field v-for="item in headItem" :key="item.field" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :show-overflow-tooltip="true"></grid-field>
    </grid-view>

    <div class="strip bottomBar">
      <pagination v-model="pageIndex" :pageCount="pageCount"></pagination>
      <div class="total">总记录:{{ totalCount }}</div>
    </div>
    <!-- popup -->
    <create-Role-item ref="createSettingItem" v-model="isShowCreate" @create="createData"></create-Role-item>
    <edit-Role-item ref="editSettingItem" v-model="isShowEdit" :obj="editObj" @edit="editItem"></edit-Role-item>
  </div>
</template>

<script>
import Icon from 'components/widgets/icon.vue';
import GridView from 'components/grid/oa.v3/GridView.vue';
import GridField from 'components/grid/oa.v3/GridField.vue';
import Pagination from 'components/pagination/v2/Pagination.vue';
import CreateRoleItem from './parts/createRoleItem.vue';
import EditRoleItem from './parts/editRoleItem.vue';

import { trimInObj, getDifferent } from 'common/helper/convertHelper';
import { requestData, postData, patchObj, deleteObj, deleteObjs } from 'netWork/role.js';

export default {
  name: 'RoleList',
  data() {
    return {
      isShowCreate: false,
      isShowEdit: false,
      pageIndex: 0,
      totalCount: 1,
      pageCount: 1,
      headItem: [
        {
          prop: 'name',
          label: '名称',
          width: '200',
          align: 'center'
        },
        {
          prop: 'description',
          label: '描述',
          align: 'center'
        },
        {
          prop: 'ord',
          label: '序号',
          width: '50',
          align: 'center'
        }
      ],
      json: [],
      editObj: {}
    };
  },
  methods: {
    turnToFirstPage() {
      //刷新页面
      if (this.pageIndex == 0) {
        this.getData(1);
      } else {
        this.pageIndex = 0;
      }
    },
    addClick() {
      this.isShowCreate = true;
    },
    editClick(e) {
      this.editObj = trimInObj(e);
      this.isShowEdit = true;
    },
    deleteClick() {
      let arr = this.$refs.gridview.$refs.table.selection;
      if (arr.length > 0) {
        let ids = arr.map((obj) => obj.id).join(',');
        this.$confirm({
          type: 'warning',
          content: '是否删除这 ' + arr.length + ' 项数据?',
          confirmTxt: '确认',
          cancelTxt: '取消'
        })
          .then(() => {
            deleteObjs(ids)
              .then(() => {
                this.getData(this.pageIndex + 1);
                this.$toast.show({ type: 'success', text: '删除成功' });
              })
              .catch((error) => {
                let str = JSON.stringify(error.response.data.errors);
                this.$toast.show({ type: 'danger', text: str });
              });
          })
          .catch(() => {});
      }
    },
    getData(index) {
      requestData(index)
        .then((res) => {
          //页码
          let page = JSON.parse(res.headers['x-pagination']);
          this.totalCount = page.totalCount;
          this.pageCount = page.pageCount;
          this.pageIndex = page.pageIndex - 1;
          //列表
          this.json = res.data.sort((a, b) => {
            if (a.establish > b.establish) return -1;
            else if (a.establish < b.establish) return 1;
            else return 0;
          });
        })
        .catch((error) => {
          this.$toast.show({ type: 'warning', text: error.response.status + ',请重新<a href="/login">登录</a>' });
        });
    },
    createData(e) {
      postData(e)
        .then(() => {
          this.turnToFirstPage();
          this.$refs.createSettingItem.close();
          this.$toast.show({ type: 'success', text: '添加成功' });
        })
        .catch((error) => {
          let str = JSON.stringify(error.response.data.errors);
          this.$refs.createSettingItem.message = str;
        });
    },
    editItem(e) {
      let diff = getDifferent(this.editObj, e);
      if (Object.keys(diff).length > 0) {
        let operations = [];
        for (let prop in diff) {
          let operation = { op: 'replace' };
          operation.path = '/' + prop;
          operation.value = diff[prop];
          operations.push(operation);
        }
        patchObj(this.editObj.id, operations)
          .then(() => {
            this.getData(this.pageIndex + 1);
            this.$refs.editSettingItem.close();
            this.$toast.show({ type: 'success', text: '修改成功' });
          })
          .catch((error) => {
            let str = JSON.stringify(error.response.data.errors);
            this.$refs.editSettingItem.message = str;
          });
      }
      //无变动
      else {
        this.$refs.editSettingItem.close();
      }
    },
    deleteItem(e) {
      this.$confirm({
        type: 'warning',
        content: '是否删除 ' + e.name + ' ?',
        confirmTxt: '确认',
        cancelTxt: '取消'
      })
        .then(() => {
          deleteObj(e.id)
            .then(() => {
              this.getData(this.pageIndex + 1);
              this.$toast.show({ type: 'success', text: '删除成功' });
            })
            .catch((error) => {
              let str = JSON.stringify(error.response.data.errors);
              this.$toast.show({ type: 'danger', text: str });
            });
        })
        .catch(() => {});
    }
  },
  watch: {
    pageIndex: {
      handler(current) {
        this.getData(current + 1);
      }
    }
  },
  created() {
    this.getData(1);
  },
  components: {
    GridView,
    GridField,
    Pagination,
    CreateRoleItem,
    EditRoleItem,
    Icon
  }
};
</script>

<style scoped>
.roleList {
  width: 100%;
  height: 100%;
}

.strip {
  display: flex;
  background: #ebebeb;
  width: 100%;
}

.topBar {
  height: 40px;
}

.topBar > div {
  width: 60px;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  margin: 0px 10px;
}

.topBar > div:hover {
  cursor: pointer;
  color: var(--color-high-text);
}

.bottomBar {
  display: flex;
  height: 25px;
  justify-content: space-between;
}

.total {
  margin-right: 30px;
  line-height: 25px;
  font-size: 14px;
}

.gridView {
  height: calc(100% - 65px);
}

.gridView div.cell i {
  padding: 0px 3px;
  cursor: pointer;
}
</style>
