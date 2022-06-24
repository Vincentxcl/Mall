<template>
  <div class="searchFileType">
    <div class="workbench">
      <div class="grid">
        <table>
          <tr>
            <td class="ttl">名称:</td>
            <td>
              <textbox ref="title" v-model="title" :maxlength="32" :required="false" pattern="/^.{1,32}$/g">
                <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
              </textbox>
            </td>
          </tr>
          <tr>
            <td class="ttl">格式:</td>
            <td>
              <textbox ref="format" v-model="format" :maxlength="64" :required="false" pattern="/^.{0,64}$/">
                <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
              </textbox>
            </td>
          </tr>
          <tr>
            <td class="ttl">内容:</td>
            <td>
              <textbox ref="search" v-model="search" :maxlength="64" :required="false" pattern="/^.{0,64}$/">
                <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
              </textbox>
            </td>
          </tr>
        </table>
      </div>
      <div class="ctrl">
        <div>
          <btn type="brand" @click="submit">确定</btn>
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

import { extractProps } from 'common/helper/convertHelper.js';

export default {
  name: 'SearchFileType',
  mixins: [computedAssistanceBarItems],
  data() {
    return {
      title: '',
      format: '',
      search: ''
    };
  },
  methods: {
    toolItemsClick(e) {
      switch (e.id) {
        case 92031:
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
      this.$refs.search.clear();
    },
    back() {
      this.$router.push({
        name: 'fileTypeList'
      });
    },
    validate() {
      return this.$refs.title.check() && this.$refs.format && this.$refs.search.check();
    },
    submit() {
      if (this.validate()) {
        //构建查询参数对象
        let props = ['title', 'format', 'search'];
        let query = extractProps(this, props);
        //提交
        if (Object.keys(query).length > 0) {
          this.$router.push({
            name: 'searchFileTypeResult',
            query: query
          });
          this.clear();
        }
        //
        else {
          this.$toast.show({ type: 'normal', text: '请填写搜索项' });
        }
      }
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
div.searchFileType {
  height: calc(100% - 40px);
}

div.searchFileType div.workbench {
  height: calc(100% - 25px);
  overflow: auto;
}

div.searchFileType div.grid {
  width: 50%;
  min-width: 500px;
  padding: 10px;
  font-size: 14px;
  margin: auto;
}

/* #region table圆角 */
div.searchFileType table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

div.searchFileType table td {
  border: 1px solid rgb(226, 226, 226);
  border-left: none;
  border-bottom: none;
  padding: 5px 10px;
}

div.searchFileType table tr:first-child td:first-child {
  border-top-left-radius: 5px; /* 设置table左下圆角 */
}

div.searchFileType table tr:first-child td:last-child {
  border-top-right-radius: 5px; /* 设置table右下圆角 */
}

div.searchFileType table tr:last-child td:first-child {
  border-bottom-left-radius: 5px; /* 设置table左下圆角 */
}

div.searchFileType table tr:last-child td:last-child {
  border-bottom-right-radius: 5px; /* 设置table右下圆角 */
}

div.searchFileType table tr td:first-child {
  border-left: 1px solid rgb(226, 226, 226);
}

div.searchFileType table tr:last-child td {
  border-bottom: 1px solid rgb(226, 226, 226);
}
/* #endregion */

div.searchFileType table tr td:first-child {
  width: 100px;
}

div.searchFileType div.grid .textBox {
  width: 100%;
}

div.searchFileType div.grid input {
  width: 70%;
  min-width: 300px;
}

div.searchFileType div.grid div.tip {
  display: inline-block;
  color: var(--color-danger);
}

div.searchFileType div.ctrl {
  display: flex;
}

div.searchFileType div.ctrl > div {
  width: 50%;
}

div.searchFileType div.ctrl > div:first-child {
  display: flex;
  justify-content: flex-end;
}

div.searchFileType div.ctrl button {
  margin: 0px 5px;
}

div.searchFileType div.assistance {
  display: flex;
  background: #ebebeb;
  width: 100%;
  min-width: 600px;
  height: 25px;
}
</style>
