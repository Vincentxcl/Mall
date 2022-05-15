<template>
  <div class="toast" :class="divClass">
    <icon :icon="iconType"></icon>
    <span v-html="text"></span>
  </div>
</template>

<script>
import icon from 'components/widgets/icon.vue';

export default {
  name: 'Toast',
  data() {
    return {
      isShow: true
    };
  },
  props: {
    type: {
      // 提示类型success warning error
      type: String,
      default: () => 'normal'
    },
    text: {
      type: String,
      default: () => '<a>Hello World</a>' // 使用了v-html支持富文本
    },
    duration: {
      type: Number,
      default: () => 3000
    }
  },
  computed: {
    iconType() {
      switch (this.type) {
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
    },
    divClass() {
      let obj = {};
      //enter or leave
      if (this.isShow) {
        obj['toast-enter'] = true;
      } else {
        obj['toast-leave'] = true;
      }
      //type
      let types = ['normal', 'success', 'warning', 'danger'];
      if (types.indexOf(this.type) != -1) {
        obj[this.type] = true;
      } else {
        obj.normal = true;
      }
      //
      return obj;
    }
  },
  mounted() {
    this.$nextTick(() => {
      //呈现
      setTimeout(() => {
        this.$emit('beforeFade'); //消失动画之前
        this.isShow = false;
        setTimeout(() => {
          this.$emit('faded'); //消失动画结束
        }, 1000);
      }, this.duration);
    });
  },
  components: {
    icon
  }
};
</script>

<style scoped>
/* #region type */
.normal {
  background: white;
  color: var(--color-text);
  border: 1px solid var(--color-text);
}

.success {
  background: #67c23a46;
  color: #3a751d;
  border: 1px solid #67c23a5d;
}

.warning {
  background: #e6a23c46;
  color: #b1751b;
  border: 1px solid #e6a23c56;
}

.danger {
  background: #f56c6c31;
  color: #c21a1a;
  border: 1px solid #f56c6c3d;
}
/* #endregion */

.toast {
  height: 42px;
  line-height: 42px;
  position: relative;
  z-index: 3010;
  margin-top: 8px;
  pointer-events: all;
}

.toast span {
  font-size: 14px;
}

i {
  margin: 0px 10px 0px 20px;
}

.toast-enter {
  animation: enter 1s 0s 1 normal;
  animation-fill-mode: forwards;
}

@keyframes enter {
  0% {
    transform: translateY(-28px);
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 0.9;
  }
}

.toast-leave {
  animation: leave 1s 0s 1 normal;
  animation-fill-mode: forwards;
}

@keyframes leave {
  0% {
    opacity: 0.9;
  }
  100% {
    opacity: 0;
  }
}
</style>
