
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


const router = new VueRouter({
	mode: 'history',
	linkActiveClass: 'active',
	routes
});

router.afterEach((to) => {
	let node = router.app.$store.getters.siteNodes.find((val) => val.routeName == to.name);
	if (node) {
		router.app.$store.commit('AddUsedSiteNodes', node);
		if (node.path) {
			router.app.$store.commit('SetCurrentPath', node.path);
		}
	}
});

export default router;
