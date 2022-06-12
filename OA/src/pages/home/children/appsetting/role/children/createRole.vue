<template>
  <div class="createRole">
    <div class="grid">
      <table>
        <tr>
          <td class="ttl">名称:</td>
          <td>
            <textbox ref="name" v-model="name" :maxlength="32" pattern="/^[0-9a-zA-Z\u4e00-\u9fa5]{0,32}$/g">
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
            <textbox ref="description" type="textarea" v-model="description" :maxlength="128" pattern="/^.{0,64}$/">
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
</template>

<script>
import Textbox from 'components/widgets/textbox.vue';
import Btn from 'components/button/btn.vue';

import { postData } from 'netWork/role.js';

export default {
  name: 'CreateSettingItem',
  data() {
    return {
      name: '',
      ord: 0,
      description: '',
      isForbidden: false,
      message: ''
    };
  },
  methods: {
    clear() {
      this.$refs.name.clear();
      this.$refs.ord.clear();
      this.$refs.description.clear();
      this.message = '';
      this.isForbidden = false;
    },
    back() {
      this.$router.push({
        name: 'roleList'
      });
    },
    validate(){
      return this.$refs.name.check() && this.$refs.ord.check() && this.$refs.description.check();
    },
    submit() {
      if (this.validate()) {
        let obj = {
          name: this.name,
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
          let str;
          if (error.response.data) {
            str = JSON.stringify(error.response.data.errors);
          }
          this.message = str;
          this.isForbidden = false;
        });
    }
  },
  components: {
    Textbox,
    Btn
  }
};
</script>

<style>
div.createRole div.grid {
  padding: 10px;
  font-size: 14px;
}

/* #region table圆角 */
div.createRole table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

div.createRole table td {
  border: 1px solid rgb(226, 226, 226);
  border-left: none;
  border-bottom: none;
  padding: 5px 10px;
}

div.createRole table tr:first-child td:first-child {
  border-top-left-radius: 5px; /* 设置table左下圆角 */
}

div.createRole table tr:first-child td:last-child {
  border-top-right-radius: 5px; /* 设置table右下圆角 */
}

div.createRole table tr:last-child td:first-child {
  border-bottom-left-radius: 5px; /* 设置table左下圆角 */
}

div.createRole table tr:last-child td:last-child {
  border-bottom-right-radius: 5px; /* 设置table右下圆角 */
}

div.createRole table tr td:first-child {
  border-left: 1px solid rgb(226, 226, 226);
}

div.createRole table tr:last-child td {
  border-bottom: 1px solid rgb(226, 226, 226);
}
/* #endregion */

div.createRole table tr td:first-child {
  width: 150px;
}

div.createRole div.grid .textBox {
  width: 100%;
}

div.createRole div.grid input {
  width: 60%;
  min-width: 400px;
}

div.createRole div.grid textarea {
  width: 60%;
  min-width: 400px;
  height: 100px;
}

div.createRole div.grid div.tip {
  display: inline-block;
  color: var(--color-danger);
}

div.createRole div.ctrl {
  display: flex;
}

div.createRole div.ctrl > div {
  width: 50%;
}

div.createRole div.ctrl > div:first-child {
  display: flex;
  justify-content: flex-end;
}

div.createRole div.ctrl button {
  margin: 0px 5px;
}

div.createRole div.ctrl button.isForbidden {
  cursor: not-allowed;
}

div.createRole div.message {
  height: 30px;
  line-height: 30px;
  color: var(--color-danger);
}
</style>
