<template>
  <dialog-window v-show="isShowField" class="createUserInfoItem" @iconClick="close">
    <template slot="title"> 添加用户 </template>
    <div class="grid" slot="content">
      <div class="ttl">电话</div>
      <textbox ref="phone" v-model="phone" :maxlength="11" pattern="/^[0-9]{0,11}$/">
        <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
      </textbox>
      <div class="ttl">密码</div>
      <textbox ref="pwd" v-model="pwd" type="password" :maxlength="20" pattern="/^.{0,20}$/">
        <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
      </textbox>
      <div class="ttl">邮箱</div>
      <textbox ref="email" v-model="email" :maxlength="30" pattern="/^.{0,30}$/">
        <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
      </textbox>
    </div>
    <div class="ctrl" slot="ctrl">
      <div>{{ message }}</div>
      <btn type="text" @click.native="submit">添加</btn>
      <btn type="normal" @click.native="close">取消</btn>
    </div>
  </dialog-window>
</template>

<script>
import DialogWindow from 'components/dialog/v2/dialogWindow.vue';
import Textbox from 'components/widgets/textbox.vue';
import Btn from 'components/button/btn.vue';

export default {
  name: 'CreateUserInfoItem',
  data() {
    return {
      message: '',
      isShowField: false,
      phone: '',
      pwd: '',
      email: ''
    };
  },
  props: {
    isShow: {
      type: Boolean
    }
  },
  methods: {
    clear() {
      this.$refs.phone.clear();
      this.$refs.pwd.clear();
      this.$refs.email.clear();
      this.message = '';
    },
    close() {
      this.clear();
      this.isShowField = false;
    },
    submit() {
      if (this.$refs.phone.check() && this.$refs.pwd.check() && this.$refs.email.check()) {
        let obj = {
          randomWords: 'string', //TODO1111111111111111111111111
          phone: this.phone,
          pwd: this.pwd,
          email: this.email
        };
        this.message = '正在提交数据';
        this.$emit('create', obj);
      }
    }
  },
  watch: {
    isShow: {
      handler(current) {
        this.isShowField = current;
      }
    },
    isShowField: {
      handler(current) {
        if (this.$mask) {
          current ? this.$mask.show() : this.$mask.hide();
        }
        this.$emit('show', current);
      }
    }
  },
  components: {
    Textbox,
    Btn,
    DialogWindow
  },
  model: {
    prop: 'isShow',
    event: 'show'
  }
};
</script>

<style>
div.createUserInfoItem {
  width: 500px !important;
  height: 400px !important;
  margin: 100px auto;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}

div.createUserInfoItem div.grid {
  display: grid;
  width: 300px;
  grid-template-columns: 20% 80%;
  grid-template-rows: repeat(3, 60px) 100px;
  justify-items: flex-start;
  align-items: flex-start;
  margin: auto;
  font-size: 14px;
}

div.createUserInfoItem div.ttl {
  height: 30px;
  line-height: 30px;
}

div.createUserInfoItem textarea {
  width: 194px;
  height: 100px;
}

div.createUserInfoItem div.tip {
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: var(--color-danger);
}

div.createUserInfoItem div.ctrl > div.ctrl {
  height: 100%;
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  align-items: center;
}

div.createUserInfoItem div.ctrl > div.ctrl > div {
  flex: 1;
  height: 100%;
  line-height: 60px;
  padding-left: 20px;
  font-size: 14px;
  color: var(--color-danger);
}

div.createUserInfoItem button.text,
div.createUserInfoItem button.normal {
  margin-right: 20px;
}
</style>
