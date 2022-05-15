<template>
  <dialog-window v-show="isShowField" class="editRoleActions" @iconClick="close">
    <template slot="title">配置权限"{{selectedAction.name}}"对应的角色</template>
    <div class="grid" slot="content">
      <template v-if="roleList.length > 0">
        <div v-for="item in roleList" :key="item.id">
          <label> <input type="checkbox" :value="item.id" v-model="roleIds" /> {{ item.name }} </label>
        </div>
      </template>
      <template v-else>
        <div>正在加载角色列表</div>
      </template>
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
import Btn from 'components/button/btn.vue';

export default {
  name: 'EditRoleActions',
  data() {
    return {
      message: '',
      isShowField: false,
      roleIds: []
    };
  },
  props: {
    isShow: {
      type: Boolean
    },
    selectedAction: {
      type: Object,
      required: true
    },
    roleList: {
      type: Array,
      default() {
        return [];
      }
    },
    roleActions: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    clear() {
      this.message = '';
      this.roleIds = [];
    },
    close() {
      this.clear();
      this.isShowField = false;
    },
    submit() {
      this.message = '正在提交数据';
      let arr = this.roleIds.map((i) => {
        return { roleId: i };
      });
      this.$emit('edit', arr);
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
    roleActions: {
      handler(current) {
        if (current && current.length > 0) {
          this.roleIds = current;
        }
      }
    }
  },
  components: {
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
div.editRoleActions {
  width: 60%;
  min-width: 600px;
  height: 500px;
  margin: 100px auto;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}

div.editRoleActions div.content {
  padding: 10px 30px;
}

div.editRoleActions div.grid {
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
  grid-template-rows: repeat(3, 60px);
  justify-items: flex-start;
  align-items: center;
  margin: auto;
  font-size: 14px;
}

div.editRoleActions div.grid input {
  margin-right: 5px;
}

div.editRoleActions div.ctrl {
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  align-items: center;
}

div.editRoleActions div.ctrl div {
  flex: 1;
  height: 100%;
  line-height: 60px;
  padding-left: 20px;
  font-size: 14px;
  color: var(--color-danger);
}

div.editRoleActions button {
  margin-right: 20px;
}
</style>
