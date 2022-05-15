
<template>
	<div>
		<scroll ref="scroll" :probeType="3" :pullDownRefresh="{threshold:90,stop:0}" :pullUpLoad="true" @scroll="position" @pullingDown="pulldown" @pullingUp="pullup">
			<p v-show="isShow">正在刷新</p>
			<ul>
				<li>
					<h1>01</h1>
				</li>
				<li>
					<h1>02</h1>
				</li>
				<li>
					<h1>03</h1>
				</li>
				<li>
					<h1>04</h1>
				</li>
				<li>
					<h1>05</h1>
				</li>
				<li>
					<h1>06</h1>
				</li>
				<li>
					<h1>07</h1>
				</li>
				<li>
					<h1>08</h1>
				</li>
				<li>
					<h1>09</h1>
				</li>
				<li>
					<h1>10</h1>
				</li>
			</ul>
		</scroll>

		<Schedule></Schedule>

    <h3>01</h3>
    <h3>02</h3>
    <h3>03</h3>
	</div>

</template>

<script>

	import Scroll from 'components/scroll/scroll.v2.vue';
	import Schedule from 'components/schedule/index.vue';

	//import UserList from 'components/UserList/Index.vue';


	export default {
		name: "Home",
		data() {
			return {
				isShow: false,
				index: 0,
				pageCount: 1,
				headItem: [
					{
						"field": "setting",
						"alias": "名称",
						"width": 100,
						"text-align": "center"
					},
					{
						"field": "value",
						"alias": "值",
						"width": 100,
						"text-align": "center"
					},
					{
						"field": "description",
						"alias": "描述",
						"text-align": "left"
					},
					{
						"field": "ord",
						"alias": "序号",
						"text-align": "center"
					},
				],
				json: [],
				isShowAddDialog: false,
			};
		},
		methods: {
			position(alias) {
				if (alias.y > 0) {
					this.isShow = true;
					//console.log(alias);
				}
				else {
					this.isShow = false;
				}
			},
			pulldown() {
				//console.log("pulldown");
				this.$refs.scroll.finishPullDown();

			},
			pullup() {
				//console.log("pullup");
				this.$refs.scroll.refresh();
				setTimeout(() => {
					this.$refs.scroll.finishPullUp();
				}, 2000);
			},
		},
		watch: {
			index: {
				handler(current) {
					this.getData(current + 1);
				},
			},
		},
		components: {
			Scroll,
			Schedule,
			//UserList
		}
	};
</script>

<style scoped>
	.wrapper {
		width: 300px;
		height: 400px;
		border: 1px solid black;
		margin: 10px 10px;
	}
</style>
