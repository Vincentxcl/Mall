<template>
  <div class="userDetail">
    <div class="grid">
      <div>
        <div class="info">
          <div>
            <div class="ttl">账号:</div>
            <div>
              {{ account }}
              <span v-if="isEnable" class="enable">正常</span>
              <span v-if="!isEnable" class="disable">锁定</span>
            </div>
            <div class="ttl">姓名:</div>
            <div>
              {{ adjustedName }}
              <icon v-if="gender == 'Female'" icon="icon-nv" title="女"></icon>
              <icon v-else icon="icon-nan" title="男"></icon>
            </div>
            <div class="ttl">电话:</div>
            <div>
              {{ phone }}
            </div>
            <div class="ttl">邮箱:</div>
            <div>
              {{ email }}
            </div>
            <div class="ttl">生日:</div>
            <div>
              {{ adjustedBirthday }}
            </div>
            <div class="ttl">QQ号:</div>
            <div>
              {{ userInfoExt.qq }}
            </div>
            <div class="ttl">注册时间:</div>
            <div>
              {{ adjustedEstablish }}
            </div>
            <div class="ttl">近期登陆:</div>
            <div colspan="2">{{ recentLyLogin }}</div>
          </div>
          <div>
            <div class="avatar">
              <img :key="account" :src="defaultImgSrc" v-realSrc="url" alt="avatar" @load="load" />
            </div>
          </div>
        </div>
        <div class="ext">
          <div class="ttl">角色（{{ adjustedUserRoles.length }}个）:</div>
          <div>
            <template v-if="adjustedUserRoles.length > 0">
              <label v-for="item of adjustedUserRoles" class="tag" :key="item.role.id" :title="item.role.description" :style="labelStyle()"> {{ item.role.name }} </label>
            </template>
          </div>
          <div class="ttl">允许的特限（{{ userActionsAllow.length }}个）:</div>
          <div>
            <template v-if="userActionsAllow.length > 0">
              <label v-for="item of userActionsAllow" class="tag" :key="item.action.id" :title="item.action.description" :style="labelStyle()"> {{ buildActionTtl(item) }} </label>
            </template>
          </div>
          <div class="ttl">禁止的权限（{{ userActionsForbid.length }}个）:</div>
          <div>
            <template v-if="userActionsForbid.length > 0">
              <label v-for="item of userActionsForbid" class="tag" :key="item.action.id" :title="item.action.description" :style="labelStyle()"> {{ item.action.name }} </label>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { buildActionTtl } from 'common/mixins/buildActionTtl';
import { dateFormat, fillProps } from 'common/helper/convertHelper.js';
import { randomColor } from 'common/helper/randomHelper.js';
import { requestItem } from 'netWork/userinfo.js';
import * as fileinfo from 'netWork/fileinfo.js';
import appsettings from 'config/appsettings.json';

import Icon from 'components/widgets/icon.vue';

export default {
  name: 'UserDetail',
  mixins: [buildActionTtl],
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
    let pages = ['userList', 'searchUserResult', 'editUserRoles', 'editUserActions'];
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

div.userDetail div.grid > div {
  padding: 10px;
  border: 1px solid rgb(226, 226, 226);
  border-radius: 5px;
  min-width: 1075px;
}

div.userDetail div.grid div.info {
  display: grid;
  grid-template-columns: minmax(900px, 86%) minmax(145px, 14%);
  padding: 5px 0px;
  border-bottom: 1px solid rgb(226, 226, 226);
}

div.userDetail div.grid div.info > div:nth-child(1) {
  display: grid;
  grid-template-columns: repeat(2, minmax(90px, 10%) minmax(350px, 40%));
  row-gap: 5px;
  justify-items: start;
  align-items: center;
}

div.userDetail div.grid div.info > div:nth-child(2) {
  display: flex;
  justify-content: center;
  align-items: center;
}

div.userDetail div.grid div.info .avatar {
  width: 110px;
  height: 110px;
  border: 1px solid rgb(202, 202, 202);
}

div.userDetail div.grid div.info .avatar img {
  width: 106px;
  height: 106px;
  margin: 1px auto;
}

div.userDetail div.grid div.info > div span.enable {
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

div.userDetail div.grid div.info > div span.disable {
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

div.userDetail div.grid div.info > div i.icon-nv {
  color: red;
}

div.userDetail div.grid div.info > div i.icon-nan {
  color: blue;
}

div.userDetail div.grid div.ext {
  display: grid;
  grid-template-columns: minmax(140px, 15%) 85%;
  justify-items: start;
  align-items: center;
  padding: 5px 0px;
  row-gap: 5px;
}

div.userDetail div.grid div.ext label.tag {
  display: inline-block;
  line-height: 25px;
  height: 25px;
  text-align: center;
  padding: 0px 10px;
  margin: 3px;
  border-radius: 3px;
}
</style>
