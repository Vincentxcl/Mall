<template>
  <div class="uploadBtn">
    <div class="uploader">
      <icon icon="icon-tianjia"></icon>
    </div>
  </div>
</template>

<script>
////////添加文件按钮，未完成，只有样式
import icon from 'components/widgets/icon.vue';
export default {
  components: { icon },
  name: 'UploadPreviewBtn'
};
</script>

<style scoped>
.uploadBtn {
  width: 150px;
  height: 150px;
}

.uploader {
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
  border: 1px dashed var(--color-text);
  border-radius: 5px;
  background: #f1f1f1;
}

.uploader:hover {
  border: 1px dashed var(--color-brand);
  cursor: pointer;
}

.uploader i {
  font-size: 50px;
}
</style>
