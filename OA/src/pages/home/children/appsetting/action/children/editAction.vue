<template>
  <div class="editAction">
    <div class="workbench">
      <div class="grid">
        <table>
          <tr>
            <td class="ttl">名称:</td>
            <td>
              <textbox ref="name" v-model="name" :maxlength="32" pattern="/^[\u4e00-\u9fa5A-Za-z0-9_]{1,32}$/g">
                <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
              </textbox>
            </td>
          </tr>
          <tr>
            <td class="ttl">状态:</td>
            <td>
              <switch-btn tipOfCheck="启用" tipOfUncheck="禁用" :width="70" v-model="isEnable" />
            </td>
          </tr>
          <tr>
            <td class="ttl">控制器:</td>
            <td>
              <textbox ref="controllerTtl" v-model="controllerTtl" :maxlength="32" pattern="/^[A-Za-z0-9_]{1,32}$/g">
                <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
              </textbox>
            </td>
          </tr>
          <tr>
            <td class="ttl">方法:</td>
            <td>
              <textbox ref="actionTtl" v-model="actionTtl" :maxlength="32" pattern="/^[A-Za-z0-9_]{1,32}$/">
                <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
              </textbox>
            </td>
          </tr>
          <tr>
            <td class="ttl">请求方式:</td>
            <td>
              <selectbox ref="httpMethod" v-model="httpMethod" :options="httpMethodList">
                <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
              </selectbox>
            </td>
          </tr>
          <tr>
            <td class="ttl">排序:</td>
            <td>
              <textbox ref="ord" v-model="ord" :required="false" pattern="/^\d{1,3}$/">
                <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
              </textbox>
            </td>
          </tr>
          <tr>
            <td class="ttl">说明:</td>
            <td>
              <textbox ref="description" type="textarea" v-model="description" :maxlength="64" :required="false" pattern="/^.{0,64}$/">
                <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
              </textbox>
            </td>
          </tr>
        </table>
      </div>
      <div class="ctrl">
        <div>
          <div class="message">{{ message }}</div>
          <btn type="brand" :isForbidden="isForbidden" @click="submit">保存</btn>
        </div>
        <div>
          <btn type="normal" @click="back">返回</btn>
        </div>
      </div>
    </div>
    <div class="assistance">
      <assistance-tool-bar :items="assistanceBarItems" @click="toolItemsClick"></assistance-tool-bar>
    </div>
  </div>
</template>

<script>
import store from 'store/index.js'; // import the store
import { computedAssistanceBarItems } from 'common/mixins/computedAssistanceBarItems';
import Textbox from 'components/widgets/textbox.vue';
import Selectbox from 'components/widgets/selectbox.vue';
import Btn from 'components/button/btn.vue';
import SwitchBtn from 'components/button/switchBtn.vue';
import AssistanceToolBar from 'components/navigation/stl.v1/assistanceToolBar.vue';

import { fillProps, getDifferent, toChainProps } from 'common/helper/convertHelper';
import { patchObj } from 'netWork/action.js';
import appsetting from 'config/appsettings.json';

