<template>
	<div v-show="existedCount>0" class="cfoot">
		<input type="checkbox" v-model="checkIsAll" />
		<span>已完成：{{completedCount}}/总计：{{existedCount}}</span>
		<input type="button" value="清除已完成" @click="del" />
	</div>
</template>

<script>
	export default {
		name: "CFoot",
		props: {
			jobs: {
				required: true,
				type: Array
			},
			setCompleted: {
				required: true,
				type: Function
			},
			deleteCompletedItems: {
				required: true,
				type: Function
			}
		},
		computed: {
			checkIsAll: {
				get() {
					return this.completedCount == this.existedCount && this.completedCount > 0;
				},
				set(val) {
					this.setCompleted(val);
				}
			},
			completedCount() {
				return this.jobs
					.filter((obj) => obj.isDel == false)
					.reduce((total, current) => total + (current.isCompleted ? 1 : 0), 0);
			},
			existedCount() {
				return this.jobs.reduce((total, current) => total + (current.isDel ? 0 : 1), 0);
			}
		},
		methods: {
			del() {
				if (confirm("是否清除已完成项目？")) {
					this.deleteCompletedItems();
				}
			}
		}
	}
</script>

<style scoped>
	.cfoot {
		display: flex;
		flex-flow: row;
		align-items: center;
		width: 530px;
		height: 40px;
		margin: 10px 0px;
	}

		.cfoot input, .cfoot span {
			margin-left: 10px;
		}

			.cfoot input[type="button"] {
				width: 100px;
				height: 25px;
				margin-left: auto;
				border: none;
				border-radius: 2px;
				background-color: #de1515;
				color: white;
				font-size: 14px;
				cursor: pointer;
			}

				.cfoot input[type="button"]:hover {
					background-color: #c81212;
				}
</style>
