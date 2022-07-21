<template>
  <div class="editUser">
    <div class="workbench">
      <div class="grid">
        <row>
          <column :span="20" class="form">
            <div class="ttl">账号:</div>
            <div>{{ account }}</div>

            <div class="ttl">状态:</div>
            <div>
              <switch-btn tipOfCheck="启用" tipOfUncheck="禁用" :width="70" v-model="isEnable" />
            </div>

            <div class="ttl">姓名:</div>
            <text-box ref="name" v-model="name" :maxlength="16" title="姓名" pattern="/^[0-9a-zA-Z\u4e00-\u9fa5]{1,16}$/g">
              <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
            </text-box>

            <div class="ttl">性别:</div>
            <div>
              <label class="sex"> <input type="radio" name="sex" :value="true" v-model="gender" />男 </label>
              <label class="sex"> <input type="radio" name="sex" :value="false" v-model="gender" />女 </label>
            </div>

            <div class="ttl">电话:</div>
            <text-box ref="phone" :value="phone" :maxlength="11" title="Tel" pattern="/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/" @blur="setPhone($event.target.value)">
              <div class="tip" slot="tips" slot-scope="textbox">
                <p class="fl" :style="isExistPhone ? {} : { color: 'var(--color-success)' }">{{ textbox.tips }}</p>
              </div>
            </text-box>

            <div class="ttl">密码:</div>
            <div class="editPwd">
              <btn type="normal" v-show="!isActiveEditPwd" @click="switchEditPwd">修改密码</btn>
              <text-box ref="password" v-show="isActiveEditPwd" v-model="password" type="password" :maxlength="16" title="密码" :required="false" pattern="/^((?!<|>|[\s\u4e00-\u9fa5]).){1,16}$/" @input="checkPwd()">
                <div class="tip" slot="tips" slot-scope="textbox">
                  <btn type="warning" @click="submitPwd">保存</btn>
                  <btn type="normal" @click="switchEditPwd">取消</btn>
                  <p>{{ textbox.tips }}</p>
                  <p v-show="isShowPwdLevel">
                    <meter max="4" min="0" high="3" low="2" optimum="4" :value="pwdLevel"></meter>
                    <span :style="pwdLevelColor">强度{{ pwdLevelTips }}</span>
                  </p>
                </div>
              </text-box>
            </div>

            <div class="ttl">邮箱:</div>
            <text-box ref="email" :value="email" :maxlength="64" title="邮箱" pattern="/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/" @blur="setEmail($event.target.value)">
              <div class="tip" slot="tips" slot-scope="textbox">
                <p class="fl" :style="isExistEmail ? {} : { color: '#00dc04' }">{{ textbox.tips }}</p>
              </div>
            </text-box>

            <div class="ttl">生日:</div>
            <calender ref="birthday" v-model="userInfoExt.birthday"></calender>

            <div class="ttl">QQ:</div>
            <text-box ref="qq" v-model="userInfoExt.qq" :maxlength="32" title="QQ" :required="false" pattern="/^[0-9]{1,32}$/">
              <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
            </text-box>
          </column>
          <column :span="4" class="side">
            <avatar :key="phone" :url="dataUrl" @click="showUploader"></avatar>
          </column>
        </row>
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
    <div class="assistance">
      <assistance-tool-bar :items="assistanceBarItems" @click="toolItemsClick"></assistance-tool-bar>
    </div>
    <!-- popup -->
    <img-uploader :message="uploadMsg" v-model="isShowUpload" @submit="submitImg"></img-uploader>
  </div>
</template>

<script>
import store from 'store/index.js'; // import the store
import { computedAssistanceBarItems } from 'common/mixins/computedAssistanceBarItems';

import Column from 'components/layout/column.vue';
import Row from 'components/layout/row.vue';
import Avatar from 'components/avatar/index.vue';
import ImgUploader from 'components/uploader/v2/imgUploader.vue';
import TextBox from 'components/widgets/textbox.vue';
import Btn from 'components/button/btn.vue';
import SwitchBtn from 'components/button/switchBtn.vue';
import Calender from 'components/calendar/v1/calender.vue';
import AssistanceToolBar from 'components/navigation/stl.v1/assistanceToolBar.vue';

import { fillProps, getDifferent, dateFormat, toChainProps } from 'common/helper/convertHelper';
import * as userinfo from 'netWork/userinfo.js';
import * as fileinfo from 'netWork/fileinfo.js';
import appsettings from 'config/appsettings.json';

