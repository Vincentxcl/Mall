<template>
  <aside class="asideBar">
    <h3 v-if="isCollapse">OA</h3>
    <h3 v-else-if="!isCollapse">OA协同系统</h3>
    <nav-group :items="$store.getters.siteMap" :isCollapse="isCollapse"></nav-group>
  </aside>
</template>

<script>
import NavGroup from './parts/navGroup.vue';

export default {
  name: 'AsideBar',
  computed: {
    isCollapse() {
      return this.$store.getters.isMenuCollapse;
    }
  },
  components: {
    NavGroup
  }
};
</script>

<style>
.asideBar {
  background: #666666;
}

.asideBar h3 {
  height: 45px;
  line-height: 45px;
  color: white;
  font-size: 16px;
  text-align: center;
}

.asideBar div.active {
  color: var(--color-high-text) !important;
}

/* #region 0级菜单单元格 */
.asideBar > ul > li > div.content {
  height: 45px;
  line-height: 45px;
  border-top: 1px solid #707070;
  border-bottom: 1px solid #5a5a5a;
  cursor: pointer;
  color: white;
}

.asideBar > ul > li > div > div.icon {
  width: 45px;
  height: 45px;
}

.asideBar > ul > li > div > div.icon > i {
  margin-left: 12px;
  font-size: 20px;
}
/* #endregion */

/* #region fold */
/* =0级 菜单 */
.asideBar > ul.fold {
  width: 45px;
  height: calc(100% - 45px);
}

.asideBar > ul.fold div.relative {
  color: var(--color-high-text) !important;
}

.asideBar > ul.fold > li > div.content {
  width: 100%;
}

.asideBar > ul.fold > li > div.active {
  background: #4b4b4b;
  color: #ffe710;
}

.asideBar > ul.fold > li > div.content:hover {
  background: #4b4b4b;
}

/* >0级 菜单 */
.asideBar > ul.fold > li ul {
  width: 200px;
  position: absolute;
  z-index: 3000;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0px 0px 3px 1px #d1d1d1;
}

.asideBar > ul.fold > li ul > li > div.content {
  display: flex;
  height: 40px;
  line-height: 40px;
  font-size: 13px;
}

.asideBar > ul.fold > li ul > li > div.content:hover {
  background: #f1f1f1;
  cursor: pointer;
}

.asideBar > ul.fold > li ul > li > div.content > div.ttl {
  padding-left: 10px;
}

.asideBar > ul.fold > li ul > li > div.content > div.wrap {
  margin-left: auto;
  width: 38px;
  text-align: center;
}

.asideBar > ul.fold > li ul > li > div.content > div.wrap > i {
  font-size: 12px;
}

.asideBar > ul.fold > li ul > li:hover > div.content > div.wrap {
  transition: all 0.5s ease;
  transform: rotate(180deg);
}

/* =1级 菜单*/
.asideBar > ul.fold > li > ul {
  margin-top: -45px;
  margin-left: 45px;
}

/* >1级 菜单*/
.asideBar > ul.fold > li > ul > li ul {
  margin-top: -40px;
  margin-left: 200px;
}
/* #endregion */

/* #region unfold */
/* >=0级 菜单 */
.asideBar > ul.unfold {
  width: 180px;
  height: calc(100% - 45px);
}

.asideBar ul.unfold > li > div.content {
  display: flex;
  width: 100%;
  height: 45px;
  line-height: 45px;
  cursor: pointer;
  color: white;
}

.asideBar ul.unfold > li > div.active {
  background: #4b4b4b;
  color: #ffe710;
}

.asideBar ul.unfold > li > div:hover {
  background: #4b4b4b;
}

.asideBar ul.unfold > li > div > div.icon {
  width: 45px;
  height: 45px;
}

.asideBar ul.unfold > li > div > div.icon > i {
  margin-left: 12px;
  font-size: 20px;
}

.asideBar ul.unfold > li > div.content > div.ttl {
  flex: 1;
  font-size: 14px;
}

.asideBar ul.unfold > li > div.content > div.wrap {
  margin-left: auto;
  width: 38px;
  text-align: center;
  text-indent: 0em !important;
}

.asideBar ul.unfold > li > div.content > div.wrap > i {
  font-size: 10px;
}
/* #endregion */

/* #region animate */
.asideBar ul.navGroup {
  transition: all 0.5s ease;
}

.asideBar .slide-fade-enter-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
  opacity: 0;
}

.asideBar .slide-fade-enter,
.asideBar .slide-fade-leave {
  display: none;
}
/* #endregion animate */
</style>
