<template>
  <div>
    <div>partB</div>
    <input ref="file" multiple type="file" name="input1" @change="get" />
    <button @click="upload()">XXXXXXX</button>

    <input type="button" value="Test" @click="onClick" />
  </div>
</template>

<script>
import { imgUpload } from 'netWork/demo.js';
import { toChainProps } from 'common/helper/convertHelper.js';

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
      const a = {
        name: 'vin',
        age: 18,
        body: {
          height: 170,
          weight: 75
        },
        family: {
          address: 'streetA1',
          components: {
            mon: 'lily',
            dad: {
              name: 'chen',
              age: 30
            }
          }
        }
      };
      const b = {
        name: 'vin',
        age: 19,
        body: {
          height: 170,
          weight: 70
        },
        company: {
          name: 'microsoft'
        },
        family: {
          address: 'streetb',
          components: {
            mon: 'alice',
            dad: {
              name: 'chen',
              age: 27
            }
          }
        }
      };

      let result = toChainProps('', b);

      console.log(result);
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
  components: {}
};
</script>

<style>
</style>
