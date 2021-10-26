<template>
  <div class="numberButton">
    <div @click="reduce">
      <slot name="left">
        <span class="left">-</span>
      </slot>
    </div>
    <input type="text" :value="adjustedVal" @keyup.enter="echoInput" />
    <div @click="increase">
      <slot name="right">
        <span class="right">+</span>
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NumberButton',
    props: {
      value: {
        type: Number,
        default() {
          return 0;
        },
      },
      min: {
        type: Number,
        default() {
          return 0;
        },
      },
      max: {
        type: Number,
        default() {
          return 1000;
        },
      },
      step: {
        type: Number,
        default() {
          return 1;
        },
      },
    },
    computed: {
      adjustedVal() {
        if (this.value < this.min) {
          return this.min;
        }
        else if (this.value > this.max) {
          return this.max;
        }
        else {
          return this.value;
        }
      },
    },
    methods: {
      echoInput(e) {
        if (/^-?\d+$/.test(e.target.value)) {
          let n = parseFloat(e.target.value);
          if (n > this.max) {
            this.$emit("input", this.max);
          }
          else if (n < this.min) {
            this.$emit("input", this.min);
          }
          else {
            this.$emit("input", n);
          }
        }
        else {
          this.$emit("input", this.min);
        }
      },
      increase() {
        if (this.adjustedVal < this.max) {
          this.$emit("input", this.value + this.step);
        }
        else {
          this.$emit("input", null);
        }
      },
      reduce() {
        if (this.adjustedVal > this.min) {
          this.$emit("input", this.value - this.step);
        }
        else {
          this.$emit("input", null);
        }
      },
    },
  }
</script>

<style scoped>
  .numberButton {
    height: 18px;
    display: flex;
    flex-flow: row nowrap;
  }

  input {
    width: 30px;
    height: 18px;
    line-height: 18px;
    color: var(--color-text);
    border: none;
    border-top: 1px solid #e1e1e1;
    border-bottom: 1px solid #e1e1e1;
    outline: none;
    font-size: 14px;
    text-align: center;
  }

  span {
    display: block;
    width: 18px;
    height: 18px;
    text-align: center;
    background: #e1e1e1;
    border: 1px solid #e1e1e1;
  }

    span:hover {
      cursor: pointer;
      background: #dcdcdc;
    }

    span.left {
      line-height: 15px;
    }
</style>
