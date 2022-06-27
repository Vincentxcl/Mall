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

//#region 用户管理
const user = () => import('../pages/home/children/userManagement/user/user.vue');
const userList = () => import('../pages/home/children/userManagement/user/children/userList.vue');
const searchUser = () => import('../pages/home/children/userManagement/user/children/searchUser.vue');
const searchUserResult = () => import('../pages/home/children/userManagement/user/children/searchUserResult.vue');
const userDetail = () => import('../pages/home/children/userManagement/user/children/userDetail.vue');
const createUser = () => import('../pages/home/children/userManagement/user/children/createUser.vue');
const editUser = () => import('../pages/home/children/userManagement/user/children/editUser.vue');
//#endregion

//#region 系统参数
const sysParams = () => import('../pages/home/children/appsetting/sysParams/sysParams.vue');
const sysParamsList = () => import('../pages/home/children/appsetting/sysParams/children/sysParamsList.vue');
const searchSysParams = () => import('../pages/home/children/appsetting/sysParams/children/searchSysParams.vue');
const searchSysParamsResult = () => import('../pages/home/children/appsetting/sysParams/children/searchSysParamsResult.vue');
const sysParamsDetail = () => import('../pages/home/children/appsetting/sysParams/children/sysParamsDetail.vue');
const createSysParams = () => import('../pages/home/children/appsetting/sysParams/children/createSysParams.vue');
const editSysParams = () => import('../pages/home/children/appsetting/sysParams/children/editSysParams.vue');
//#endregion

//#region 文件服务器
const fileServer = () => import('../pages/home/children/file/fileServer/fileServer.vue');
const fileServerList = () => import('../pages/home/children/file/fileServer/children/fileServerList.vue');
const searchFileServer = () => import('../pages/home/children/file/fileServer/children/searchFileServer.vue');
const searchFileServerResult = () => import('../pages/home/children/file/fileServer/children/searchFileServerResult.vue');
const fileServerDetail = () => import('../pages/home/children/file/fileServer/children/fileServerDetail.vue');
const createFileServer = () => import('../pages/home/children/file/fileServer/children/createFileServer.vue');
const editFileServer = () => import('../pages/home/children/file/fileServer/children/editFileServer.vue');
//#endregion

//#region 文件类型
const fileType = () => import('../pages/home/children/file/fileType/fileType.vue');
const fileTypeList = () => import('../pages/home/children/file/fileType/children/fileTypeList.vue');
const searchFileType = () => import('../pages/home/children/file/fileType/children/searchFileType.vue');
const searchFileTypeResult = () => import('../pages/home/children/file/fileType/children/searchFileTypeResult.vue');
const fileTypeDetail = () => import('../pages/home/children/file/fileType/children/fileTypeDetail.vue');
const createFileType = () => import('../pages/home/children/file/fileType/children/createFileType.vue');
const editFileType = () => import('../pages/home/children/file/fileType/children/editFileType.vue');
//#endregion

//#region 权限
const action = () => import('../pages/home/children/appsetting/action/action.vue');
const actionList = () => import('../pages/home/children/appsetting/action/children/actionList.vue');
const searchAction = () => import('../pages/home/children/appsetting/action/children/searchAction.vue');
const searchActionResult = () => import('../pages/home/children/appsetting/action/children/searchActionResult.vue');
const actionDetail = () => import('../pages/home/children/appsetting/action/children/actionDetail.vue');
const createAction = () => import('../pages/home/children/appsetting/action/children/createAction.vue');
const editAction = () => import('../pages/home/children/appsetting/action/children/editAction.vue');
const editActionRoles = () => import('../pages/home/children/appsetting/action/children/editActionRoles.vue');
//#endregion

//#region 角色
const role = () => import('../pages/home/children/appsetting/role/role.vue');
const roleList = () => import('../pages/home/children/appsetting/role//children/roleList.vue');
const searchRole = () => import('../pages/home/children/appsetting/role//children/searchRole.vue');
const searchRoleResult = () => import('../pages/home/children/appsetting/role//children/searchRoleResult.vue');
const roleDetail = () => import('../pages/home/children/appsetting/role//children/roleDetail.vue');
const createRole = () => import('../pages/home/children/appsetting/role//children/createRole.vue');
const editRole = () => import('../pages/home/children/appsetting/role//children/editRole.vue');
//#endregion

const logList = () => import('../pages/home/children/appsetting/logList/logList.vue');

