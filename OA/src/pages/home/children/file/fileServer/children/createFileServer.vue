<template>
  <div class="createFileServer">
    <div class="workbench">
      <div class="grid">
        <table>
          <tr>
            <td class="ttl">文件服务器IP地址:</td>
            <td>
              <textbox ref="ipAddress" v-model="ipAddress" :maxlength="32" pattern="/^[\w-:\.\\]{1,32}$/g">
                <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
              </textbox>
            </td>
          </tr>
          <tr>
            <td class="ttl">文件路径:</td>
            <td>
              <textbox ref="path" v-model="path" :maxlength="64" pattern="/^[\w-\.\\]{1,64}$/g">
                <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
              </textbox>
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
              <textbox ref="description" type="textarea" v-model="description" :required="false" :maxlength="128" pattern="/^.{0,128}$/">
                <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
              </textbox>
            </td>
          </tr>
        </table>
      </div>
      <div class="ctrl">
        <div>
          <div class="message">{{ message }}</div>
          <btn type="brand" :isForbidden="isForbidden" @click="submit">提交</btn>
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
import { computedAssistanceBarItems } from 'common/mixins/computedAssistanceBarItems';
import Textbox from 'components/widgets/textbox.vue';
import Btn from 'components/button/btn.vue';
import AssistanceToolBar from 'components/navigation/stl.v1/assistanceToolBar.vue';

import { postData } from 'netWork/fileServer.js';

export default {
  name: 'CreateFileServer',
  mixins: [computedAssistanceBarItems],
  data() {
    return {
      ipAddress: '',
      path: '',
      ord: 0,
      description: '',
      isForbidden: false,
      message: ''
    };
  },
  methods: {
    toolItemsClick(e) {
      switch (e.id) {
        case 91051:
          {
            this.clear();
          }
          break;
        default:
          break;
      }
    },
    clear() {
      this.$refs.ipAddress.clear();
      this.$refs.path.clear();
      this.$refs.ord.clear();
      this.$refs.description.clear();
      this.message = '';
      this.isForbidden = false;
    },
    back() {
      this.$router.push({
        name: 'fileServerList'
      });
    },
    validate() {
      return this.$refs.ipAddress.check() && this.$refs.path.check() && this.$refs.ord.check() && this.$refs.description.check();
    },
    submit() {
      if (this.validate()) {
        let obj = {
          address: {
            ipAddress: this.ipAddress,
            path: this.path
          },
          description: this.description
        };
        if (this.ord) {
          obj.ord = this.ord;
        }
        this.isForbidden = true; //提交按钮禁用，不能再点击
        this.message = '正在提交数据';
        this.createData(obj);
      }
    },
    createData(e) {
      postData(e, this)
        .then(() => {
          this.$toast.show({ type: 'success', text: '添加成功' });
          this.clear();
        })
        .catch((error) => {
          if (error.response.data) {
            this.message = JSON.stringify(error.response.data);
          }
          this.isForbidden = false;
        });
    }
  },
  components: {
    Textbox,
    Btn,
    AssistanceToolBar
  }
};
</script>

<style>
div.createFileServer {
  height: calc(100% - 40px);
}

div.createFileServer div.workbench {
  height: calc(100% - 25px);
  overflow: auto;
}

div.createFileServer div.grid {
  padding: 10px;
  font-size: 14px;
}

/* #region table圆角 */
div.createFileServer table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

div.createFileServer table td {
  border: 1px solid rgb(226, 226, 226);
  border-left: none;
  border-bottom: none;
  padding: 5px 10px;
}

div.createFileServer table tr:first-child td:first-child {
  border-top-left-radius: 5px; /* 设置table左下圆角 */
}

div.createFileServer table tr:first-child td:last-child {
  border-top-right-radius: 5px; /* 设置table右下圆角 */
}

div.createFileServer table tr:last-child td:first-child {
  border-bottom-left-radius: 5px; /* 设置table左下圆角 */
}

div.createFileServer table tr:last-child td:last-child {
  border-bottom-right-radius: 5px; /* 设置table右下圆角 */
}

div.createFileServer table tr td:first-child {
  border-left: 1px solid rgb(226, 226, 226);
}

div.createFileServer table tr:last-child td {
  border-bottom: 1px solid rgb(226, 226, 226);
}
/* #endregion */

div.createFileServer table tr td:first-child {
  width: 150px;
}

div.createFileServer div.grid .textBox {
  width: 100%;
}

div.createFileServer div.grid input {
  width: 60%;
  min-width: 400px;
}

div.createFileServer div.grid textarea {
  width: 60%;
  min-width: 400px;
  height: 100px;
}

div.createFileServer div.grid div.tip {
  display: inline-block;
  color: var(--color-danger);
}

div.createFileServer div.ctrl {
  display: flex;
}

div.createFileServer div.ctrl > div {
  width: 50%;
}

div.createFileServer div.ctrl > div:first-child {
  display: flex;
  justify-content: flex-end;
}

div.createFileServer div.ctrl button {
  margin: 0px 5px;
}

div.createFileServer div.ctrl button.isForbidden {
  cursor: not-allowed;
}

div.createFileServer div.message {
  height: 30px;
  line-height: 30px;
  color: var(--color-danger);
}

div.createFileServer div.assistance {
  display: flex;
  background: #ebebeb;
  width: 100%;
  min-width: 600px;
  height: 25px;
}
</style>
