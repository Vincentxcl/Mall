<template>
  <div class="sysParamsDetail">
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
import { fillProps } from 'common/helper/convertHelper';
import { requestItem } from 'netWork/appSetting.js';

export default {
  name: 'SysParamsDetail',
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
  activated() {
    //请求数据
    requestItem(this.id, this)
      .then((res) => {
        let ttls = ['title', 'value', 'description', 'ord'];
        //为组件data填充数据
        fillProps(res.data, this, ttls);
      })
      .catch(() => {});
  }
};
</script>

<style>
div.sysParamsDetail {
  width: 100%;
  height: calc(100% - 40px);
}

div.sysParamsDetail div.grid {
  padding: 10px;
  font-size: 14px;
}

/* #region table圆角 */
div.sysParamsDetail table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

div.sysParamsDetail table td {
  border: 1px solid rgb(226, 226, 226);
  border-left: none;
  border-bottom: none;
  padding: 5px 10px;
}

div.sysParamsDetail table tr:first-child td:first-child {
  border-top-left-radius: 5px; /* 设置table左下圆角 */
}

div.sysParamsDetail table tr:first-child td:last-child {
  border-top-right-radius: 5px; /* 设置table右下圆角 */
}

div.sysParamsDetail table tr:last-child td:first-child {
  border-bottom-left-radius: 5px; /* 设置table左下圆角 */
}

div.sysParamsDetail table tr:last-child td:last-child {
  border-bottom-right-radius: 5px; /* 设置table右下圆角 */
}

div.sysParamsDetail table tr td:first-child {
  border-left: 1px solid rgb(226, 226, 226);
}

div.sysParamsDetail table tr:last-child td {
  border-bottom: 1px solid rgb(226, 226, 226);
}
/* #endregion */

div.sysParamsDetail table tr td:first-child {
  width: 150px;
}
</style>
