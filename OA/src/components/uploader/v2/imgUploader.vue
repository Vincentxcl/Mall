<template>
  <file-holder ref="fileholder" class="imgUploader" v-model="isShowField" :width="width" :height="height" :supportContentType="supportContentType" :supportContentSize="supportContentSize" @submit="submit">
    <template slot="file" slot-scope="slot">
      <img-clipper :width="width - 2" :height="height - 72" v-model="slot.files[0]" />
    </template>
  </file-holder>
</template>

<script>
import FileHolder from '../parts/fileHolder.vue';
import ImgClipper from 'components/imgClipper/index.vue';

//具有剪切功能
export default {
  name: 'ImgUploader',
  data() {
    return {
      isShowField: false,
      imgData: null
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
    FileHolder,
    ImgClipper
  },
  model: {
    prop: 'isShow',
    event: 'change'
  }
};
</script>