//
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
      // 登录后自动跳转至首页
      let auth = getCookie('userAuth') || window.sessionStorage.getItem('userAuth');
      // 令牌不存在
      if (auth == undefined || auth.trim() == '') {
        next();
      }
      // 令牌存在
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
    component: register,
    beforeEnter: (to, from, next) => {
      // 登录后自动跳转至首页
      let auth = getCookie('userAuth') || window.sessionStorage.getItem('userAuth');
      // 令牌不存在
      if (auth == undefined || auth.trim() == '') {
        next();
      }
      // 令牌存在
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
        name: 'user',
        path: 'user',
        component: user,
        meta: {},
        children: [
          {
            name: 'userList',
            path: 'list',
            component: userList,
            meta: {}
          },
          {
            name: 'searchUser',
            path: 'search',
            component: searchUser,
            meta: {}
          },
          {
            name: 'searchUserResult',
            path: 'searchresult',
            component: searchUserResult,
            props($route) {
              return {
                search: $route.query.search //////////////////////////////////////////////////////////
              };
            },
            meta: {
              fromSearch: false
            }
          },
          {
            name: 'userDetail',
            path: 'detail/:id',
            component: userDetail,
            props: true,
            meta: {
              fromList: false
            }
          },
          {
            name: 'createUser',
            path: 'create',
            component: createUser,
            meta: {}
          },
          {
            name: 'editUser',
            path: 'edit',
            component: editUser,
            meta: {}
          }
        ]
      },
      {
        name: 'action',
        path: 'action',
        component: action,
        meta: {},
        children: [
          {
            name: 'actionList',
            path: 'list',
            component: actionList,
            meta: {}
          },
          {
            name: 'searchAction',
            path: 'search',
            component: searchAction,
            meta: {}
          },
          {
            name: 'searchActionResult',
            path: 'searchresult',
            component: searchActionResult,
            props($route) {
              return {
                search: $route.query.search,
                name: $route.query.name,
                controllerTtl: $route.query.controllerTtl,
                actionTtl: $route.query.actionTtl,
                httpMethod: $route.query.httpMethod
              };
            },
            meta: {
              fromSearch: false
            }
          },
          {
            name: 'actionDetail',
            path: 'detail/:id',
            component: actionDetail,
            props: true,
            meta: {
              fromList: false
            }
          },
          {
            name: 'createAction',
            path: 'create',
            component: createAction,
            meta: {}
          },
          {
            name: 'editAction',
            path: 'edit',
            component: editAction,
            meta: {}
          },
          {
            name: 'editActionRoles',
            path: 'ActionRoles',
            component: editActionRoles,
            meta: {}
          }
        ]
      },
      {
        name: 'fileServer',
        path: 'fileServer',
        component: fileServer,
        meta: {},
        children: [
          {
            name: 'fileServerList',
            path: 'list',
            component: fileServerList,
            meta: {}
          },
          {
            name: 'searchFileServer',
            path: 'search',
            component: searchFileServer,
            meta: {}
          },
          {
            name: 'searchFileServerResult',
            path: 'searchresult',
            component: searchFileServerResult,
            props($route) {
              return {
                ipAddress: $route.query.ipAddress,
                path: $route.query.path,
                diskCapacityGreaterThanOrEqual: $route.query.diskCapacityGreaterThanOrEqual,
                diskCapacityLessThanOrEqual: $route.query.diskCapacityLessThanOrEqual,
                search: $route.query.search
              };
            },
            meta: {
              fromSearch: false
            }
          },
          {
            name: 'fileServerDetail',
            path: 'detail/:id',
            component: fileServerDetail,
            props: true,
            meta: {
              fromList: false
            }
          },
          {
            name: 'createFileServer',
            path: 'create',
            component: createFileServer,
            meta: {}
          },
          {
            name: 'editFileServer',
            path: 'edit',
            component: editFileServer,
            meta: {}
          }
        ]
      },
      {
        name: 'fileType',
        path: 'fileType',
        component: fileType,
        meta: {},
        children: [
          {
            name: 'fileTypeList',
            path: 'list',
            component: fileTypeList,
            meta: {}
          },
          {
            name: 'searchFileType',
            path: 'search',
            component: searchFileType,
            meta: {}
          },
          {
            name: 'searchFileTypeResult',
            path: 'searchresult',
            component: searchFileTypeResult,
            props($route) {
              return {
                title: $route.query.title,
                format: $route.query.format,
                search: $route.query.search
              };
            },
            meta: {
              fromSearch: false
            }
          },
          {
            name: 'fileTypeDetail',
            path: 'detail/:id',
            component: fileTypeDetail,
            props: true,
            meta: {
              fromList: false
            }
          },
          {
            name: 'createFileType',
            path: 'create',
            component: createFileType,
            meta: {}
          },
          {
            name: 'editFileType',
            path: 'edit',
            component: editFileType,
            meta: {}
          }
        ]
      },
      {
        name: 'role',
        path: 'role',
        component: role,
        meta: {},
        children: [
          {
            name: 'roleList',
            path: 'list',
            component: roleList,
            meta: {}
          },
          {
            name: 'searchRole',
            path: 'search',
            component: searchRole,
            meta: {}
          },
          {
            name: 'searchRoleResult',
            path: 'searchresult',
            component: searchRoleResult,
            props($route) {
              return {
                search: $route.query.search
              };
            },
            meta: {
              fromSearch: false
            }
          },
          {
            name: 'roleDetail',
            path: 'detail/:id',
            component: roleDetail,
            props: true,
            meta: {
              fromList: false
            }
          },
          {
            name: 'createRole',
            path: 'create',
            component: createRole,
            meta: {}
          },
          {
            name: 'editRole',
            path: 'edit',
            component: editRole,
            meta: {}
          }
        ]
      },
      {
        name: 'sysParams',
        path: 'sysParams',
        component: sysParams,
        meta: {},
        children: [
          {
            name: 'sysParamsList',
            path: 'list',
            component: sysParamsList,
            meta: {}
          },
          {
            name: 'searchSysParams',
            path: 'search',
            component: searchSysParams,
            meta: {}
          },
          {
            name: 'searchSysParamsResult',
            path: 'searchresult',
            component: searchSysParamsResult,
            props($route) {
              return {
                search: $route.query.search
              };
            },
            meta: {
              fromSearch: false
            }
          },
          {
            name: 'sysParamsDetail',
            path: 'detail/:id',
            component: sysParamsDetail,
            props: true,
            meta: {
              fromList: false
            }
          },
          {
            name: 'createSysParams',
            path: 'create',
            component: createSysParams,
            meta: {}
          },
          {
            name: 'editSysParams',
            path: 'edit',
            component: editSysParams,
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
      //登陆验证，请求远端或者加载本地令牌
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

          //加载当前用户信息

          router.app.$store.dispatch('current/getUser', claims.Id);
          next();
        })
        .catch((error) => {
          console.log(error, 'Home路由守卫提示');
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
