<template>
  <row >
    <column :span="8" class="p1">
      <card></card>
      <div class="bg-purple b1">222</div>
    </column>
    <column :span="16" class="p2 bg-purple-dark">
      <div class="bg-purple-light" style="height: 200px">2 1</div>
      <div class="bg-purple-dark" style="height: 300px">2 2</div>
      <div class="g" style="height: 300px">2 3</div>
    </column>
  </row>
</template>

<script>
import Column from 'components/layout/column.vue';
import Row from 'components/layout/row.vue';
import Card from './parts/card.vue';

export default {
  name: 'HomeIndex',
  // created() {
  //   requestData(0)
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // },
  components: {
    Column,
    Row,
    Card
  }
};
</script>

<style scoped>
.row,
.column {
  height: 100%;
}

.b1 {
  height: calc(100% - 230px);
}

.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.g {
  background: #edf2e5;
}
</style>
