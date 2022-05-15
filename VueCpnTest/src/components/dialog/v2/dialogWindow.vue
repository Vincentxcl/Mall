<template>
  <container class="dialogWindow">
    <div class="titleBar">
      <div class="fl">
        <slot name="title">Dialog Window Title</slot>
      </div>
      <div class="fr" @click="iconClick">
        <slot name="icon">
          <icon icon="icon-guanbi" title="关闭"></icon>
        </slot>
      </div>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
    <div class="ctrl">
      <slot name="ctrl"></slot>
    </div>
  </container>
</template>

<script>
import Icon from 'components/widgets/icon.vue';
import Container from '../parts/container.vue';

export default {
  name: 'DialogWindow', //different from dialog in html5
  methods: {
    iconClick() {
      this.$emit('iconClick');
    }
  },
  components: {
    Icon,
    Container
  }
};
</script>

<style scoped>
div.dialogWindow {
  width: 500px;
  height: 300px;
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
  height: calc(100% - 100px);
}

div.ctrl {
  height: 60px;
}
</style>
