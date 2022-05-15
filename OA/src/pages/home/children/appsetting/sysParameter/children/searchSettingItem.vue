<template>
  <div class="searchSettingItem">
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
  name: 'SearchSettingItem',
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
          name: 'searchSettingItemResult',
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
div.searchSettingItem div.grid {
  width: 50%;
  min-width: 500px;
  padding: 10px;
  font-size: 14px;
  margin: auto;
}

/* #region table圆角 */
div.searchSettingItem table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

div.searchSettingItem table td {
  border: 1px solid rgb(226, 226, 226);
  border-left: none;
  border-bottom: none;
  padding: 5px 10px;
}

div.searchSettingItem table tr:first-child td:first-child {
  border-top-left-radius: 5px; /* 设置table左下圆角 */
}

div.searchSettingItem table tr:first-child td:last-child {
  border-top-right-radius: 5px; /* 设置table右下圆角 */
}

div.searchSettingItem table tr:last-child td:first-child {
  border-bottom-left-radius: 5px; /* 设置table左下圆角 */
}

div.searchSettingItem table tr:last-child td:last-child {
  border-bottom-right-radius: 5px; /* 设置table右下圆角 */
}

div.searchSettingItem table tr td:first-child {
  border-left: 1px solid rgb(226, 226, 226);
}

div.searchSettingItem table tr:last-child td {
  border-bottom: 1px solid rgb(226, 226, 226);
}
/* #endregion */

div.searchSettingItem table tr td:first-child {
  width: 100px;
}

div.searchSettingItem div.grid .textBox {
  width: 100%;
}

div.searchSettingItem div.grid input {
  width: 70%;
  min-width: 300px;
}

div.searchSettingItem div.grid div.tip {
  display: inline-block;
  color: var(--color-danger);
}

div.searchSettingItem div.ctrl {
  display: flex;
}

div.searchSettingItem div.ctrl > div {
  width: 50%;
}

div.searchSettingItem div.ctrl > div:first-child {
  display: flex;
  justify-content: flex-end;
}

div.searchSettingItem div.ctrl button {
  margin: 0px 5px;
}
</style>

