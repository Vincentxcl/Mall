<template>
  <dialog-window v-show="isShowField" class="createActionItem" @iconClick="close">
    <template slot="title"> 添加权限 </template>
    <div class="grid" slot="content">
      <div class="ttl">名称</div>
      <textbox ref="name" v-model="name" :maxlength="20" pattern="/^[\u4e00-\u9fa5A-Za-z0-9_]{1,20}$/">
        <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
      </textbox>
      <div class="ttl">Controller</div>
      <textbox ref="controllerTtl" v-model="controllerTtl" :maxlength="30" pattern="/^.{1,30}$/">
        <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
      </textbox>
      <div class="ttl">Action</div>
      <textbox ref="actionTtl" v-model="actionTtl" :maxlength="30" pattern="/^.{1,30}$/">
        <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
      </textbox>
      <div class="ttl">请求方式</div>
      <select v-model="httpMethod">
        <option value="0">HttpGet</option>
        <option value="1">HttpPost</option>
        <option value="2">HttpPut</option>
        <option value="3">HttpPatch</option>
        <option value="4">HttpDelete</option>
      </select>
      <div class="ttl">排序</div>
      <textbox ref="ord" v-model="ord" :required="false" pattern="/^\d{1,3}$/">
        <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
      </textbox>
      <div class="ttl">说明</div>
      <textbox ref="description" type="textarea" v-model="description" :required="false" :maxlength="50" pattern="/^.{0,50}$/">
        <div class="tip" slot="tips" slot-scope="slot">{{ slot.tips }}</div>
      </textbox>
    </div>
    <template slot="ctrl">
      <div>{{ message }}</div>
      <btn type="brand" @click.native="submit">添加</btn>
      <btn type="normal" @click.native="close">取消</btn>
    </template>
  </dialog-window>
</template>

<script>
import DialogWindow from 'components/dialog/v2/dialogWindow.vue';
import Textbox from 'components/widgets/textbox.vue';
import Btn from 'components/button/btn.vue';

export default {
  name: 'CreateActionItem',
  data() {
    return {
      message: '',
      isShowField: false,
      name: '',
      controllerTtl: '',
      actionTtl: '',
      httpMethod: 0,
      description: null,
      ord: null
    };
  },
  props: {
    isShow: {
      type: Boolean
    }
  },
  methods: {
    clear() {
      this.$refs.name.clear();
      this.$refs.controllerTtl.clear();
      this.$refs.actionTtl.clear();
      this.httpMethod = 0;
      this.$refs.ord.clear();
      this.$refs.description.clear();
      this.message = '';
    },
    close() {
      this.clear();
      this.isShowField = false;
    },
    submit() {
      if (this.$refs.name.check() && this.$refs.controllerTtl.check() && this.$refs.actionTtl.check() && this.$refs.description.check() && this.$refs.ord.check()) {
        let obj = {
          name: this.name,
          controllerTtl: this.controllerTtl,
          actionTtl: this.actionTtl,
          httpMethod: this.httpMethod
        };
        if (this.description) {
          obj.description = this.description;
        }
        if (this.ord) {
          obj.ord = this.ord;
        }

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
div.createActionItem {
  width: 50%;
  min-width: 500px;
  height: 600px;
  margin: 100px auto;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}

div.createActionItem div.content {
  padding: 10px 30px;
}

div.createActionItem div.grid {
  display: grid;
  grid-template-columns: 20% 80%;
  grid-template-rows: repeat(5, 60px) 100px;
  justify-items: flex-start;
  align-items: flex-start;
  margin: auto;
  font-size: 14px;
}

div.createActionItem div.grid .textBox {
  width: 100%;
}

div.createActionItem div.grid input[type='text'] {
  width: calc(100% - 20px);
}

div.createActionItem div.grid select {
  height: 30px;
  outline: none;
}

div.createActionItem div.grid textarea {
  width: calc(100% - 20px);
  height: 120px;
}

div.createActionItem div.ttl {
  height: 30px;
  line-height: 30px;
}

div.createActionItem div.tip {
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: var(--color-danger);
}

div.createActionItem div.ctrl {
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  align-items: center;
}

div.createActionItem div.ctrl div {
  flex: 1;
  height: 100%;
  line-height: 60px;
  padding-left: 20px;
  font-size: 14px;
  color: var(--color-danger);
}

div.createActionItem div.ctrl button {
  margin-right: 20px;
}
</style>
