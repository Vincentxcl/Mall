
import VueRouter from "vue-router";

//#region components
const home = () => import("pages/home/Home.vue");
const detail = () => import("pages/detail/Detail.vue");
const category = () => import("pages/category/Category.vue");
const cart = () => import("pages/cart/Cart.vue");
const profile = () => import("pages/profile/Profile.vue");
//#endregion

const routes = [
  {
    path: "",
    redirect: "/home",
  },
  {
    name: "home",
    path: "/home",
    component: home,
  },
  {
    name: "detail",
    //path: "/detail",
    path: "/detail/:login",
    props: true,
    component: detail,
    //props($router) {
    //  return {
    //    id: $router.query.id,
    //  };
    //},
  },
  {
    name: "category",
    path: "/category",
    component: category,
  },
  {
    name: "cart",
    path: "/cart",
    component: cart,
  },
  {
    name: "profile",
    path: "/profile",
    component: profile,
  },
]

const router = new VueRouter({
  mode: "history",
  linkActiveClass: "active",
  routes
});

export default router;
