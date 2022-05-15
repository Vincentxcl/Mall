<template>
	<div class="radioBtn">
		<ul>
			<li v-for="(item,index) in imgs" :key="item.id" :class="{select:index==selectIndex}" @click="itemClick(index)"></li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: "RadioBtn",
		props: {
			imgs: {
				type: Array,
				required: true,
			},
			selectIndex: {
				type: Number,
				default() {
					return 0;
				}
			},
		},
		methods: {
			itemClick(val) {
				this.$emit("radioBtnClick", val);
			},
		},
	};
</script>

<style scoped>
	.radioBtn {
		position: relative;
		text-align: center;
	}

	ul {
		height: 20px;
	}

	li {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 4px;
		background-color: white;
		margin: 0px 5px;
		cursor: pointer;
	}

		li.select, li:hover {
			transition: all 0.5s ease;
			background-color: #444;
		}
</style>
