<template>
  <div class="textBox">
    <div v-if="icon" class="icon" :style="iconStyle">
      <icon :icon="icon" @click.native="echoIconClick"></icon>
    </div>

    <textarea v-if="type == 'textarea'" v-model="valueField" :name="name" :maxlength="maxlength" :placeholder="placeholder" @click="echoClick" @focus="echoFocus" @blur="echoBlur" @keydown.tab="echoTab"></textarea>
    <input v-else ref="input" :style="inputStyle" v-model="valueField" :type="type" :name="name" :maxlength="maxlength" :placeholder="placeholder" :autocomplete="autocomplete" :title="title" @click="echoClick" @focus="echoFocus" @blur="echoBlur" @keydown.tab="echoTab" />

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
  name: 'TextBox',
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
      type: [String, Number]
    },
    type: {
      type: String,
      default() {
        return 'text';
      }
    },
    name: {
      type: String,
      default() {
        return uuid();
      }
    },
    maxlength: {
      type: Number,
      default() {
        return 30;
      }
    },
    placeholder: {
      type: String,
      default() {
        return '';
      }
    },
    autocomplete: {
      type: String,
      default() {
        return 'off';
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
    },
    //如果匹配了该正则，check时就返回true
    pattern: {
      type: String,
      default() {
        return '';
        //格式： '/[<script>\\[\\]{}\\\\+=]/';//eval函数碰到单\就删除，双就留一个
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
    inputStyle() {
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
    //验证是否为空和是否匹配正则
    regTest() {
      // 1.做正则验证
      if (this.pattern.trim() != '') {
        //console.log(eval(this.pattern));//查看正则
        // 匹配
        if (eval(this.pattern).test(this.valueField)) {
          this.tips = '';
          return true;
        }
        // 不匹配
        else {
          this.tips = '格式不正确';
          return false;
        }
      }
      // 2.不做正则验证
      else {
        this.tips = '';
        return true;
      }
    },
    check() {
      // 1.必填
      if (this.required) {
        //非空
        if (this.valueField.toString().trim() != '') {
          return this.regTest();
        }
        //为空
        else {
          this.tips = '请输入' + this.title;
          return false;
        }
      }
      // 2.非必填
      else {
        // 非空
        if (this.valueField.toString().trim() != '') {
          return this.regTest();
        }
        // 为空
        else {
          this.tips = '';
          return true;
        }
      }
    },
    //清除内容和验证提示
    clear() {
      this.valueField = '';
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

textarea {
  resize: none;
}

textarea,
input {
  border: 1px solid lightgray;
  outline: none;
  border-radius: 2px;
  font-size: 15px;
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
