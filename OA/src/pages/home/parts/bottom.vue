<template>
  <footer>
    <site-map-path></site-map-path>
    <div class="info">Copyright © 肖成亮 tel:15285543874. All Rights Reserved！</div>
  </footer>
</template>

<script>
import SiteMapPath from 'components/siteMapPath/oa.v1/index.vue';

export default {
  name: 'Bottom',
  components: {
    SiteMapPath
  }
};
</script>

<style scoped>
footer {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background: #333;
}

.siteMapPath {
  float: left;
  width: 400px;
  height: 30px;
  line-height: 30px;
  color: white;
  padding-left: 10px;
  font-size: 13px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.info {
  float: right;
  height: 30px;
  line-height: 30px;
  color: white;
  padding-right: 50px;
  font-size: 13px;
}
</style>
