<template>
  <div class="searchSysParams">
    <div class="workbench">
      <div class="grid">
        <div>
          <div class="ttl">内容:</div>
          <textbox ref="search" v-model="search" :maxlength="64" pattern="/^.{0,64}$/">
            <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
          </textbox>
        </div>
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
        case 61031:
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
  overflow: auto;
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

div.searchSysParams div.grid > div {
  display: grid;
  grid-template-columns: 15% 85%;
  row-gap: 5px;
  padding: 10px;
  border: 1px solid rgb(226, 226, 226);
  border-radius: 5px;
}

div.searchSysParams div.grid div.ttl {
  height: 30px;
  line-height: 30px;
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
