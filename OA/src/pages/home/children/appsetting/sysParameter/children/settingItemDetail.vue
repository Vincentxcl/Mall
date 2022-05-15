<template>
  <div class="settingItemDetail">
    <div class="grid">
      <table>
        <tr>
          <td class="ttl">名称:</td>
          <td>
            {{ title }}
          </td>
        </tr>
        <tr>
          <td class="ttl">属性:</td>
          <td>
            {{ value }}
          </td>
        </tr>
        <tr>
          <td class="ttl">排序:</td>
          <td>
            {{ ord }}
          </td>
        </tr>
        <tr>
          <td class="ttl">说明:</td>
          <td>
            {{ description }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { requestItem } from 'netWork/appSetting.js';

export default {
  name: 'SettingItemDetail',
  data() {
    return {
      title: '',
      value: '',
      ord: 0,
      description: ''
    };
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  methods: {
    //将对象的属性分别填入组件的data
    fill(obj) {
      if (typeof obj == 'object') {
        let ttls = ['title', 'value', 'description', 'ord'];
        for (let item of ttls) {
          if (Reflect.get(obj, item) != undefined) {
            this[item] = Reflect.get(obj, item);
          }
        }
      }
    }
  },
  activated() {
    requestItem(this.id, this)
      .then((res) => {
        this.fill(res.data);
      })
      .catch(() => {});
  }
};
</script>

<style>
div.settingItemDetail div.grid {
  padding: 10px;
  font-size: 14px;
}

/* #region table圆角 */
div.settingItemDetail table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

div.settingItemDetail table td {
  border: 1px solid rgb(226, 226, 226);
  border-left: none;
  border-bottom: none;
  padding: 5px 10px;
}

div.settingItemDetail table tr:first-child td:first-child {
  border-top-left-radius: 5px; /* 设置table左下圆角 */
}

div.settingItemDetail table tr:first-child td:last-child {
  border-top-right-radius: 5px; /* 设置table右下圆角 */
}

div.settingItemDetail table tr:last-child td:first-child {
  border-bottom-left-radius: 5px; /* 设置table左下圆角 */
}

div.settingItemDetail table tr:last-child td:last-child {
  border-bottom-right-radius: 5px; /* 设置table右下圆角 */
}

div.settingItemDetail table tr td:first-child {
  border-left: 1px solid rgb(226, 226, 226);
}

div.settingItemDetail table tr:last-child td {
  border-bottom: 1px solid rgb(226, 226, 226);
}
/* #endregion */

div.settingItemDetail table tr td:first-child {
  width: 150px;
}
</style>
