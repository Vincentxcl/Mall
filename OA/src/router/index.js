import appsetting from 'config/appsettings.json';
import VueRouter from 'vue-router';
import { getCookie } from 'common/helper/cookiesHelper.js';
import { tryGetToken, decodeJwtPayload } from 'common/helper/tokenHelper.js';
import { siteMapBuilder, siteNodesBuilder } from 'common/helper/siteMapHelper.js';

// 提示：组件名称应该与路由名称保持一致，否则影响自动跳转程序的功能
const login = () => import('../pages/login/loginPage.vue');
const register = () => import('../pages/register/registerPage.vue');

const home = () => import('../pages/home/home.vue');
const homeIndex = () => import('../pages/home/children/homeIndex/homeIndex.vue');
const partA = () => import('../pages/home/children/category/partA.vue');
const partB = () => import('../pages/home/children/category/partB.vue');
const profile = () => import('../pages/home/children/profile/Profile.vue');
const userList = () => import('../pages/home/children/userManagement/userList/userList.vue');
const roleList = () => import('../pages/home/children/userManagement/roleList/roleList.vue');

const sysParameter = () => import('../pages/home/children/appsetting/sysParameter/sysParameter.vue');
const sysParameterList = () => import('../pages/home/children/appsetting/sysParameter/children/sysParameterList.vue');
const searchSettingItem = () => import('../pages/home/children/appsetting/sysParameter/children/searchSettingItem.vue');
const searchSettingItemResult = () => import('../pages/home/children/appsetting/sysParameter/children/searchSettingItemResult.vue');
const settingItemDetail = () => import('../pages/home/children/appsetting/sysParameter/children/settingItemDetail.vue');
const createSettingItem = () => import('../pages/home/children/appsetting/sysParameter/children/createSettingItem.vue');
const editSettingItem = () => import('../pages/home/children/appsetting/sysParameter/children/editSettingItem.vue');

const actionList = () => import('../pages/home/children/appsetting/actionList/actionList.vue');
const logList = () => import('../pages/home/children/appsetting/logList/logList.vue');

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    name: 'login',
    path: '/login',
    component: login,
    beforeEnter: (to, from, next) => {
      let auth = getCookie('userAuth');
      //令牌不存在
      if (auth == undefined || auth.trim() == '') {
        next();
      }
      //令牌存在
      else {
        let payload = decodeJwtPayload(auth);
        let isExpired = payload.exp < new Date();
        //1.已过期
        if (isExpired) {
          next();
        }
        //2.未过期
        else {
          next('home');
        }
      }
    }
  },
  {
    name: 'register',
    path: '/register',
    component: register
  },
  {
    name: 'home',
    path: '/home',
    component: home,
    children: [
      {
        name: 'homeIndex',
        path: 'index',
        component: homeIndex,
        meta: {}
      },
      {
        name: 'categoryA',
        path: 'categoryA',
        component: partA
      },
      {
        name: 'categoryB',
        path: 'categoryB',
        component: partB
      },
      {
        name: 'profile',
        path: 'profile',
        component: profile,
        meta: {}
      },
      {
        name: 'userList',
        path: 'userList',
        component: userList,
        meta: {}
      },
      {
        name: 'actionList',
        path: 'actionList',
        component: actionList,
        meta: {}
      },
      {
        name: 'roleList',
        path: 'roleList',
        component: roleList,
        meta: {}
      },
      {
        name: 'sysParameter',
        path: 'sysParameter',
        component: sysParameter,
        meta: {},
        children: [
          {
            name: 'sysParameterList',
            path: 'list',
            component: sysParameterList,
            meta: {}
          },
          {
            name: 'searchSettingItem',
            path: 'search',
            component: searchSettingItem,
            meta: {}
          },
          {
            name: 'searchSettingItemResult',
            path: 'searchresult',
            component: searchSettingItemResult,
            props($route) {
              return {
                content: $route.query.content
              };
            },
            meta: {}
          },
          {
            name: 'settingItemDetail',
            path: 'detail/:id',
            component: settingItemDetail,
            props: true,
            meta: {}
          },
          {
            name: 'createSettingItem',
            path: 'create',
            component: createSettingItem,
            meta: {}
          },
          {
            name: 'editSettingItem',
            path: 'edit',
            component: editSettingItem,
            meta: {}
          }
        ]
      },
      {
        name: 'logList',
        path: 'logList',
        component: logList,
        meta: {}
      }
    ],
    redirect: '/home/index',
    beforeEnter: (to, from, next) => {
      tryGetToken('userAuth')
        .then((res) => {
          let claims = decodeJwtPayload(res);
          //依据权限claims，为home组件页，动态地添加站点地图
          let siteMapNodeProps = ['id', 'routeName', 'path', 'title', 'icon', 'substitutionTagSiteNodeId', 'type', 'supports'];
          let siteMap = siteMapBuilder(appsetting.siteMap, claims, siteMapNodeProps);
          router.app.$store.commit('SetSiteMap', siteMap);

          //加载站点菜单
          let siteMenuNodeProps = ['id', 'routeName', 'path', 'title', 'icon', 'substitutionTagSiteNodeId', 'type'];
          let siteMenu = siteNodesBuilder(siteMap, 'menuItem', siteMenuNodeProps);
          router.app.$store.commit('SetSiteMenu', siteMenu);

          //账号///////////////
          router.app.$store.commit('SetAccount', claims.Account);
          next();
        })
        .catch((error) => {
          console.log(error,'Home路由守卫提示');
          router.app.$toast.show({ type: 'warning', text: '路由守卫提示,无法加载,请重新<a href="/login">登录</a>' });
        });
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  routes
});

//全局路由后置守卫，保存当前访问的节点，以及节点路径
router.afterEach((to) => {
  let node = router.app.$store.getters.siteNodes.find((val) => val.routeName == to.name);
  if (node) {
    // 1.保存当前访问的节点，如果使用了替代节点，将替代节点提交到集合中，影响导航Tag的显示
    if (node.substitutionTagSiteNodeId) {
      let subNode = router.app.$store.getters.siteNodes.find((val) => val.id == node.substitutionTagSiteNodeId);
      router.app.$store.commit('AddUsedSiteNodes', subNode);
    } else {
      router.app.$store.commit('AddUsedSiteNodes', node);
    }

    // 2.保存节点路径
    if (node.path) {
      router.app.$store.commit('SetCurrentPath', node.path);
    }
  }
});

export default router;
