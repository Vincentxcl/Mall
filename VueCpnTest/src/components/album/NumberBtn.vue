<template>
	<div class="numberBtn">
		<ul>
			<li v-for="(item,index) in imgs" :key="item.id" :class="{select:index==selectIndex}" :style="{width:btnWidth,height:btnHeight}" @click="itemClick(index)">{{index+1}}</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: "NumberBtn",
		props: {
			imgs: {
				type: Array,
				required: true,
			},
			itemWH: {
				type: Object,
				default() {
					return {
						w: "18",
						h: "18",
					};
				},
			},
			selectIndex: {
				type: Number,
				default() {
					return 0;
				}
			},
		},
		computed: {
			btnWidth() {
				return this.itemWH.w + "px";
			},
			btnHeight() {
				return this.itemWH.h + "px";
			},
		},
		methods: {
			itemClick(val) {
				this.$emit("numberClick", val);
			},
		},
	};
</script>

<style scoped>
	.numberBtn {
		position: relative;
	}

	li {
		font: 12px 'Microsoft YaHei';
		display: inline-block;
		text-align: center;
		line-height: 18px;
		margin: 0px 1px;
		background-color: white;
		cursor: pointer;
	}

		li.select, li:hover {
			transition: all 0.5s ease;
			background-color: red;
			color: white;
		}
</style>
