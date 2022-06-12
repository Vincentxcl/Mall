<template>
  <div class="actionDetail">
    <div class="grid">
      <table>
        <tr>
          <td class="ttl">名称:</td>
          <td>
            {{ name }}
          </td>
        </tr>
        <tr>
          <td class="ttl">控制器:</td>
          <td>
            {{ controllerTtl }}
          </td>
        </tr>
        <tr>
          <td class="ttl">方法:</td>
          <td>
            {{ actionTtl }}
          </td>
        </tr>
        <tr>
          <td class="ttl">请求方式:</td>
          <td>
            {{ httpMethod }}
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
        <tr>
          <td class="ttl">具有该权限的角色（{{ actionRolesArray.length }}项）:</td>
          <td>
            <template v-if="actionRolesArray.length > 0">
              <label v-for="item of actionRolesArray" class="role" :key="item.role.id" :title="item.role.description" :style="labelStyle()"> {{ item.role.name }} </label>
            </template>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { fillProps } from 'common/helper/convertHelper';
import { randomColor } from 'common/helper/randomHelper';
import * as action from 'netWork/action.js';
import * as roleActions from 'netWork/roleAction.js';

export default {
  name: 'ActionDetail',
  data() {
    return {
      name: '',
      controllerTtl: '',
      actionTtl: '',
      httpMethod: '',
      ord: 0,
      description: '',
      actionRolesArray: []
    };
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  methods: {
    labelStyle() {
      return {
        backgroundColor: randomColor(0.2)
      };
    }
  },
  activated() {
    // 1.请求action的数据
    action
      .requestItem(this.id, this)
      .then((res) => {
        let ttls = ['name', 'controllerTtl', 'actionTtl', 'httpMethod', 'description', 'ord'];
        //为组件data填充数据
        fillProps(res.data, this, ttls);

        // 2.加载权限对应的角色
        roleActions
          .requestDataByActionId(this.id, this)
          .then((res) => {
            this.actionRolesArray = res.data;
          })
          .catch((error) => {
            if (error.response.status == 404) {
              this.$toast.show({ type: 'warning', text: '并无任何角色有该权限' });
            } else {
              this.$toast.show({ type: 'danger', text: '请求权限对应角色失败' });
            }
          });
      })
      .catch(() => {});
  },
  beforeRouteLeave(to, from, next) {
    this.actionRolesArray = [];
    next();
  }
};
</script>

<style>
div.actionDetail {
  height: calc(100% - 40px);
}

div.actionDetail div.grid {
  padding: 10px;
  font-size: 14px;
}

/* #region table圆角 */
div.actionDetail table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

div.actionDetail table td {
  border: 1px solid rgb(226, 226, 226);
  border-left: none;
  border-bottom: none;
  padding: 5px 10px;
}

div.actionDetail table tr:first-child td:first-child {
  border-top-left-radius: 5px; /* 设置table左下圆角 */
}

div.actionDetail table tr:first-child td:last-child {
  border-top-right-radius: 5px; /* 设置table右下圆角 */
}

div.actionDetail table tr:last-child td:first-child {
  border-bottom-left-radius: 5px; /* 设置table左下圆角 */
}

div.actionDetail table tr:last-child td:last-child {
  border-bottom-right-radius: 5px; /* 设置table右下圆角 */
}

div.actionDetail table tr td:first-child {
  border-left: 1px solid rgb(226, 226, 226);
}

div.actionDetail table tr:last-child td {
  border-bottom: 1px solid rgb(226, 226, 226);
}
/* #endregion */

div.actionDetail table tr td:first-child {
  width: 150px;
}

div.actionDetail table label.role {
  display: inline-block;
  line-height: 25px;
  height: 25px;
  text-align: center;
  padding: 0px 10px;
  margin: 3px;
  border-radius: 3px;
}
</style>
