<template>
  <footer>
    <site-map-path></site-map-path>
    <copyright></copyright>
  </footer>
</template>

<script>
import SiteMapPath from 'components/siteMapPath/oa.v1/index.vue';
import Copyright from 'components/copyright/ver1/copyright.vue';

export default {
  name: 'Bottom',
  components: {
    SiteMapPath,
    Copyright
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

.copyright {
  float: right;
  height: 30px;
  line-height: 30px;
  color: var(--color-warning);
  padding-right: 50px;
  font-size: 12px;
}
</style>
