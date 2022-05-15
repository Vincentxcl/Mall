<template>
  <dialog-window v-show="isShowField" class="editRoleItem" @iconClick="close">
    <template slot="title">编辑配置项 </template>
    <div class="grid" slot="content">
      <div class="ttl">名称</div>
      <textbox ref="name" v-model="name" :maxlength="20" pattern="/^[\u4e00-\u9fa5A-Za-z0-9_]{1,20}$/">
        <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
      </textbox>
      <div class="ttl">排序</div>
      <textbox ref="ord" v-model="ord" :required="false" pattern="/^\d{1,3}$/">
        <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
      </textbox>
      <div class="ttl">说明</div>
      <textbox ref="description" type="textarea" v-model="description" :maxlength="50" pattern="/^.{0,50}$/">
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
  name: 'EditRoleItem',
  data() {
    return {
      message: '',
      isShowField: false,
      name: '',
      description: '',
      ord: 0
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
        let ttls = ['name', 'description', 'ord'];
        for (let item of ttls) {
          if (obj[item] != undefined) {
            this[item] = obj[item];
          }
        }
      }
    },
    clear() {
      this.$refs.name.clear();
      this.$refs.ord.clear();
      this.$refs.description.clear();
      this.message = '';
    },
    close() {
      this.clear();
      this.isShowField = false;
    },
    submit() {
      if (this.$refs.name.check() && this.$refs.description.check() && this.$refs.ord.check()) {
        let obj = {
          name: this.name,
          description: this.description
        };
        if (this.ord.toString().trim() != '') {
          obj.ord = this.ord;
        }
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
div.editRoleItem {
  width: 50%;
  min-width: 400px;
  height: 400px;
  margin: 100px auto;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}

div.editRoleItem div.content {
  padding: 10px 30px;
}

div.editRoleItem div.grid {
  display: grid;
  grid-template-columns: 10% 90%;
  grid-template-rows: repeat(3, 60px) 100px;
  justify-items: flex-start;
  align-items: flex-start;
  margin: auto;
  font-size: 14px;
}

div.editRoleItem div.grid .textBox {
  width: 100%;
}

div.editRoleItem div.grid input {
  width: calc(100% - 20px);
}

div.editRoleItem div.grid textarea {
  width: calc(100% - 20px);
  height: 120px;
}

div.editRoleItem div.ttl {
  height: 30px;
  line-height: 30px;
}

div.editRoleItem div.tip {
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: var(--color-danger);
}

div.editRoleItem div.ctrl {
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  align-items: center;
}

div.editRoleItem div.ctrl div {
  flex: 1;
  height: 100%;
  line-height: 60px;
  padding-left: 20px;
  font-size: 14px;
  color: var(--color-danger);
}

div.editRoleItem button {
  margin-right: 20px;
}
</style>
