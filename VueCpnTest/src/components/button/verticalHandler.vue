<template>
  <div class="verticalHandler">
    <div></div>
  </div>
</template>

<script>
export default {
  name: 'VerticalHandler'
};
</script>

<style scoped>
.verticalHandler {
  position: absolute;
  z-index: 1100;
  width: 6px;
  height: 120px;
  padding: 45px 1px;
  clip-path: polygon(0 0, 100% 8%, 100% 92%, 0 100%);
  background-color: #333;
  cursor:pointer;
}

.verticalHandler > div {
  width: 4px;
  height: 30px;
  border-radius: 4px;
  background: white;
}
</style>
