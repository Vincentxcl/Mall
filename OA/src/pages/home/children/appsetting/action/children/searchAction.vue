<template>
  <div class="searchAction">
    <div class="grid">
      <table>
        <tr>
          <td class="ttl">搜索内容:</td>
          <td>
            <textbox ref="search" v-model="search" :maxlength="64" :required="false" pattern="/^.{0,64}$/">
              <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
            </textbox>
          </td>
        </tr>
        <tr>
          <td class="ttl">名称:</td>
          <td>
            <textbox ref="name" v-model="name" :maxlength="32" :required="false" pattern="/^[\u4e00-\u9fa5A-Za-z0-9_]{1,32}$/g">
              <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
            </textbox>
          </td>
        </tr>
        <tr>
          <td class="ttl">控制器:</td>
          <td>
            <textbox ref="controllerTtl" v-model="controllerTtl" :maxlength="32" :required="false" pattern="/^[A-Za-z0-9_]{1,32}$/g">
              <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
            </textbox>
          </td>
        </tr>
        <tr>
          <td class="ttl">方法:</td>
          <td>
            <textbox ref="actionTtl" v-model="actionTtl" :maxlength="32" :required="false" pattern="/^[A-Za-z0-9_]{1,32}$/">
              <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
            </textbox>
          </td>
        </tr>
        <tr>
          <td class="ttl">请求方式:</td>
          <td>
            <selectbox ref="httpMethod" v-model="httpMethod" :options="httpMethodList" :required="false">
              <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
            </selectbox>
          </td>
        </tr>
      </table>
    </div>
    <div class="ctrl">
      <div>
        <btn type="brand" @click="submit">确定</btn>
      </div>
      <div>
        <btn type="normal" @click="clear">重填</btn>
      </div>
    </div>
  </div>
</template>

<script>
import appsetting from 'config/appsettings.json';

import Textbox from 'components/widgets/textbox.vue';
import Btn from 'components/button/btn.vue';
import Selectbox from 'components/widgets/selectbox.vue';

import { extractProps } from 'common/helper/convertHelper.js';

export default {
  name: 'SearchAction',
  data() {
    return {
      search: '',
      name: '',
      controllerTtl: '',
      actionTtl: '',
      httpMethod: undefined
    };
  },
  computed: {
    httpMethodList() {
      return appsetting.request.httpMethods;
    }
  },
  methods: {
    clear() {
      this.$refs.search.clear();
      this.$refs.name.clear();
      this.$refs.controllerTtl.clear();
      this.$refs.actionTtl.clear();
      this.$refs.httpMethod.clear();
    },
    validate() {
      return this.$refs.search.check() && this.$refs.name.check() && this.$refs.controllerTtl.check() && this.$refs.actionTtl.check() && this.$refs.httpMethod.check();
    },
    submit() {
      if (this.validate()) {
        //构建查询参数对象
        let props = ['search', 'name', 'controllerTtl', 'actionTtl', 'httpMethod'];
        let query = extractProps(this, props);
        //提交
        if (Object.keys(query).length > 0) {
          this.$router.push({
            name: 'searchActionResult',
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
    Selectbox
  }
};
</script>

<style>
div.searchAction {
  height: calc(100% - 40px);
}

div.searchAction div.grid {
  width: 50%;
  min-width: 500px;
  padding: 10px;
  font-size: 14px;
  margin: auto;
}

/* #region table圆角 */
div.searchAction table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

div.searchAction table td {
  border: 1px solid rgb(226, 226, 226);
  border-left: none;
  border-bottom: none;
  padding: 5px 10px;
}

div.searchAction table tr:first-child td:first-child {
  border-top-left-radius: 5px; /* 设置table左下圆角 */
}

div.searchAction table tr:first-child td:last-child {
  border-top-right-radius: 5px; /* 设置table右下圆角 */
}

div.searchAction table tr:last-child td:first-child {
  border-bottom-left-radius: 5px; /* 设置table左下圆角 */
}

div.searchAction table tr:last-child td:last-child {
  border-bottom-right-radius: 5px; /* 设置table右下圆角 */
}

div.searchAction table tr td:first-child {
  border-left: 1px solid rgb(226, 226, 226);
}

div.searchAction table tr:last-child td {
  border-bottom: 1px solid rgb(226, 226, 226);
}
/* #endregion */

div.searchAction table tr td:first-child {
  width: 100px;
}

div.searchAction div.grid .textBox {
  width: 100%;
}

div.searchAction div.grid input {
  width: 70%;
  min-width: 300px;
}

div.searchAction div.grid select {
  height: 30px;
  outline: none;
  border: 1px solid lightgray;
}

div.searchAction div.grid div.tip {
  display: inline-block;
  color: var(--color-danger);
}

div.searchAction div.ctrl {
  display: flex;
}

div.searchAction div.ctrl > div {
  width: 50%;
}

div.searchAction div.ctrl > div:first-child {
  display: flex;
  justify-content: flex-end;
}

div.searchAction div.ctrl button {
  margin: 0px 5px;
}
</style>

