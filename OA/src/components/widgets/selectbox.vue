<template>
  <div class="selectbox">
    <div v-if="icon" class="icon" :style="iconStyle">
      <icon :icon="icon" @click.native="echoIconClick"></icon>
    </div>

    <select ref="select" :name="name" v-model="valueField" :style="selectStyle" :title="title" :multiple="multiple" @click="echoClick" @focus="echoFocus" @blur="echoBlur" @keydown.tab="echoTab">
      <option v-for="op in options" :key="op.value" :value="op.value">{{ op.title }}</option>
    </select>

    <span v-if="required" class="ext" :style="iconStyle">
      <icon icon="icon-bitian" title="必填"></icon>
    </span>
    <slot name="tips" :tips="tips"></slot>
  </div>
</template>

<script>
import Icon from './icon.vue';
import { uuid } from 'common/helper/randomHelper';

export default {
  name: 'SelectBox',
  data() {
    return {
      valueField: '',
      tips: ''
    };
  },
  props: {
    height: {
      type: Number,
      default() {
        return 30;
      }
    },
    icon: {
      type: String
    },
    value: {
      type: [String, Number, Array]
    },
    options: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      default() {
        return uuid();
      }
    },
    multiple: {
      type: Boolean,
      default() {
        return false;
      }
    },
    title: {
      type: String,
      default() {
        return '';
      }
    },
    required: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  computed: {
    iconStyle() {
      return {
        height: this.height + 'px',
        'line-height': this.height + 'px'
      };
    },
    selectStyle() {
      return {
        height: this.height + 'px',
        'line-height': this.height + 'px',
        'text-indent': this.icon ? '30px' : '0px'
      };
    }
  },
  methods: {
    echoClick(event) {
      this.$emit('click', event);
    },
    echoFocus(event) {
      this.$emit('focus', event);
    },
    echoBlur(event) {
      this.$emit('blur', event);
    },
    echoIconClick(event) {
      this.$emit('iconClick', event);
    },
    echoTab(event) {
      this.$emit('tab', event);
    },
    check() {
      // 1.必填
      if (this.required) {
        //非空
        if (this.valueField.toString().trim() != '') {
          return true;
        }
        //为空
        else {
          this.tips = '请输入' + this.title;
          return false;
        }
      }
      // 2.非必填
      else {
        this.tips = '';
        return true;
      }
    },
    //清除内容和验证提示
    clear() {
      this.valueField = undefined;
      this.tips = '';
    }
  },
  watch: {
    value: {
      handler(current) {
        this.valueField = current; //valueField是一个临时的变量，需要跟着value变化
      }
    },
    valueField: {
      handler(current) {
        this.$emit('input', current);
      }
    }
  },
  components: {
    Icon
  }
};
</script>

<style scoped>
div.icon {
  width: 30px;
  text-align: center;
  position: absolute;
}

div.icon > i.iconfont {
  font-size: 22px;
}

select {
  border: 1px solid lightgray;
  outline: none;
  border-radius: 2px;
}

.ext {
  display: inline-block;
  width: 20px;
  text-align: center;
}

.ext > i {
  color: var(--color-high-text);
}
</style>
