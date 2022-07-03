<template>
  <div class="userDetail">
    <div class="grid">
      <table>
        <tr>
          <td class="ttl">账号:</td>
          <td>
            {{ account }}
            <span v-if="isEnable" class="enable">正常</span>
            <span v-if="!isEnable" class="disable">锁定</span>
          </td>
          <td class="avatar" rowspan="4">
            <div class="avatar">
              <img :key="account" :src="defaultImgSrc" v-realSrc="url" alt="avatar" @load="load" />
            </div>
          </td>
        </tr>
        <tr>
          <td class="ttl">姓名:</td>
          <td>
            {{ adjustedName }}
            <icon v-if="gender == 'Female'" icon="icon-nv" title="女"></icon>
            <icon v-else icon="icon-nan" title="男"></icon>
          </td>
        </tr>
        <tr>
          <td class="ttl">电话:</td>
          <td>
            {{ phone }}
          </td>
        </tr>
        <tr>
          <td class="ttl">邮箱:</td>
          <td>
            {{ email }}
          </td>
        </tr>
        <tr>
          <td class="ttl">生日:</td>
          <td colspan="2">
            {{ adjustedBirthday }}
          </td>
        </tr>
        <tr>
          <td class="ttl">QQ号:</td>
          <td colspan="2">
            {{ userInfoExt.qq }}
          </td>
        </tr>
        <tr>
          <td class="ttl">注册时间:</td>
          <td colspan="2">
            {{ adjustedEstablish }}
          </td>
        </tr>
        <tr>
          <td class="ttl">近期登陆:</td>
          <td colspan="2">{{ recentLyLogin }}</td>
        </tr>
        <tr>
          <td class="ttl">角色（{{ adjustedUserRoles.length }}个）:</td>
          <td colspan="2">
            <template v-if="adjustedUserRoles.length > 0">
              <label v-for="item of adjustedUserRoles" class="tag" :key="item.role.id" :title="item.role.description" :style="labelStyle()"> {{ item.role.name }} </label>
            </template>
          </td>
        </tr>
        <tr>
          <td class="ttl">允许的特限（{{ userActionsAllow.length }}个）:</td>
          <td colspan="2">
            <template v-if="userActionsAllow.length > 0">
              <label v-for="item of userActionsAllow" class="tag" :key="item.action.id" :title="item.action.description" :style="labelStyle()"> {{ item.action.name }} </label>
            </template>
          </td>
        </tr>
        <tr>
          <td class="ttl">禁止的权限（{{ userActionsForbid.length }}个）:</td>
          <td colspan="2">
            <template v-if="userActionsForbid.length > 0">
              <label v-for="item of userActionsForbid" class="tag" :key="item.action.id" :title="item.action.description" :style="labelStyle()"> {{ item.action.name }} </label>
            </template>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { dateFormat, fillProps } from 'common/helper/convertHelper.js';
import { randomColor } from 'common/helper/randomHelper.js';
import { requestItem } from 'netWork/userinfo.js';
import * as fileinfo from 'netWork/fileinfo.js';
import appsettings from 'config/appsettings.json';

import Icon from 'components/widgets/icon.vue';

