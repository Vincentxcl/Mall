<template>
	<div class="schedule">
		<CHead :add="callBackAdd"></CHead>
		<CBody :jobs="jobs"></CBody>
		<CFoot :jobs="jobs" :setCompleted="callBackSetCompleted" :deleteCompletedItems="callBackDelCompletedItems"></CFoot>
	</div>
</template>

<script>
	import CHead from "./parts/header.vue";
	import CBody from "./parts/body.vue";
	import CFoot from "./parts/foot.vue";

	export default {
		name: "Schedule",
		data() {
			return {
				jobs: []
			}
		},
		methods: {
			callBackAdd(obj) {
				this.jobs.unshift(obj);
			},
			checkItem(id) {
				let _length = this.jobs.length;
				for (let i = 0; i < _length; i++) {
					if (this.jobs[i].id == id) {
						this.jobs[i].isCompleted = !this.jobs[i].isCompleted;
						break;
					}
				}
			},
			deleteItem(id) {
				let _length = this.jobs.length;
				for (var i = 0; i < _length; i++) {
					if (this.jobs[i].id == id) {
						this.jobs[i].isDel = true;
						break;
					}
				}
			},
			updateItem(id, val) {
				let _length = this.jobs.length;
				for (var i = 0; i < _length; i++) {
					if (this.jobs[i].id == id) {
						this.jobs[i].name = val;
						break;
					}
				}
			},
			callBackSetCompleted(bool) {
				let _length = this.jobs.length;
				for (let i = 0; i < _length; i++) {
					if (this.jobs[i].isDel == false) {
						this.jobs[i].isCompleted = bool;
					}
				}
			},
			callBackDelCompletedItems() {
				let _length = this.jobs.length;
				for (var i = 0; i < _length; i++) {
					if (this.jobs[i].isCompleted == true && this.jobs[i].isDel == false) {
						this.jobs[i].isDel = true;
					}
				}
			}
		},
		watch: {
			jobs: {
				deep: true,
				handler(current) {
					localStorage.setItem("jobs", JSON.stringify(current));
				}
			}
		},
		components: {
			CHead,
			CBody,
			CFoot
		},
		created() {
			if (localStorage.getItem("jobs") != null) {
				this.jobs = JSON.parse(localStorage.getItem("jobs"));
			}
		},
		mounted() {
			//在事件总线上绑定事件
			this.$bus.$on("checkItem", this.checkItem);
			this.$bus.$on("delClick", this.deleteItem);
			this.$bus.$on("updateItem", this.updateItem);
		},
		beforeDestory() {
			this.$bus.$off("checkItem");
			this.$bus.$off("delClick");
			this.$bus.$off("updateItem");
		}
	}
</script>

<style scoped>
	.schedule {
		display: flex;
		flex-flow: column;
		align-items: center;
		width: 560px;
		border: 1px solid #c6c6c6;
		border-radius: 5px;
	}
</style>
