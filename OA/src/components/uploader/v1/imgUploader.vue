<template>
  <file-holder ref="fileholder" class="imgUploader" v-model="isShowField" :width="width" :height="height" :supportContentType="supportContentType" :supportContentSize="supportContentSize" @submit="submit">
    <img alt="Thumbnail" slot="file" slot-scope="slot" :src="slot.files[0]" @load="adjustSize" />
  </file-holder>
</template>

<script>
import FileHolder from '../parts/fileHolder.vue';
import { adjustImgWH } from 'common/helper/imageHelper.js';

//简单预览
export default {
  name: 'ImgUploader',
  data() {
    return {
      isShowField: false
    };
  },
  props: {
    width: {
      type: Number,
      default() {
        return 500;
      }
    },
    height: {
      type: Number,
      default() {
        return 580;
      }
    },
    isShow: {
      type: Boolean,
      default() {
        return false;
      }
    },
    supportContentType: {
      type: Array,
      default() {
        return ['image/jpeg', 'image/png'];
      }
    },
    supportContentSize: {
      type: Number,
      default() {
        return 2 * 1024 * 1024;
      }
    },
    message: {
      type: String
    }
  },
  methods: {
    adjustSize(event) {
      //调整img尺寸
      let img = event.target;
      let holderRect = this.$refs.fileholder.$refs.imgholder.getBoundingClientRect();
      adjustImgWH(img, holderRect.width, holderRect.height);
    },
    submit(val) {
      this.$emit('submit', val);
    }
  },
  watch: {
    isShow: {
      handler(current) {
        this.isShowField = current;
      }
    },
    isShowField: {
      handler(current) {
        this.$emit('change', current);
      }
    },
    message: {
      handler(cur) {
        this.$refs.fileholder.message = cur;
      }
    }
  },
  components: {
    FileHolder
  },
  model: {
    prop: 'isShow',
    event: 'change'
  }
};
</script>

<style>
.imgUploader div.content > div.view_preview > div.imgholder {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
