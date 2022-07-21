<template>
  <div class="searchUser">
    <div class="workbench">
      <div class="grid">
        <div>
          <div class="ttl">姓名:</div>
          <text-box ref="name" v-model="name" :maxlength="16" :required="false" title="姓名" pattern="/^[0-9a-zA-Z\u4e00-\u9fa5]{1,16}$/g">
            <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
          </text-box>
          <div class="ttl">性别:</div>
          <div>
            <label> <input type="radio" name="sex" value="1" v-model="gender" />男 </label>
            <label> <input type="radio" name="sex" value="0" v-model="gender" />女 </label>
          </div>
          <div class="ttl">电话:</div>
          <text-box ref="phone" v-model="phone" :maxlength="11" :required="false" title="Tel" pattern="/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/">
            <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
          </text-box>
          <div class="ttl">邮箱:</div>
          <text-box ref="email" v-model="email" :maxlength="64" :required="false" title="邮箱" pattern="/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/">
            <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
          </text-box>
          <div class="ttl">内容:</div>
          <text-box ref="search" v-model="search" :maxlength="64" :required="false" title="模糊查询" pattern="/^.{0,64}$/">
            <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
          </text-box>
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
import TextBox from 'components/widgets/textbox.vue';
import Btn from 'components/button/btn.vue';
import AssistanceToolBar from 'components/navigation/stl.v1/assistanceToolBar.vue';

import { extractProps } from 'common/helper/convertHelper.js';

export default {
  name: 'SearchUser',
  mixins: [computedAssistanceBarItems],
  data() {
    return {
      name: '',
      gender: undefined,
      phone: '',
      email: '',
      search: ''
    };
  },
  methods: {
    toolItemsClick(e) {
      switch (e.id) {
        case 51031:
          {
            this.clear();
          }
          break;
        default:
          break;
      }
    },
    clear() {
      this.$refs.name.clear();
      this.gender = undefined;
      this.$refs.phone.clear();
      this.$refs.email.clear();
      this.$refs.search.clear();
    },
    back() {
      this.$router.push({
        name: 'userList'
      });
    },
    validate() {
      return this.$refs.name.check() && this.$refs.phone.check() && this.$refs.email.check() && this.$refs.search.check();
    },
    submit() {
      if (this.validate()) {
        //构建查询参数对象
        let props = ['name', 'gender', 'phone', 'email', 'search'];
        let query = extractProps(this, props);
        //提交
        if (Object.keys(query).length > 0) {
          this.$router.push({
            name: 'searchUserResult',
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
    TextBox,
    Btn,
    AssistanceToolBar
  }
};
</script>

<style>
div.searchUser {
  height: calc(100% - 40px);
  overflow: auto;
}

div.searchUser div.workbench {
  height: calc(100% - 25px);
  overflow: auto;
}

div.searchUser div.grid {
  width: 50%;
  min-width: 500px;
  padding: 10px;
  font-size: 14px;
  margin: auto;
}

div.searchUser div.grid > div {
  display: grid;
  grid-template-columns: 15% 85%;
  justify-content: start;
  align-items: center;
  row-gap: 5px;
  padding: 10px;
  border: 1px solid rgb(226, 226, 226);
  border-radius: 5px;
}

div.searchUser div.grid div.ttl {
  height: 30px;
  line-height: 30px;
}

div.searchUser div.grid .textBox {
  width: 100%;
}

div.searchUser div.grid input[type='text'] {
  width: 70%;
  min-width: 300px;
}

div.searchUser div.grid input[type='radio'] {
  margin: 0px 5px;
}

div.searchUser div.grid div.tip {
  display: inline-block;
  color: var(--color-danger);
}

div.searchUser div.ctrl {
  display: flex;
}

div.searchUser div.ctrl > div {
  width: 50%;
}

div.searchUser div.ctrl > div:first-child {
  display: flex;
  justify-content: flex-end;
}

div.searchUser div.ctrl button {
  margin: 0px 5px;
}

div.searchUser div.assistance {
  display: flex;
  background: #ebebeb;
  width: 100%;
  min-width: 600px;
  height: 25px;
}
</style>
