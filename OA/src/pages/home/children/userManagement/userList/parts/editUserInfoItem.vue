<template>
  <dialog-window v-show="isShowField" class="editUserInfoItem" @iconClick="close">
    <template slot="title">编辑用户信息</template>
    <div class="grid" slot="content">
      <div class="ttl">电话</div>
      <textbox ref="phone" v-model="phone" :maxlength="11" pattern="/^[0-9]{0,11}$/">
        <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
      </textbox>
      <div class="ttl">邮箱</div>
      <textbox ref="email" v-model="email" :maxlength="30" :required="false" pattern="/^.{0,30}$/">
        <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
      </textbox>
    </div>
    <template slot="ctrl">
      <div>{{ message }}</div>
      <btn type="brand" @click.native="submit">保存</btn>
      <btn type="normal" @click.native="close">取消</btn>
    </template>
  </dialog-window>
</template>

<script>
import DialogWindow from 'components/dialog/v2/dialogWindow.vue';
import Textbox from 'components/widgets/textbox.vue';
import Btn from 'components/button/btn.vue';

export default {
  name: 'EditUserInfoItem',
  data() {
    return {
      message: '',
      isShowField: false,
      phone: '',
      email: ''
    };
  },
  props: {
    isShow: {
      type: Boolean
    },
    obj: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    fill(obj) {
      if (typeof obj == 'object') {
        let ttls = ['phone', 'email'];
        for (let item of ttls) {
          if (obj[item] != undefined) {
            this[item] = obj[item];
          }
        }
      }
    },
    clear() {
      this.$refs.phone.clear();
      this.$refs.email.clear();
      this.message = '';
    },
    close() {
      this.clear();
      this.isShowField = false;
    },
    submit() {
      if (this.$refs.phone.check() && this.$refs.email.check()) {
        let obj = {
          phone: this.phone,
          email: this.email
        };
        this.message = '正在提交数据';
        this.$emit('edit', obj);
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
    },
    obj: {
      handler(current) {
        this.fill(current);
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
div.editUserInfoItem {
  width: 50%;
  min-width: 400px;
  height: 400px;
  margin: 100px auto;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}

div.editUserInfoItem div.content {
  padding: 10px 30px;
}

div.editUserInfoItem div.grid {
  display: grid;
  grid-template-columns: 10% 90%;
  grid-template-rows: repeat(3, 60px) 100px;
  justify-items: flex-start;
  align-items: flex-start;
  margin: auto;
  font-size: 14px;
}

div.editUserInfoItem div.grid .textBox {
  width: 100%;
}

div.editUserInfoItem div.grid input {
  width: calc(100% - 20px);
}

div.editUserInfoItem div.grid textarea {
  width: calc(100% - 20px);
  height: 120px;
}

div.editUserInfoItem div.ttl {
  height: 30px;
  line-height: 30px;
}

div.editUserInfoItem div.tip {
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: var(--color-danger);
}

div.editUserInfoItem div.ctrl {
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  align-items: center;
}

div.editUserInfoItem div.ctrl div {
  flex: 1;
  height: 100%;
  line-height: 60px;
  padding-left: 20px;
  font-size: 14px;
  color: var(--color-danger);
}

div.editUserInfoItem button {
  margin-right: 20px;
}
</style>
