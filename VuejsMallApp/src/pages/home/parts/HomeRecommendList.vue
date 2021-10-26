<template>
  <div class="homeRecommendList" :key="list.length">
    <ul>
      <li v-for="item in list" :key="item.acm">
        <a :href="item.link" :title="item.title">
          <img :src="item.image" alt="lostPic" />
          <p>{{item.title}}</p>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'HomeRecommendList',
    props: {
      list: {
        type: Array,
        default() {
          return [];
        },
      },
    },
  };
</script>

<style scoped>
  ul {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    height: auto;
    padding: 10px 0px 10px 0px;
    border-bottom: 10px solid #ededed;
  }

  li {
    display: flex;
    flex: 1;
    flex-flow: column;
    align-items: center;
  }

  img {
    display: block;
    width: 75px;
    height: 75px;
  }

  p {
    display: block;
    color: var(--color-text);
    font-size: 14px;
    text-align: center;
  }
</style>
