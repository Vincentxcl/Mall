<template>
  <div>
    <div>partB</div>
    <input ref="file" multiple type="file" name="input1" @change="get" />
    <button @click="upload()">XXXXXXX</button>

    <input type="button" value="Test" @click="onClick" />

    <dialog-window v-model="isShow">
      <div slot="content">XXXX</div>
    </dialog-window>

    <div drawable style="background: gray; width: 200px; height: 300px" v-drag>bbbb</div>
  </div>
</template>

<script>
import { imgUpload } from 'netWork/demo.js';
import DialogWindow from 'components/dialog/v1/dialogWindow.vue';
import { drag } from 'common/directives/drag.js';

export default {
  name: 'PartB',
  data() {
    return {
      uploadfiles: null,
      isShow: false
    };
  },
  methods: {
    onClick() {
      this.isShow = !this.isShow;
    },
    get() {
      this.uploadfiles = this.$refs.file.files;
    },
    upload() {
      let formData = new FormData();
      let k = 1;
      for (let item of this.uploadfiles) {
        let name = 'input' + k;
        formData.append(name, item);
        k++;
      }
      imgUpload(formData, this)
        .then(() => {
          console.log('ok');
        })
        .catch();
    }
  },
  components: {
    DialogWindow
  },
  directives: {
    drag: drag
  }
};
</script>

<style>
</style>