export default {
  name: 'UserDetail',
  data() {
    return {
      //#region 表单
      account: '',
      name: '',
      gender: '',
      portrait: '',
      phone: '',
      email: '',
      userInfoExt: {
        birthday: '',
        qq: ''
      },
      userLogin: null, //{ip:'',establish:''}创建时间即为登陆时间
      userRoles: null,
      userActions: null,
      establish: '',
      isEnable: false,
      //#endregion
      url: ''
    };
  },
  computed: {
    defaultImgSrc() {
      return require('assets/imgs/avatar/default.png');
    },
    adjustedName() {
      return this.name != undefined ? this.name : '新用户';
    },
    adjustedBirthday() {
      if (this.userInfoExt && this.userInfoExt.birthday) {
        return dateFormat(this.userInfoExt.birthday, 'yyyy-MM-dddd');
      }
      return '';
    },
    adjustedEstablish() {
      return dateFormat(this.establish);
    },
    recentLyLogin() {
      if (this.userLogin) {
        return `IP地址:${this.userLogin.ip} 时间:${dateFormat(this.userLogin.establish)}`;
      }
      return '暂无记录';
    },
    adjustedUserRoles() {
      if (this.userRoles && this.userRoles.length > 0) {
        return this.userRoles;
      }
      return [];
    },
    userActionsAllow() {
      if (this.userActions && this.userActions.length > 0) {
        return this.userActions.filter((ua) => ua.isEnable == true);
      }
      return [];
    },
    userActionsForbid() {
      if (this.userActions && this.userActions.length > 0) {
        return this.userActions.filter((ua) => ua.isEnable == false);
      }
      return [];
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
    },
    load() {
      window.URL.revokeObjectURL(this.url);
    }
  },
  activated() {
    if (this.$route.meta.fromList) {
      this.url = '';
      //请求数据
      requestItem(this.id, this).then((res) => {
        // 1.加载头像
        if (res.data.portrait) {
          fileinfo.requestFile(res.data.portrait, this).then((res) => {
            new RegExp(/^(image\/\w+);\s.+$/g).exec(res.headers['content-type']);
            if (appsettings.portraitImgType.indexOf(RegExp.$1) > -1) {
              this.url = window.URL.createObjectURL(res.data);
            }
          });
        }

        // 2.填充数据
        let ttls = ['account', 'name', 'gender', 'portrait', 'phone', 'email', 'userLogin', 'userRoles', 'userActions', 'userInfoExt/birthday', 'userInfoExt/qq', 'establish', 'isEnable'];
        //为组件data填充数据
        fillProps(res.data, this, ttls, true);
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    let pages = ['userList', 'searchUserResult'];
    if (pages.indexOf(from.name) > -1) {
      to.meta.fromList = true; //使用meta中变量标识是否从搜索控件跳转过来
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    from.meta.fromList = false; //重置meta fromSearch设置
    next();
  },
  components: {
    Icon
  }
};
</script>

<style>
div.userDetail {
  width: 100%;
  height: calc(100% - 40px);
  overflow: auto;
}

div.userDetail div.grid {
  padding: 10px;
  font-size: 14px;
}

/* #region table圆角 */
div.userDetail table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

div.userDetail table td {
  border: 1px solid rgb(226, 226, 226);
  border-left: none;
  border-bottom: none;
  padding: 5px 10px;
}

div.userDetail table tr:first-child td:first-child {
  border-top-left-radius: 5px; /* 设置table左下圆角 */
}

div.userDetail table tr:first-child td:last-child {
  border-top-right-radius: 5px; /* 设置table右下圆角 */
}

div.userDetail table tr:last-child td:first-child {
  border-bottom-left-radius: 5px; /* 设置table左下圆角 */
}

div.userDetail table tr:last-child td:last-child {
  border-bottom-right-radius: 5px; /* 设置table右下圆角 */
}

div.userDetail table tr td:first-child {
  border-left: 1px solid rgb(226, 226, 226);
}

div.userDetail table tr:last-child td {
  border-bottom: 1px solid rgb(226, 226, 226);
}
/* #endregion */

div.userDetail table tr td:first-child {
  width: 150px;
}

div.userDetail table tr td.avatar {
  text-align: center;
}

div.userDetail table tr td div.avatar {
  display: inline-block;
  width: 110px;
  height: 110px;
  border: 1px solid rgb(202, 202, 202);
}

div.userDetail table tr td .avatar img {
  width: 106px;
  height: 106px;
  margin: 1px auto;
}

div.userDetail table tr td span.enable {
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

div.userDetail table tr td span.disable {
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

div.userDetail table tr td i.icon-nv {
  color: red;
}

div.userDetail table tr td i.icon-nan {
  color: blue;
}

div.userDetail table label.tag {
  display: inline-block;
  line-height: 25px;
  height: 25px;
  text-align: center;
  padding: 0px 10px;
  margin: 3px;
  border-radius: 3px;
}
</style>
