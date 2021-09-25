
export default {
	namespaced: true,
	state: {
		production: "car"
	},
	getters: {
		plus(state) {
			return "the_" + state.production;
		}
	},
	actions: {
		change(context) {
			console.log(context);
			context.commit("Change");
		}
	},
	mutations: {
		Change(state) {
			state.production = "bus";
		}
	}
}
