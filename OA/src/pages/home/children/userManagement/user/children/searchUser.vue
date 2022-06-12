<template>
  <div class="searchSysParams">
    <div class="workbench">
      <div class="grid">
        <table>
          <tr>
            <td class="ttl">内容:</td>
            <td>
              <textbox ref="search" v-model="search" :maxlength="64" pattern="/^.{0,64}$/">
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
  name: 'SearchSysParams',
  mixins: [computedAssistanceBarItems],
  data() {
    return {
      search: ''
    };
  },
  methods: {
    toolItemsClick(e) {
      switch (e.id) {
        case 61041:
          {
            this.clear();
          }
          break;
        default:
          break;
      }
    },
    clear() {
      this.$refs.search.clear();
    },
    back() {
      this.$router.push({
        name: 'sysParamsList'
      });
    },
    validate() {
      return this.$refs.search.check();
    },
    submit() {
      if (this.validate()) {
        //构建查询参数对象
        let props = ['search'];
        let query = extractProps(this, props);
        //提交
        if (Object.keys(query).length > 0) {
          this.$router.push({
            name: 'searchSysParamsResult',
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
div.searchSysParams {
  height: calc(100% - 40px);
}

div.searchSysParams div.workbench {
  height: calc(100% - 25px);
  overflow: auto;
}

div.searchSysParams div.grid {
  width: 50%;
  min-width: 500px;
  padding: 10px;
  font-size: 14px;
  margin: auto;
}

/* #region table圆角 */
div.searchSysParams table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

div.searchSysParams table td {
  border: 1px solid rgb(226, 226, 226);
  border-left: none;
  border-bottom: none;
  padding: 5px 10px;
}

div.searchSysParams table tr:first-child td:first-child {
  border-top-left-radius: 5px; /* 设置table左下圆角 */
}

div.searchSysParams table tr:first-child td:last-child {
  border-top-right-radius: 5px; /* 设置table右下圆角 */
}

div.searchSysParams table tr:last-child td:first-child {
  border-bottom-left-radius: 5px; /* 设置table左下圆角 */
}

div.searchSysParams table tr:last-child td:last-child {
  border-bottom-right-radius: 5px; /* 设置table右下圆角 */
}

div.searchSysParams table tr td:first-child {
  border-left: 1px solid rgb(226, 226, 226);
}

div.searchSysParams table tr:last-child td {
  border-bottom: 1px solid rgb(226, 226, 226);
}
/* #endregion */

div.searchSysParams table tr td:first-child {
  width: 100px;
}

div.searchSysParams div.grid .textBox {
  width: 100%;
}

div.searchSysParams div.grid input {
  width: 70%;
  min-width: 300px;
}

div.searchSysParams div.grid div.tip {
  display: inline-block;
  color: var(--color-danger);
}

div.searchSysParams div.ctrl {
  display: flex;
}

div.searchSysParams div.ctrl > div {
  width: 50%;
}

div.searchSysParams div.ctrl > div:first-child {
  display: flex;
  justify-content: flex-end;
}

div.searchSysParams div.ctrl button {
  margin: 0px 5px;
}

div.searchSysParams div.assistance {
  display: flex;
  background: #ebebeb;
  width: 100%;
  min-width: 600px;
  height: 25px;
}
</style>
