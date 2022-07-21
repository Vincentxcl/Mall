<template>
  <div class="createFileType">
    <div class="workbench">
      <div class="grid">
        <table>
          <tr>
            <td class="ttl">名称:</td>
            <td>
              <textbox ref="title" v-model="title" :maxlength="32" pattern="/^[\u4e00-\u9fa5\w]{1,32}$/g">
                <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
              </textbox>
            </td>
          </tr>
          <tr>
            <td class="ttl">格式:</td>
            <td>
              <textbox ref="format" v-model="format" :maxlength="64" pattern="/^[\w-\.\\/]{1,64}$/">
                <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
              </textbox>
            </td>
          </tr>
          <tr>
            <td class="ttl">存储路径:</td>
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

import { postData } from 'netWork/fileType.js';

export default {
  name: 'CreateFileType',
  mixins: [computedAssistanceBarItems],
  data() {
    return {
      title: '',
      format: '',
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
        case 92051:
          {
            this.clear();
          }
          break;
        default:
          break;
      }
    },
    clear() {
      this.$refs.title.clear();
      this.$refs.format.clear();
      this.$refs.path.clear();
      this.$refs.ord.clear();
      this.$refs.description.clear();
      this.message = '';
      this.isForbidden = false;
    },
    back() {
      this.$router.push({
        name: 'fileTypeList'
      });
    },
    validate() {
      return this.$refs.title.check() && this.$refs.format.check() && this.$refs.path.check() && this.$refs.ord.check() && this.$refs.description.check();
    },
    submit() {
      if (this.validate()) {
        let obj = {
          title: this.title,
          format: this.format,
          path: this.path,
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
div.createFileType {
  height: calc(100% - 40px);
}

div.createFileType div.workbench {
  height: calc(100% - 25px);
  overflow: auto;
}

div.createFileType div.grid {
  padding: 10px;
  font-size: 14px;
}

/* #region table圆角 */
div.createFileType table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

div.createFileType table td {
  border: 1px solid rgb(226, 226, 226);
  border-left: none;
  border-bottom: none;
  padding: 5px 10px;
}

div.createFileType table tr:first-child td:first-child {
  border-top-left-radius: 5px; /* 设置table左下圆角 */
}

div.createFileType table tr:first-child td:last-child {
  border-top-right-radius: 5px; /* 设置table右下圆角 */
}

div.createFileType table tr:last-child td:first-child {
  border-bottom-left-radius: 5px; /* 设置table左下圆角 */
}

div.createFileType table tr:last-child td:last-child {
  border-bottom-right-radius: 5px; /* 设置table右下圆角 */
}

div.createFileType table tr td:first-child {
  border-left: 1px solid rgb(226, 226, 226);
}

div.createFileType table tr:last-child td {
  border-bottom: 1px solid rgb(226, 226, 226);
}
/* #endregion */

div.createFileType table tr td:first-child {
  width: 150px;
}

div.createFileType div.grid .textBox {
  width: 100%;
}

div.createFileType div.grid input {
  width: 60%;
  min-width: 400px;
}

div.createFileType div.grid textarea {
  width: 60%;
  min-width: 400px;
  height: 100px;
}

div.createFileType div.grid div.tip {
  display: inline-block;
  color: var(--color-danger);
}

div.createFileType div.ctrl {
  display: flex;
}

div.createFileType div.ctrl > div {
  width: 50%;
}

div.createFileType div.ctrl > div:first-child {
  display: flex;
  justify-content: flex-end;
}

div.createFileType div.ctrl button {
  margin: 0px 5px;
}

div.createFileType div.ctrl button.isForbidden {
  cursor: not-allowed;
}

div.createFileType div.message {
  height: 30px;
  line-height: 30px;
  color: var(--color-danger);
}

div.createFileType div.assistance {
  display: flex;
  background: #ebebeb;
  width: 100%;
  min-width: 600px;
  height: 25px;
}
</style>
