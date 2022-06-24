<template>
  <div class="roleDetail">
    <div class="grid">
      <table>
        <tr>
          <td class="ttl">名称:</td>
          <td>
            {{ name }}
            <span v-if="isEnable" class="enable">启用中</span>
            <span v-if="!isEnable" class="disable">禁用中</span>
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
        <tr>
          <td class="ttl">具有权限（{{ actionRolesArray.length }}项）:</td>
          <td>
            <template v-if="actionRolesArray.length > 0">
              <label v-for="item of actionRolesArray" class="action" :key="item.action.id" :title="item.action.description" :style="labelStyle()"> {{ item.action.name }} </label>
            </template>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { dateFormat, fillProps } from 'common/helper/convertHelper';
import { randomColor } from 'common/helper/randomHelper';
import * as role from 'netWork/role.js';
import * as roleActions from 'netWork/roleAction.js';

export default {
  name: 'RoleDetail',
  data() {
    return {
      name: '',
      ord: 0,
      establish: '',
      description: '',
      isEnable: false,
      actionRolesArray: []
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
  methods: {
    labelStyle() {
      return {
        backgroundColor: randomColor(0.2)
      };
    }
  },
  activated() {
    //请求数据
    role
      .requestItem(this.id, this)
      .then((res) => {
        let ttls = ['name', 'description', 'ord', 'establish', 'isEnable'];
        //为组件data填充数据
        fillProps(res.data, this, ttls);

        // 2.加载权限对应的角色
        roleActions
          .requestDataByRoleId(this.id, this)
          .then((res) => {
            this.actionRolesArray = res.data;
          })
          .catch((error) => {
            if (error.response.status == 404) {
              this.$toast.show({ type: 'warning', text: '该角色并无任何的权限' });
            } else {
              this.$toast.show({ type: 'danger', text: '请求角色对应的权限失败' });
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
div.roleDetail {
  width: 100%;
  height: calc(100% - 40px);
}

div.roleDetail div.grid {
  padding: 10px;
  font-size: 14px;
}

/* #region table圆角 */
div.roleDetail table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

div.roleDetail table td {
  border: 1px solid rgb(226, 226, 226);
  border-left: none;
  border-bottom: none;
  padding: 5px 10px;
}

div.roleDetail table tr:first-child td:first-child {
  border-top-left-radius: 5px; /* 设置table左下圆角 */
}

div.roleDetail table tr:first-child td:last-child {
  border-top-right-radius: 5px; /* 设置table右下圆角 */
}

div.roleDetail table tr:last-child td:first-child {
  border-bottom-left-radius: 5px; /* 设置table左下圆角 */
}

div.roleDetail table tr:last-child td:last-child {
  border-bottom-right-radius: 5px; /* 设置table右下圆角 */
}

div.roleDetail table tr td:first-child {
  border-left: 1px solid rgb(226, 226, 226);
}

div.roleDetail table tr:last-child td {
  border-bottom: 1px solid rgb(226, 226, 226);
}
/* #endregion */

div.roleDetail table tr td:first-child {
  width: 150px;
}

div.roleDetail table tr td span.enable {
  display: inline-block;
  color: white;
  font-size: 12px;
  width: 60px;
  height: 18px;
  line-height: 18px;
  border-radius: 9px;
  background-color: var(--color-success);
  text-align: center;
  margin: 0px 5px;
}

div.roleDetail table tr td span.disable {
  display: inline-block;
  color: white;
  font-size: 12px;
  width: 60px;
  height: 18px;
  line-height: 18px;
  border-radius: 9px;
  background-color: var(--color-danger);
  text-align: center;
  margin: 0px 5px;
}

div.roleDetail table label.action {
  display: inline-block;
  line-height: 25px;
  height: 25px;
  text-align: center;
  padding: 0px 10px;
  margin: 3px;
  border-radius: 3px;
}
</style>
