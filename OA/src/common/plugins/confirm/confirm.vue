<template>
  <container id="confirm" v-show="isShow">
    <div class="titleBar">
      <div class="fl">{{ title }}</div>
      <div class="fr" @click="iconClick">
        <icon icon="icon-guanbi" title="关闭"></icon>
      </div>
    </div>
    <div class="content">
      <p>
        <icon :icon="iconType"></icon>
        <span>{{ content }}</span>
      </p>
    </div>
    <div class="ctrl">
      <btn v-if="confirmTxt != ''" :type="type" @click.native="handleAction(true)">{{ confirmTxt }}</btn>
      <btn v-if="cancelTxt != ''" type="normal" @click.native="handleAction(false)">{{ cancelTxt }}</btn>
    </div>
  </container>
</template>

<script>
import Container from 'components/dialog/parts/container.vue';
import Icon from 'components/widgets/icon.vue';
import Btn from 'components/button/btn.vue';

export default {
  name: 'Confirm',
  data() {
    return {
      title: '', //标题
      type: '', // 提示类型 normal brand success warning danger
      content: '', //提示文字
      confirmTxt: '', //确定按钮
      cancelTxt: '', //取消按钮
      isShow: false,
      promise: null
    };
  },
  computed: {
    iconType() {
      switch (this.type) {
        case 'brand': {
          return 'icon-tishi';
        }
        case 'success': {
          return 'icon-chenggong';
        }
        case 'warning': {
          return 'icon-jinggao';
        }
        case 'danger': {
          return 'icon-shibai';
        }
        default: {
          return 'icon-tishi';
        }
      }
    }
  },
  methods: {
    iconClick() {
      this.isShow = false;
    },
    show(options) {
      // 默认配置
      let defaultOptions = {
        title: '提示',
        type: 'normal',
        content: 'Hello World!',
        confirmTxt: '确认',
        cancelTxt: '取消'
      };
      // 导入options
      if (typeof options === 'object') {
        for (let item in defaultOptions) {
          if (options[item] != undefined) {
            defaultOptions[item] = options[item];
          }
        }
      }
      // 组件赋值
      for (let item in defaultOptions) {
        this[item] = defaultOptions[item];
      }

      this.isShow = true;
      return new Promise((resolve, reject) => (this.promise = { resolve, reject }));
    },
    handleAction(val) {
      this.isShow = false;
      //点击确认按钮
      if (val) {
        this.promise && this.promise.resolve();
      }
      //点击取消按钮
      else {
        this.promise && this.promise.reject();
      }
    }
  },
  watch: {
    isShow: {
      handler(current) {
        if (this.$mask) {
          current ? this.$mask.show() : this.$mask.hide();
        }
      }
    }
  },
  components: {
    Container,
    Icon,
    Btn
  }
};
</script>

<style scoped>
div.container {
  display: flex;
  flex-flow: column;
  width: 450px;
  height: 190px;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  margin: auto;
}

div.titleBar,
div.titleBar > div {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}

div.titleBar div.fl {
  margin-left: 20px;
}

div.titleBar div.fr {
  margin-right: 10px;
  cursor: pointer;
}

div.titleBar div.fr:hover {
  color: var(--color-danger);
}

div.content {
  flex: 1;
  display: flex;
  align-items: center;
  margin: 0px 20px;
}

div.content p {
  height: 30px;
  line-height: 30px;
  font-size: 16px;
}

div.content i {
  font-size: 25px;
  padding: 10px;
}

div.content i.icon-chenggong {
  color: var(--color-success);
}

div.content i.icon-shibai {
  color: var(--color-danger);
}

div.content i.icon-jinggao {
  color: var(--color-warning);
}

div.content i.icon-tishi {
  color: var(--color-text);
}

div.ctrl {
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  align-items: center;
  height: 60px;
}

button {
  margin-right: 20px;
}
</style>
