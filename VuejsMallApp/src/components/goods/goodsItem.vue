<template>
  <li>
    <a :href="info.html_url" @click.prevent="itemClick">
      <img :src="info.avatar_url" @load="imgOnLoad" />
      <div class="ttl">
        <p>
          <span>{{info.id}}</span>
          <span>{{info.login}}</span>
        </p>
        <p>{{info.node_id}}</p>
      </div>
    </a>
  </li>
</template>

<script>
  export default {
    name: 'GoodsItem',
    props: {
      info: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    methods: {
      itemClick() {
        this.$router.push({
          name: 'detail',
          params: {
            login: this.info.login.toString(),
          },
          //  query: {
          //    id: this.info.id,
          //  },
        });
      },
      imgOnLoad() {
        this.$bus.$emit("itemImgOnLoad");
      },
    },
  };
</script>

<style scoped>
  li {
    display: flex;
    width: 47%;
    margin-bottom: 10px;
  }

  a, img {
    display: block;
    width: 100%;
    height: auto;
  }

  img {
    border-radius: 10px;
  }

  .ttl {
    width: 100%;
    height: auto;
    text-align: center;
    padding: 0px 10px;
  }

  p {
    line-height: 25px;
    font-size: 15px;
    color: var(--color-text);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
