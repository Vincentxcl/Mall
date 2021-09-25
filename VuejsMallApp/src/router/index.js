
import VueRouter from "vue-router";

const home = () => import("../pages/home/Home.vue");
const category = () => import("../pages/category/Category.vue");
const cart = () => import("../pages/cart/Cart.vue");
const profile = () => import("../pages/profile/Profile.vue");


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

export default new VueRouter({
	mode: "history",
	linkActiveClass: "active",
	routes
});