export default {
  name: 'EditUser',
  mixins: [computedAssistanceBarItems],
  data() {
    return {
      uploadfileTtl: '',
      dataUrl: '',
      account: '',
      name: '',
      gender: true,
      phone: '',
      password: '',
      email: '',
      userInfoExt: {
        birthday: undefined,
        qq: ''
      },
      isEnable: false,

      isShowUpload: false,
      uploadMsg: '', //上传头像提示信息
      isActiveEditPwd: false,
      isExistPhone: true,
      isExistEmail: true,
      isShowPwdLevel: false,
      pwdLevel: 0,
      pwdLevelTips: '低',

      isForbidden: false,
      message: '',
      isAccomplished: false //编辑任务完成
    };
  },
  computed: {
    pageIndex() {
      return this.$store.getters['user/pageIndex'];
    },
    selectedObj() {
      return this.$store.getters['user/selectedObj'];
    },
    pwdLevelColor() {
      let _color = 'red';
      switch (this.pwdLevel) {
        case 2:
          {
            _color = 'var(--color-warning)';
          }
          break;
        case 4:
          {
            _color = 'var(--color-success)';
          }
          break;
        default: {
          _color = 'var(--color-danger)';
        }
      }
      return {
        color: _color
      };
    }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  methods: {
    showUploader() {
      this.isShowUpload = true;
    },
    toolItemsClick(e) {
      switch (e.id) {
        case 51101:
          {
            this.dataUrl = '';
            this.isEnable = false;
            this.$refs.name.clear();
            this.gender = true;
            this.$refs.phone.clear();
            this.phone = '';
            this.$refs.email.clear();
            this.email = '';
            this.$refs.birthday.clear();
            this.$refs.qq.clear();
            this.isForbidden = false;
            this.message = '';
            //编辑pwd对话框
            this.isActiveEditPwd = false;
            this.$refs.password.clear();
            this.isShowPwdLevel = false;
          }
          break;
        default:
          break;
      }
    },
    clear() {
      this.dataUrl = '';
      this.isEnable = false;
      this.$refs.name.clear();
      this.gender = true;
      this.$refs.phone.clear();
      this.phone = '';
      this.$refs.email.clear();
      this.email = '';
      this.$refs.birthday.clear();
      this.$refs.qq.clear();
      this.isForbidden = false;
      this.message = '';
      //编辑pwd对话框
      this.isActiveEditPwd = false;
      this.$refs.password.clear();
      this.isShowPwdLevel = false;

      this.$store.dispatch('user/setSelectedObj', null);
    },
    //切换显示编辑密码
    switchEditPwd() {
      this.isActiveEditPwd = !this.isActiveEditPwd;
      this.$refs.password.clear();
      this.isShowPwdLevel = false;
    },
    //验证密码格式-->密码强度
    checkPwd() {
      if (this.password.trim() != '') {
        if (this.$refs.password.check()) {
          this.isShowPwdLevel = true;
          this.checkPwdLevel();
        } else {
          this.isShowPwdLevel = false;
        }
      }
    },
    //验证密码强度
    checkPwdLevel() {
      var reg_expg = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,20}$/; //高
      var reg_expz = /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,16}$/; //中

      if (reg_expg.test(this.password)) {
        this.pwdLevel = 4;
        this.pwdLevelTips = '高';
        return true;
      } else if (reg_expz.test(this.password)) {
        this.pwdLevel = 2;
        this.pwdLevelTips = '中';
        return true;
      } else {
        this.pwdLevel = 1;
        this.pwdLevelTips = '低';
        return false;
      }
    },
    submitPwd() {
      if (this.$refs.password.check() && this.checkPwdLevel()) {
        let obj = {
          pwd: this.password
        };
        this.isShowPwdLevel = false;
        this.$refs.password.tips = '正在提交数据';
        //提交
        userinfo
          .putPwd(this.id, obj, this)
          .then(() => {
            this.$toast.show({ type: 'success', text: '修改成功' });
            this.switchEditPwd();
          })
          .catch((error) => {
            if (error.response.data) {
              let str = JSON.stringify(error.response.data);
              this.$refs.password.tips = str;
            }
          });
      }
    },
    //验证手机号
    setPhone(val) {
      if (this.phone != val && this.$refs.phone.check()) {
        this.isExistPhone = true;
        this.phone = val;
        userinfo
          .requestData({
            fields: 'phone',
            phone: this.phone
          })
          .then((res) => {
            this.isExistPhone = res.data.length > 0;
            if (this.isExistPhone) {
              this.$refs.phone.tips = '已被注册';
            }
            //
            else {
              this.$refs.phone.tips = '未被注册';
            }
          })
          .catch((error) => {
            this.$refs.phone.tips = JSON.stringify(error.response);
          });
      }
    },
    //验证邮箱
    setEmail(val) {
      if (this.email != val && this.$refs.email.check()) {
        this.isExistEmail = true;
        this.email = val;
        userinfo
          .requestData({
            fields: 'email',
            email: this.email
          })
          .then((res) => {
            this.isExistEmail = res.data.length > 0;
            if (this.isExistEmail) {
              this.$refs.email.tips = '已被注册';
            } else {
              this.$refs.email.tips = '未被注册';
            }
          })
          .catch((error) => {
            this.$refs.email.tips = JSON.stringify(error.response);
          });
      }
    },
    back() {
      this.$router.push({
        name: 'userList'
      });
    },
    submitImg(e) {
      //表单形式传输
      const formData = new URLSearchParams();
      formData.append('portraitTtl', e.fileArray[0].name);
      formData.append('portrait', e.dataURLArray[0]);
      userinfo
        .putPortrait(this.id, formData, this)
        .then(() => {
          this.$toast.show({ type: 'success', text: '修改成功' });
          this.isShowUpload = false;
          this.dataUrl = e.dataURLArray[0];
        })
        .catch((error) => {
          if (error.response.data) {
            this.uploadMsg = JSON.stringify(error.response.data);
          }
        });
    },
    validate() {
      this.message = '';
      //非必填项，但不能填错
      if (this.userInfoExt.birthday) {
        if (!this.$refs.birthday.check()) {
          this.message = '请选择正确的日期';
          return false;
        }
      }
      if (this.userInfoExt.qq) {
        if (!this.$refs.qq.check()) {
          return false;
        }
      }

      if (this.phone != this.selectedObj.phone && this.isExistPhone) {
        return false;
      }

      if (this.email != this.selectedObj.email && this.isExistEmail) {
        return false;
      }

      return this.$refs.name.check();
    },
    submit() {
      if (this.validate()) {
        const info = {
          name: this.name,
          gender: this.gender,
          phone: this.phone,
          email: this.email
        };
        const infoExt = {
          birthday: this.userInfoExt.birthday,
          qq: this.userInfoExt.qq
        };

        this.isForbidden = true; //提交按钮禁用，不能再点击
        this.isAccomplished = true;

        //变化后的成员
        const infoDiff = getDifferent(this.selectedObj, info);
        const infoExtDiff = getDifferent(this.selectedObj.userInfoExt, infoExt);

        // 1.没有改变
        if (Object.keys(infoDiff).length == 0 && Object.keys(infoExtDiff).length == 0) {
          this.isForbidden = false;
          this.back();
          return;
        }
        // 2.有改变
        let changes = [];
        this.message = '正在提交数据';
        if (infoDiff && Object.keys(infoDiff).length > 0) {
          changes.push({ method: 'patchUser', diff: infoDiff });
        }
        if (infoExtDiff && Object.keys(infoExtDiff).length > 0) {
          changes.push({ method: 'patchUserExt', diff: infoExtDiff });
        }
        this.editItem(changes);
      }
    },
    editItem(changes) {
      let queue = changes;
      //队列中有成员
      if (queue.length > 0) {
        const patchUser = userinfo.patchUser;
        const patchUserExt = userinfo.patchUserExt;
        let item = queue.pop();
        //构建patch document
        let diffs = toChainProps('', item.diff);
        for (let diff of diffs) {
          if (diff.value instanceof Date) {
            diff.value = dateFormat(diff.value, 'yyyy-MM-dd');
          }
          diff.op = 'replace';
        }
        //patchUser(this.id,diffs,this)
        eval(`${item.method}(this.id,diffs,this)`)
          .then(() => {
            this.editItem(queue);
          })
          .catch((error) => {
            if (error.response.data) {
              this.message = JSON.stringify(error.response.data.errors);
            }
            this.isForbidden = false;
          });
      }
      //队列为空
      else {
        this.$store.dispatch('user/getDataList', this.pageIndex + 1); //刷新当前页
        this.$toast.show({ type: 'success', text: '修改成功' });
        this.back();
      }
    }
  },
  activated() {
    this.isAccomplished = false;
    // 更新user明细时，selectedObj只是简要信息，需要请求user的详细信息
    if (this.$route.meta.fromList) {
      //请求数据
      userinfo.requestItem(this.id, this).then((res) => {
        // 1.加载头像
        if (res.data.portrait) {
          fileinfo.requestFile(res.data.portrait, this).then((res) => {
            new RegExp(/^(image\/\w+);\s.+$/g).exec(res.headers['content-type']);
            if (appsettings.portraitImgType.indexOf(RegExp.$1) > -1) {
              this.dataUrl = window.URL.createObjectURL(res.data);
            }
          });
        }

        //调整
        if (res.data.userInfoExt && res.data.userInfoExt.birthday) {
          res.data.userInfoExt.birthday = new Date(res.data.userInfoExt.birthday);
        }
        res.data.gender = res.data.gender == 'Male' ? true : false;
        this.$store.dispatch('user/setSelectedObj', res.data);

        // 2.填充数据
        let ttls = ['account', 'name', 'gender', 'phone', 'email', 'userInfoExt/birthday', 'userInfoExt/qq', 'isEnable'];
        fillProps(this.selectedObj, this, ttls, true);
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    //不能直接通过this访问$store
    if (store.getters['user/selectedObj']) {
      let pages = ['userList', 'searchUserResult', 'userDetail'];
      if (pages.indexOf(from.name) > -1) {
        to.meta.fromList = true; //使用meta中变量标识是否从搜索控件跳转过来
      }
      next();
    } else {
      //导航到列表
      let currentNode = store.getters.siteNodes.find((val) => to.name == val.routeName);
      if (currentNode.substitutionTagSiteNodeId) {
        let subNode = store.getters.siteNodes.find((val) => val.id == currentNode.substitutionTagSiteNodeId); //获取当前节点的替代节点
        next({ name: subNode.routeName });
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    from.meta.fromList = false; //重置meta fromSearch设置

    let arr = ['userList', 'createUser'];

    if (this.isAccomplished) {
      this.clear();
      next();
    }
    // 如果离开到sysParameter之下的其他组件时，再访问edit时会重新dispatch对象，所有数据会重置，因此提示
    else if (arr.find((i) => i.toLowerCase() == to.name.toLowerCase())) {
      this.$confirm({
        type: 'warning',
        content: '是否退出编辑模式?',
        confirmTxt: '确认',
        cancelTxt: '取消'
      })
        .then(() => {
          this.clear();
          next();
        })
        .catch(() => {});
    }
    //
    else {
      next();
    }
  },
  components: {
    Column,
    Row,
    Avatar,
    ImgUploader,
    TextBox,
    Btn,
    SwitchBtn,
    Calender,
    AssistanceToolBar
  }
};
</script>

<style>
div.editUser {
  height: calc(100% - 40px);
}

div.editUser div.workbench {
  height: calc(100% - 25px);
  overflow: auto;
}

div.editUser div.grid {
  padding: 10px;
  font-size: 14px;
}

div.editUser div.grid > div {
  border: 1px solid rgb(226, 226, 226);
  border-radius: 5px;
}

/* content */
div.editUser div.form {
  display: grid;
  grid-template-columns: 15% 85%;
  grid-template-rows: repeat(8, 40px);
  justify-items: start;
  align-items: center;
  padding: 10px;
}

div.editUser div.form > div.ttl {
  padding: 0px 20px;
}

div.editUser div.side {
  padding: 10px;
}

div.editUser div.grid .avatar {
  width: 120px;
  height: 120px;
  border: 1px dashed var(--color-text);
  border-radius: 3px;
}

div.editUser div.grid .avatar:hover {
  cursor: pointer;
  border: 1px dashed var(--color-brand);
}

div.editUser div.grid label.sex {
  display: inline-block;
  width: 100px;
  text-align: center;
}

div.editUser div.grid label input[type='radio'] {
  margin: 0px 5px;
}

div.editUser div.grid input[type='text'] {
  width: 60%;
  min-width: 400px;
}

div.editUser div.grid div.tip {
  display: inline-block;
  color: var(--color-danger);
}

div.editUser div.grid div.editPwd > button {
  width: 200px;
  height: 25px;
  line-height: 25px;
}

div.editUser div.grid div.editPwd .tip {
  display: inline-flex;
  height: 25px;
  line-height: 25px;
}

div.editUser div.grid div.editPwd .tip > button {
  width: 60px;
  height: 25px;
  line-height: 25px;
  margin: 0px 3px;
}

div.editUser div.grid div.editPwd input[type='password'] {
  width: 180px;
}

/* ctrl */
div.editUser > div.workbench > div.ctrl {
  display: flex;
}

div.editUser > div.workbench > div.ctrl > div {
  width: 50%;
}

div.editUser > div.workbench > div.ctrl > div:first-child {
  display: flex;
  justify-content: flex-end;
}

div.editUser > div.workbench > div.ctrl button {
  margin: 0px 5px;
}

div.editUser > div.workbench > div.ctrl button.isForbidden {
  cursor: not-allowed;
}

div.editUser div.message {
  height: 30px;
  line-height: 30px;
  color: var(--color-danger);
}

div.editUser div.assistance {
  display: flex;
  background: #ebebeb;
  width: 100%;
  min-width: 600px;
  height: 25px;
}
</style>
