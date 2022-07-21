<template>
  <div class="switch" :style="divStyle">
    <label @click="click">
      <span class="slider" :data-on="tipOfCheck" :data-off="tipOfUncheck" :style="sliderStyle"></span>
      <span class="handle" :style="handleStyle"></span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'SwitchBtn',
  data() {
    return {
      val: false
    };
  },
  computed: {
    divStyle() {
      return { width: this.width + 'px' };
    },
    sliderStyle() {
      // 选中时 背景位置
      return this.val ? { 'margin-left': '0px' } : {};
    },
    handleStyle() {
      // 选中时 按钮位置
      return this.val ? { right: '0px' } : { right: this.width - 20 + 'px' };
    }
  },
  props: {
    width: {
      type: Number,
      default() {
        return 60;
      }
    },
    tipOfCheck: {
      type: String,
      default() {
        return 'ON';
      }
    },
    tipOfUncheck: {
      type: String,
      default() {
        return 'OFF';
      }
    },
    value: {
      type: Boolean
    }
  },
  methods: {
    click() {
      this.val = !this.val;
      this.$emit('input', this.val);
    }
  },
  watch: {
    value: {
      handler(current) {
        this.val = current;
      }
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  }
};
</script>

<style scoped>
.switch {
  position: relative;
}

label {
  position: relative;
  display: block;
  width: 100%;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #999999;
  border-radius: 10px;
}

.slider {
  display: block;
  width: 200%;
  margin-left: -100%;
  transition: all 0.3s ease-in 0s;
}

/* 伪类滑块 */
.slider::before,
.slider::after {
  display: block;
  float: right;
  width: 50%;
  height: 20px;
  padding: 0;
  line-height: 20px;
  font-size: 14px;
  color: white;
  font-family: Trebuchet, Arial, sans-serif;
  font-weight: bold;
  box-sizing: border-box;
}

/* 伪类 开启 */
.slider::after {
  content: attr(data-on);
  padding-left: 6px;
  background-color: #0ddf1f;
  color: #ffffff;
}

/* 伪类 关闭 */
.slider::before {
  content: attr(data-off);
  padding-right: 6px;
  background-color: #eeeeee;
  color: #999999;
  text-align: right;
}

/* 圆按钮 */
.handle {
  position: absolute;
  display: block;
  width: 16px;
  height: 16px;
  margin: auto 2px;
  background: #ffffff;
  top: 0;
  bottom: 0;
  border: 1px solid #999999;
  border-radius: 50%;
  transition: all 0.3s ease-in 0s;
}
</style>
