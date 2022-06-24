<template>
  <div class="searchFileServer">
    <div class="workbench">
      <div class="grid">
        <table>
          <tr>
            <td class="ttl">文件服务器IP地址:</td>
            <td>
              <textbox ref="ipAddress" v-model="ipAddress" :maxlength="32" :required="false" pattern="/^.{0,32}$/g">
                <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
              </textbox>
            </td>
          </tr>
          <tr>
            <td class="ttl">文件路径:</td>
            <td>
              <textbox ref="path" v-model="path" :maxlength="64" :required="false" pattern="/^.{0,64}$/g">
                <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
              </textbox>
            </td>
          </tr>
          <tr class="range">
            <td class="ttl">使用率的范围:</td>
            <td>
              <p>
                <span>Min：</span>
                <input type="range" min="0" max="1" step="0.01" v-model="diskCapacityGreaterThanOrEqual" />
                <input type="text" class="range" disabled v-model="diskCapacityGreaterThanOrEqual" />
              </p>
              <p>
                <span>Max：</span>
                <input type="range" min="0" max="1" step="0.01" v-model="diskCapacityLessThanOrEqual" />
                <input type="text" class="range" disabled v-model="diskCapacityLessThanOrEqual" />
              </p>
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
  name: 'SearchFileServer',
  mixins: [computedAssistanceBarItems],
  data() {
    return {
      ipAddress: '',
      path: '',
      diskCapacityGreaterThanOrEqual: undefined,
      diskCapacityLessThanOrEqual: undefined,
      search: ''
    };
  },
  methods: {
    toolItemsClick(e) {
      switch (e.id) {
        case 91031:
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
      this.$refs.search.clear();
      this.diskCapacityGreaterThanOrEqual = undefined;
      this.diskCapacityLessThanOrEqual = undefined;
    },
    back() {
      this.$router.push({
        name: 'fileServerList'
      });
    },
    validate() {
      return this.$refs.ipAddress.check() && this.$refs.path.check() && this.$refs.search.check();
    },
    submit() {
      if (this.validate()) {
        //构建查询参数对象
        let props = ['ipAddress', 'path', 'diskCapacityGreaterThanOrEqual', 'diskCapacityLessThanOrEqual', 'search'];
        let query = extractProps(this, props);
        //提交
        if (Object.keys(query).length > 0) {
          this.$router.push({
            name: 'searchFileServerResult',
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
  watch: {
    diskCapacityGreaterThanOrEqual: {
      handler(current) {
        if (current >= this.diskCapacityLessThanOrEqual) {
          this.diskCapacityLessThanOrEqual = current;
        }
      }
    },
    diskCapacityLessThanOrEqual: {
      handler(current) {
        if (current <= this.diskCapacityGreaterThanOrEqual) {
          this.diskCapacityGreaterThanOrEqual = current;
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
div.searchFileServer {
  height: calc(100% - 40px);
}

div.searchFileServer div.workbench {
  height: calc(100% - 25px);
  overflow: auto;
}

div.searchFileServer div.grid {
  width: 60%;
  min-width: 500px;
  padding: 10px;
  font-size: 14px;
  margin: auto;
}

/* #region table圆角 */
div.searchFileServer table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

div.searchFileServer table td {
  border: 1px solid rgb(226, 226, 226);
  border-left: none;
  border-bottom: none;
  padding: 5px 10px;
}

div.searchFileServer table tr:first-child td:first-child {
  border-top-left-radius: 5px; /* 设置table左下圆角 */
}

div.searchFileServer table tr:first-child td:last-child {
  border-top-right-radius: 5px; /* 设置table右下圆角 */
}

div.searchFileServer table tr:last-child td:first-child {
  border-bottom-left-radius: 5px; /* 设置table左下圆角 */
}

div.searchFileServer table tr:last-child td:last-child {
  border-bottom-right-radius: 5px; /* 设置table右下圆角 */
}

div.searchFileServer table tr td:first-child {
  border-left: 1px solid rgb(226, 226, 226);
}

div.searchFileServer table tr:last-child td {
  border-bottom: 1px solid rgb(226, 226, 226);
}
/* #endregion */

div.searchFileServer table tr td:first-child {
  width: 150px;
}

div.searchFileServer div.grid .textBox {
  width: 100%;
}

div.searchFileServer div.grid .textBox input {
  width: 70%;
  min-width: 300px;
}

div.searchFileServer div.grid tr.range span {
  display: inline-block;
  width: 60px;
}

div.searchFileServer div.grid input[type='range'] {
  width: 200px;
}

div.searchFileServer div.grid input.range {
  width: 50px;
  height: 30px;
  text-align: center;
}

div.searchFileServer div.grid div.tip {
  display: inline-block;
  color: var(--color-danger);
}

div.searchFileServer div.ctrl {
  display: flex;
}

div.searchFileServer div.ctrl > div {
  width: 50%;
}

div.searchFileServer div.ctrl > div:first-child {
  display: flex;
  justify-content: flex-end;
}

div.searchFileServer div.ctrl button {
  margin: 0px 5px;
}

div.searchFileServer div.assistance {
  display: flex;
  background: #ebebeb;
  width: 100%;
  min-width: 600px;
  height: 25px;
}
</style>
