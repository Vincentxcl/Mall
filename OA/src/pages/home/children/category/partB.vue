<template>
  <div>
    <div>partB</div>
    <input ref="file" multiple type="file" name="input1" @change="get" />
    <button @click="upload()">XXXXXXX</button>
  </div>
</template>

<script>
import { imgUpload } from 'netWork/demo.js';

export default {
  name: 'PartB',
  data() {
    return {
      uploadfiles: null
    };
  },
  methods: {
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

      imgUpload(formData,this)
        .then(() => {
          console.log('ok');
        })
        .catch();
    }
  }
};
</script>

<style>
</style>
