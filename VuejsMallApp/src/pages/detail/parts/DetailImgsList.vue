<template>
  <imgs-list ref="imgsList" :list="list">
    <div class="head" slot="head">
      <p>
        <span class="point"></span>
        <span class="line"></span>
      </p>
      <p>相关图片</p>
      <p>
        <span class="line"></span>
        <span class="point"></span>
      </p>
    </div>
  </imgs-list>
</template>

<script>
  import ImgsList from 'components/album/imgsList/ImgsList.vue';

  export default {
    name: 'DetailImgsList',
    props: {
      list: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    components: {
      ImgsList,
    },
  };
</script>

<style scoped>
  .imgsList {
    margin-top: 10px;
  }

  .head {
    padding: 0px 5px;
  }

    .head > p:nth-child(2) {
      font-size: 20px;
      text-align: center;
      color: var(--color-text);
    }

    .head > p:nth-child(3) {
      text-align: right;
    }

    .head span {
      display: inline-block
    }

      .head span.point {
        width: 5px;
        height: 5px;
        background: #464646;
      }

      .head span.line {
        width: 100px;
        border-bottom: 1px solid #b5b5b5;
      }
</style>
