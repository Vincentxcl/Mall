<template>
	<div v-if="adjustJobs.length>0" class="cbody">
		<ul>
			<CItem v-for="(item) in adjustJobs" :item="item" :key="item.id"></CItem>
		</ul>
	</div>
	<div v-else class="cbody_empty">
		<p>请添加任务吧！</p>
	</div>
</template>

<script>
	import CItem from "./item.vue";

	export default {
		name: "CBody",
		props: {
			jobs: {
				type: Array,
				default() {
					return [];
				}
			}
		},
		computed: {
			adjustJobs() {
				return this.jobs.filter((obj) => obj.isDel == false);
			}
		},
		components: {
			CItem
		}
	}
</script>

<style scoped>
	.cbody {
		width: 530px;
		margin-top: 8px;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	.cbody_empty {
		width: 530px;
		height: 100px;
		text-align: center;
		line-height: 100px;
	}
</style>
