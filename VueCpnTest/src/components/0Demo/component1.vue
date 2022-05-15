<template>
	<div>
		<fieldset>
			<legend>访问state</legend>
			<h1>测试组件：{{name}}</h1>
			<h1>测试组件：{{age}}</h1>
		</fieldset>

		<fieldset>
			<legend>访问getters计算属性</legend>
			<h2>{{$store.getters.foo}}</h2>
			<h2>{{$store.getters.getFoo(3)}}</h2>

			<h2>{{foo}}</h2>
			<h2>{{getFoo(3)}}</h2>
		</fieldset>

		<fieldset>
			<legend>提交业务请求</legend>
			<input type="button" value="action_1" @click="action" />
			<input type="button" value="action_2" @click="actionMotive(500)" />
		</fieldset>

		<fieldset>
			<legend>提交数据操作</legend>
			<input type="button" value="ADD1" @click="mutation" />
			<input type="button" value="ADD2" @click="mutationMotive(10)" />
		</fieldset>

		<fieldset>
			<h2>{{$store.state.moduleA.production}}</h2>
			<h2>{{moduleA.production}}</h2>

			<h2>{{production}}</h2>
			<h2>{{plus}}</h2>
		</fieldset>

		<fieldset>
			<input type="button" value="RequestChange" @click="change" />
			<input type="button" value="CommitChange" @click="Change" />
		</fieldset>
	</div>
</template>

<script>
	//借助mapState生成计算属性
	import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

	export default {
		name: "cpn",
		methods: {
			//使用mapActions映射store对象中action的业务逻辑方法
			...mapActions({ action: "increament", actionMotive: "increamentMotive" }),
			//使用mapActions映射store的模块moduleA中action的业务逻辑方法
			...mapActions("moduleA", { change: "change" }),

			//使用mapMutations映射store对象中mutation的数据操作方法
			...mapMutations({ mutation: "Increament", mutationMotive: "IncreamentMotive" }),
			//使用mapMutations映射store的模块moduleA中mutation的数据操作方法
			...mapMutations("moduleA", { Change: "Change" }),
		},
		computed: {
			//使用mapState映射store对象中state的成员为计算属性
			...mapState(["name", "age", "moduleA"]),
			//使用mapState映射store的模块moduleA中state的成员为计算属性
			...mapState("moduleA", ["production"]),

			//使用mapGetters映射store对象中getters为计算属性
			...mapGetters({ foo: "foo", getFoo: "getFoo" }),
			//使用mapGetters映射store的模块moduleA中getters的成员为计算属性
			...mapGetters("moduleA", { plus: "plus" }),
		}
	}
</script>

<style scoped>
</style>
