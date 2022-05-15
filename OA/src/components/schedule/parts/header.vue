<template>
	<div class="chead">
		<input type="text" placeholder="请输入计划任务" value="" @keyup.enter="call" />
	</div>
</template>

<script>
	import { nanoid } from "nanoid";

	export default {
		name: "CHead",
		props: {
			add: {
				required: true,
				type: Function
			}
		},
		methods: {
			call(e) {
				if (e.target.value.trim() != "") {
					let job = {
						id: nanoid(),
						name: e.target.value.trim(),
						isCompleted: false,
						isDel: false
					};
					this.add(job);
					e.target.value = "";
				}
			}
		}
	}
</script>

<style scoped>
	.chead input {
		width: 530px;
		height: 28px;
		margin-top: 15px;
		font-size: 14px;
		border: 1px solid #ccc;
		border-radius: 4px;
		text-indent: 10px;
	}

		.chead input:focus {
			outline: none;
			border-color: #6dc5ff;
			box-shadow: 0px 1px 1px #9a9a9a inset,0px 0px 8px #6dc5ff;
		}
</style>
