<template>
  <div>
    <div>partB</div>
    <input ref="file" multiple type="file" name="input1" @change="get" />
    <button @click="upload()">XXXXXXX</button>

    <input type="button" value="Test" @click="onClick" />

    <img-uploader v-model="isShow" @submit="submit"></img-uploader>
  </div>
</template>

<script>
import { imgUpload } from 'netWork/demo.js';
import ImgUploader from 'components/uploader/v2/imgUploader.vue';

export default {
  name: 'PartB',
  data() {
    return {
      uploadfiles: null,
      isShow: false
    };
  },
  methods: {
    submit(e) {
      console.log(e);
    },
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
    ImgUploader
  }
};
</script>

<style>
</style>
