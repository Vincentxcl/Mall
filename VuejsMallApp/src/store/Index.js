
import Vue from 'vue';
import Vuex from 'vuex';
import moduleA from "./moduleA";

Vue.use(Vuex);

const state = {
	name: 1000,
	age: 18
};

const getters = {
	adjustData(state) {
		return "$" + state.name.toFixed(2);
	},
	foo(_, getters) {
		return getters.adjustData;
	},
	getFoo(state) {
		return function (n) {
			return "$" + state.name.toFixed(n);
		}
	}
};

const actions = {
	increament(context) {
		setTimeout(() => {
			context.commit("Increament");
		}, 2000);
	},
	increamentMotive(context, payLoad) {
		setTimeout(() => {
			console.log(payLoad);
			context.commit("Increament");
		}, payLoad);
	}
};

const mutations = {
	Increament(state) {
		state.name++;
	},
	IncreamentMotive(state, payload) {
		//方法1: payload为一个普通的数据
		state.name += payload;
	}
};

//模块
const modules = {
	moduleA
};

export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
	modules
});
