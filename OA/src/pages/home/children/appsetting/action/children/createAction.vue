<template>
  <div class="createAction">
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
        <btn type="brand" :isForbidden="isForbidden" @click="submit">提交</btn>
      </div>
      <div>
        <btn type="normal" @click="back">返回</btn>
      </div>
    </div>
  </div>
</template>

<script>
import appsetting from 'config/appsettings.json';
import Textbox from 'components/widgets/textbox.vue';
import Selectbox from 'components/widgets/selectbox.vue';
import Btn from 'components/button/btn.vue';

import { postData } from 'netWork/action.js';

export default {
  name: 'CreateSettingItem',
  data() {
    return {
      name: '',
      controllerTtl: '',
      actionTtl: '',
      httpMethod: undefined,
      ord: 0,
      description: '',
      isForbidden: false,
      message: ''
    };
  },
  computed: {
    httpMethodList() {
      return appsetting.request.httpMethods;
    }
  },
  methods: {
    clear() {
      this.$refs.name.clear();
      this.$refs.controllerTtl.clear();
      this.$refs.actionTtl.clear();
      this.$refs.httpMethod.clear();
      this.$refs.ord.clear();
      this.$refs.description.clear();
      this.message = '';
      this.isForbidden = false;
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
          httpMethod: this.httpMethod
        };
        if (this.description) {
          obj.description = this.description;
        }
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
    Selectbox,
    Btn
  }
};
</script>

<style>
div.createAction {
  height: calc(100% - 40px);
}

div.createAction div.grid {
  padding: 10px;
  font-size: 14px;
}

/* #region table圆角 */
div.createAction table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

div.createAction table td {
  border: 1px solid rgb(226, 226, 226);
  border-left: none;
  border-bottom: none;
  padding: 5px 10px;
}

div.createAction table tr:first-child td:first-child {
  border-top-left-radius: 5px; /* 设置table左下圆角 */
}

div.createAction table tr:first-child td:last-child {
  border-top-right-radius: 5px; /* 设置table右下圆角 */
}

div.createAction table tr:last-child td:first-child {
  border-bottom-left-radius: 5px; /* 设置table左下圆角 */
}

div.createAction table tr:last-child td:last-child {
  border-bottom-right-radius: 5px; /* 设置table右下圆角 */
}

div.createAction table tr td:first-child {
  border-left: 1px solid rgb(226, 226, 226);
}

div.createAction table tr:last-child td {
  border-bottom: 1px solid rgb(226, 226, 226);
}
/* #endregion */

div.createAction table tr td:first-child {
  width: 150px;
}

div.createAction div.grid .textBox {
  width: 100%;
}

div.createAction div.grid input {
  width: 60%;
  min-width: 400px;
}

div.createAction div.grid select {
  width: 150px;
}

div.createAction div.grid textarea {
  width: 60%;
  min-width: 400px;
  height: 100px;
}

div.createAction div.grid div.tip {
  display: inline-block;
  color: var(--color-danger);
}

div.createAction div.ctrl {
  display: flex;
}

div.createAction div.ctrl > div {
  width: 50%;
}

div.createAction div.ctrl > div:first-child {
  display: flex;
  justify-content: flex-end;
}

div.createAction div.ctrl button {
  margin: 0px 5px;
}

div.createAction div.ctrl button.isForbidden {
  cursor: not-allowed;
}

div.createAction div.message {
  height: 30px;
  line-height: 30px;
  color: var(--color-danger);
}
</style>
