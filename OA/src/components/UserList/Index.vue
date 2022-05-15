<template>
	<div class="userList">
		<Search @response="receive"></Search>
		<List :infos="infos"></List>
	</div>
</template>

<script>
	import List from "./List.vue";
	import Search from "./Search.vue";

	export default {
		name: "UserList",
		data() {
			return {
				infos: {
					isInitial: true,
					isLoading: false,
					users: [],
					errorMsg: ""
				}
			}
		},
		methods: {
			receive(val) {
				this.infos = val;
			}
		},
		components: {
			Search,
			List
		}
	}
</script>

<style scoped>
	.userList {
		width: 900px;
		margin: auto;
	}
</style>
