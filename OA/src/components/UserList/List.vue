<template>
	<div>
		<div class="empty" v-show="infos.isInitial">请输入查询</div>
		<div class="searching" v-show="infos.isLoading">查询中</div>
		<div class="listing" v-show="infos.users.length>0">
			<ul>
				<li v-for="item in infos.users" :key="item.id">
					<a :href="item.html_url">
						<img :src="item.avatar_url" alt="img" />
						<p>{{item.login}}</p>
					</a>
				</li>
			</ul>
		</div>
		<div class="error" v-show="infos.errorMsg!=''">{{infos.errorMsg.message}}</div>
	</div>
</template>

<script>
	export default {
		name: "List",
		props: {
			infos: {
				required: true,
				type: Object
			}
		}
	};
</script>

<style scoped>
	.listing ul {
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		align-items: center;
	}

	.listing li {
		display: flex;
		flex-flow: column;
		justify-content: flex-start;
		align-items: center;
		width: 200px;
		height: 230px;
		border: 1px solid #ccc;
		margin: 5px;
	}

		.listing li img {
			width: 180px;
			height: 180px;
			border: 1px solid black;
			margin-top: 10px;
		}

		.listing li p {
			width: 180px;
			height: 25px;
			border: 1px solid black;
		}
</style>