export default {
  name: 'EditAction',
  mixins: [computedAssistanceBarItems],
  data() {
    return {
      name: '',
      controllerTtl: '',
      actionTtl: '',
      httpMethod: undefined,
      description: null,
      isEnable: false,
      ord: null,
      isForbidden: false, //btn是否可用
      message: '',
      isAccomplished: false //编辑任务完成
    };
  },
  computed: {
    httpMethodList() {
      return appsetting.request.httpMethods;
    },
    pageIndex() {
      return this.$store.getters['action/pageIndex'];
    },
    selectedObj() {
      return this.$store.getters['action/selectedObj'];
    }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  methods: {
    toolItemsClick(e) {
      switch (e.id) {
        case 62101:
          {
            this.$refs.name.clear();
            this.$refs.controllerTtl.clear();
            this.$refs.actionTtl.clear();
            this.$refs.httpMethod.clear();
            this.isEnable = false;
            this.$refs.ord.clear();
            this.$refs.description.clear();
            this.isForbidden = false;
            this.message = '';
          }
          break;
        default:
          break;
      }
    },
    clear() {
      this.$refs.name.clear();
      this.$refs.controllerTtl.clear();
      this.$refs.actionTtl.clear();
      this.$refs.httpMethod.clear();
      this.isEnable = false;
      this.$refs.ord.clear();
      this.$refs.description.clear();
      this.isForbidden = false;
      this.message = '';
      this.$store.dispatch('action/setSelectedObj', null);
    },
    back() {
      this.$router.push({
        name: 'actionList'
      });
    },
    validate() {
      return this.$refs.name.check() && this.$refs.controllerTtl.check() && this.$refs.actionTtl.check() && this.$refs.httpMethod.check() && this.$refs.description.check() && this.$refs.ord.check();
    },
    submit() {
      if (this.validate()) {
        let obj = {
          name: this.name,
          controllerTtl: this.controllerTtl,
          actionTtl: this.actionTtl,
          httpMethod: this.httpMethod,
          isEnable: this.isEnable
        };
        if (this.description) {
          obj.description = this.description;
        }
        if (this.ord) {
          obj.ord = this.ord;
        }

        this.isForbidden = true; //提交按钮禁用，不能再点击
        this.isAccomplished = true;

        //是否发生了变化
        let diff = getDifferent(this.selectedObj, obj);
        if (Object.keys(diff).length > 0) {
          this.message = '正在提交数据';
          this.editItem(diff);
        } else {
          this.isForbidden = false;
          this.back();
        }
      }
    },
    editItem(diff) {
      //构建patch document
      let operations = toChainProps('', diff);
      for (let item of operations) {
        item.op = 'replace';
      }
      //提交修改
      patchObj(this.selectedObj.id, operations, this)
        .then(() => {
          this.$store.dispatch('action/getDataList', this.pageIndex + 1); //刷新当前页
          this.$toast.show({ type: 'success', text: '修改成功' });
          this.back();
        })
        .catch((error) => {
          if (error.response.data) {
            this.message = JSON.stringify(error.response.data);
          }
          this.isForbidden = false;
        });
    }
  },
  activated() {
    this.isAccomplished = false;
    if (this.$route.meta.fromList) {
      // 激活该路由时，从vuex中将数据填入edit表单，用beforeRouteEnter此时不能访问vuex，因此不用！
      if (this.selectedObj && typeof this.selectedObj == 'object') {
        let ttls = ['name', 'controllerTtl', 'actionTtl', 'httpMethod', 'description', 'isEnable', 'ord'];
        fillProps(this.selectedObj, this, ttls);
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    //不能直接通过this访问$store
    if (store.getters['action/selectedObj']) {
      let pages = ['actionList', 'searchActionResult', 'actionDetail'];
      if (pages.indexOf(from.name) > -1) {
        to.meta.fromList = true; //使用meta中变量标识是否从搜索控件跳转过来
      }
      next();
    } else {
      //导航到列表
      let currentNode = store.getters.siteNodes.find((val) => to.name == val.routeName);
      if (currentNode.substitutionTagSiteNodeId) {
        let subNode = store.getters.siteNodes.find((val) => val.id == currentNode.substitutionTagSiteNodeId); //获取当前节点的替代节点
        next({ name: subNode.routeName });
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    from.meta.fromList = false; //重置meta fromSearch设置

    let arr = ['actionList', 'createAction'];

    if (this.isAccomplished) {
      this.clear();
      next();
    }
    // 如果离开到sysParameter之下的其他组件时，再访问edit时会重新dispatch对象，所有数据会重置，因此提示
    else if (arr.find((i) => i.toLowerCase() == to.name.toLowerCase())) {
      this.$confirm({
        type: 'warning',
        content: '是否退出编辑模式?',
        confirmTxt: '确认',
        cancelTxt: '取消'
      })
        .then(() => {
          this.clear();
          next();
        })
        .catch(() => {});
    }
    //保存修改状态，确保再来时的数据不丢失
    else {
      next();
    }
  },
  components: {
    Textbox,
    SwitchBtn,
    Selectbox,
    Btn,
    AssistanceToolBar
  }
};
</script>

<style>
div.editAction {
  height: calc(100% - 40px);
}

div.editAction div.workbench {
  height: calc(100% - 25px);
  overflow: auto;
}

div.editAction div.grid {
  padding: 10px;
  font-size: 14px;
}

/* #region table圆角 */
div.editAction table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

div.editAction table td {
  border: 1px solid rgb(226, 226, 226);
  border-left: none;
  border-bottom: none;
  padding: 5px 10px;
}

div.editAction table tr:first-child td:first-child {
  border-top-left-radius: 5px; /* 设置table左下圆角 */
}

div.editAction table tr:first-child td:last-child {
  border-top-right-radius: 5px; /* 设置table右下圆角 */
}

div.editAction table tr:last-child td:first-child {
  border-bottom-left-radius: 5px; /* 设置table左下圆角 */
}

div.editAction table tr:last-child td:last-child {
  border-bottom-right-radius: 5px; /* 设置table右下圆角 */
}

div.editAction table tr td:first-child {
  border-left: 1px solid rgb(226, 226, 226);
}

div.editAction table tr:last-child td {
  border-bottom: 1px solid rgb(226, 226, 226);
}
/* #endregion */

div.editAction table tr td:first-child {
  width: 150px;
}

div.editAction div.grid .textBox {
  width: 100%;
}

div.editAction div.grid input {
  width: 60%;
  min-width: 400px;
}

div.editAction div.grid select {
  width: 150px;
}

div.editAction div.grid textarea {
  width: 60%;
  min-width: 400px;
  height: 100px;
}

div.editAction div.grid div.tip {
  display: inline-block;
  color: var(--color-danger);
}

div.editAction div.ctrl {
  display: flex;
}

div.editAction div.ctrl > div {
  width: 50%;
}

div.editAction div.ctrl > div:first-child {
  display: flex;
  justify-content: flex-end;
}

div.editAction div.ctrl button {
  margin: 0px 5px;
}

div.editAction div.ctrl button.isForbidden {
  cursor: not-allowed;
}

div.editAction div.message {
  height: 30px;
  line-height: 30px;
  color: var(--color-danger);
}

div.editAction div.assistance {
  display: flex;
  background: #ebebeb;
  width: 100%;
  min-width: 600px;
  height: 25px;
}
</style>
