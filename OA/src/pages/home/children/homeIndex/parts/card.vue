<template>
  <div class="userCard">
    <div>
      <avatar></avatar>
      <div class="info">
        <h4>Admin</h4>
        <p>超级管理员</p>
      </div>
    </div>
    <div>
      <p>
        <span>上次登录时间</span>
        <span>2021-12-1</span>
      </p>
      <p>
        <span>上次登录地点</span>
        <span>美国</span>
      </p>
    </div>
  </div>
</template>

<script>
import Avatar from 'components/avatar/index.vue';

export default {
  components: {
    Avatar
  }
};
</script>

<style scoped>
.userCard {
  border-radius: 5px;
  min-width: 315px;
  height: 220px;
  margin-top: 10px;
  margin-left: 10px;
  padding: 10px;
  border: 1px solid rgb(230, 230, 230);
  box-shadow: 0px 0px 5px 2px rgb(230, 230, 230);
}

.userCard > div:first-child {
  display: flex;
  align-items: center;
  height: 60%;
  border-bottom: 1px solid rgb(189, 189, 189);
}

.userCard > div:first-child > div.avatar {
  width: 100px;
  height: 100px;
  margin-left: 10px;
}

.userCard > div:first-child > div.info {
  margin-left: 20px;
}

.userCard > div:first-child > div.info h4 {
  font-size: 22px;
}

.userCard > div:first-child > div.info p {
  padding-top: 10px;
  font-size: 14px;
}

.userCard > div:last-child {
  margin-top: 10px;
}

.userCard > div:last-child > p {
  margin-left: 10px;
  font-size: 14px;
  line-height: 30px;
}
</style>
