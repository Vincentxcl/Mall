<template>
	<div>
		<input type="text" placeholder="请输入模糊查询条件" v-model="str" />
		<input type="button" value="Search" @click="search" />
	</div>
</template>

<script>
	import { buildAjax } from "common/helper/netWorkHelper.js";

	export default {
		name: "Search",
		data() {
			return {
				str: ""
			}
		},
		methods: {
			search() {
				//创建一个axios对象
				let ajax = buildAjax({
					baseURL: "https://api.github.com",
					headers: {
						Accept: "application/json"
					},
					responseType: "json",
				});

				ajax.interceptors.request.use(
					config => {
						//请求之前发送一个数据
						this.$emit("response", {
							isInitial: false,
							isLoading: true,
							users: [],
							errorMsg: ""
						});
						return config;
					},
					error => {
						console.log(error);
					});

				ajax.interceptors.response.use(
					res => {
						this.str = "";
						return res;
					},
					error => {
						console.log(error);
					});

				ajax({
					method: "get",
					url: "/search/users",
					params: {
						q: this.str
					},
					timeout: 3000
				})
					.then(response => {
						this.$emit("response", {
							isInitial: false,
							isLoading: false,
							users: response.data.items,
							errorMsg: ""
						});
					})
					.catch(error => {
						this.$emit("response", {
							isInitial: false,
							isLoading: false,
							users: [],
							errorMsg: error
						});
					});
			}
		}

	};
</script>

<style scoped>
</style>
