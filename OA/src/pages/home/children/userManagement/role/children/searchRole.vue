<template>
  <div class="searchRole">
    <div class="grid">
      <table>
        <tr>
          <td class="ttl">内容:</td>
          <td>
            <textbox ref="content" v-model="content" :maxlength="64" pattern="/^.{0,64}$/">
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
        <btn type="normal" @click="clear">重填</btn>
      </div>
    </div>
  </div>
</template>

<script>
import Textbox from 'components/widgets/textbox.vue';
import Btn from 'components/button/btn.vue';

export default {
  name: 'SearchRole',
  data() {
    return {
      content: ''
    };
  },
  methods: {
    clear() {
      this.$refs.content.clear();
    },
    submit() {
      if (this.$refs.content.check()) {
        this.$router.push({
          name: 'searchRoleResult',
          query: {
            content: this.content
          }
        });
        this.clear();
      }
    }
  },
  components: {
    Textbox,
    Btn
  }
};
</script>

<style>
div.searchRole div.grid {
  width: 50%;
  min-width: 500px;
  padding: 10px;
  font-size: 14px;
  margin: auto;
}

/* #region table圆角 */
div.searchRole table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

div.searchRole table td {
  border: 1px solid rgb(226, 226, 226);
  border-left: none;
  border-bottom: none;
  padding: 5px 10px;
}

div.searchRole table tr:first-child td:first-child {
  border-top-left-radius: 5px; /* 设置table左下圆角 */
}

div.searchRole table tr:first-child td:last-child {
  border-top-right-radius: 5px; /* 设置table右下圆角 */
}

div.searchRole table tr:last-child td:first-child {
  border-bottom-left-radius: 5px; /* 设置table左下圆角 */
}

div.searchRole table tr:last-child td:last-child {
  border-bottom-right-radius: 5px; /* 设置table右下圆角 */
}

div.searchRole table tr td:first-child {
  border-left: 1px solid rgb(226, 226, 226);
}

div.searchRole table tr:last-child td {
  border-bottom: 1px solid rgb(226, 226, 226);
}
/* #endregion */

div.searchRole table tr td:first-child {
  width: 100px;
}

div.searchRole div.grid .textBox {
  width: 100%;
}

div.searchRole div.grid input {
  width: 70%;
  min-width: 300px;
}

div.searchRole div.grid div.tip {
  display: inline-block;
  color: var(--color-danger);
}

div.searchRole div.ctrl {
  display: flex;
}

div.searchRole div.ctrl > div {
  width: 50%;
}

div.searchRole div.ctrl > div:first-child {
  display: flex;
  justify-content: flex-end;
}

div.searchRole div.ctrl button {
  margin: 0px 5px;
}
</style>

