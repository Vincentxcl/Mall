<template>
  <div class="checkButton" @click="echoInput">
    <p v-show="value">
      <slot name="checked">
        <span class="iconfont icon-duigouxiao"></span>
      </slot>
    </p>
    <p v-show="!value">
      <slot name="unchecked">
        <span class="empty"></span>
      </slot>
    </p>
  </div>
</template>

<script>
  import { vcheck } from "common/mixins.js";

  export default {
    name: 'CheckButton',
    mixins: [vcheck],
  }
</script>

<style>
  @import '~assets/css/checkButton/iconfont.css';

  .icon-duigouxiao {
    color: #ff8198;
  }

  .empty {
    display: block;
    width: 16px;
    height: 16px;
    border: 2px solid #ff8198;
    border-radius: 100%;
  }
</style>
