<template>
  <div class="fileServerDetail">
    <div class="grid">
      <table>
        <tr>
          <td class="ttl">硬盘Ip地址:</td>
          <td>
            {{ ipAddress }}
          </td>
        </tr>
        <tr>
          <td class="ttl">文件路径:</td>
          <td>
            {{ path }}
          </td>
        </tr>
        <tr>
          <td class="ttl">状态</td>
          <td>
            <span v-if="isEnable" class="enable">启用中</span>
            <span v-if="!isEnable" class="disable">禁用中</span>
          </td>
        </tr>
        <tr>
          <td class="ttl">使用率:</td>
          <td>
            {{ diskCapacity }}
          </td>
        </tr>
        <tr>
          <td class="ttl">排序:</td>
          <td>
            {{ ord }}
          </td>
        </tr>
        <tr>
          <td class="ttl">创建时间:</td>
          <td>
            {{ adjustedEstablish }}
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
import { dateFormat, fillProps } from 'common/helper/convertHelper';
import { requestItem } from 'netWork/fileServer.js';

export default {
  name: 'FileServerDetail',
  data() {
    return {
      ipAddress: '',
      path: '',
      diskCapacity: '',
      ord: 0,
      establish: '',
      description: '',
      isEnable: false
    };
  },
  computed: {
    adjustedEstablish() {
      return dateFormat(this.establish);
    }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  activated() {
    if (this.$route.meta.fromList) {
      //请求数据
      requestItem(this.id, this)
        .then((res) => {
          let ttls = ['ipAddress', 'path', 'diskCapacity', 'description', 'ord', 'establish', 'isEnable'];
          //为组件data填充数据
          fillProps(res.data, this, ttls);
        })
        .catch(() => {});
    }
  },
  beforeRouteEnter(to, from, next) {
    let pages = ['fileServerList', 'searchFileServerResult'];
    if (pages.indexOf(from.name) > -1) {
      to.meta.fromList = true; //使用meta中变量标识是否从搜索控件跳转过来
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    from.meta.fromList = false; //重置meta fromSearch设置
    next();
  }
};
</script>

<style>
div.fileServerDetail {
  width: 100%;
  height: calc(100% - 40px);
}

div.fileServerDetail div.grid {
  padding: 10px;
  font-size: 14px;
}

/* #region table圆角 */
div.fileServerDetail table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

div.fileServerDetail table td {
  border: 1px solid rgb(226, 226, 226);
  border-left: none;
  border-bottom: none;
  padding: 5px 10px;
}

div.fileServerDetail table tr:first-child td:first-child {
  border-top-left-radius: 5px; /* 设置table左下圆角 */
}

div.fileServerDetail table tr:first-child td:last-child {
  border-top-right-radius: 5px; /* 设置table右下圆角 */
}

div.fileServerDetail table tr:last-child td:first-child {
  border-bottom-left-radius: 5px; /* 设置table左下圆角 */
}

div.fileServerDetail table tr:last-child td:last-child {
  border-bottom-right-radius: 5px; /* 设置table右下圆角 */
}

div.fileServerDetail table tr td:first-child {
  border-left: 1px solid rgb(226, 226, 226);
}

div.fileServerDetail table tr:last-child td {
  border-bottom: 1px solid rgb(226, 226, 226);
}
/* #endregion */

div.fileServerDetail table tr td:first-child {
  width: 150px;
}

div.fileServerDetail table tr td span.enable {
  display: inline-block;
  color: white;
  font-size: 12px;
  width: 60px;
  height: 18px;
  line-height: 18px;
  border-radius: 9px;
  background-color: var(--color-success);
  text-align: center;
}

div.fileServerDetail table tr td span.disable {
  display: inline-block;
  color: white;
  font-size: 12px;
  width: 60px;
  height: 18px;
  line-height: 18px;
  border-radius: 9px;
  background-color: var(--color-danger);
  text-align: center;
}
</style>
