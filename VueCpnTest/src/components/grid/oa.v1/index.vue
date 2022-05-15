<template>
	<div class="grid">
		<table>
			<thead>
				<tr>
					<th><input type="checkbox" /></th>
					<th></th>
					<th v-for="(item,index) in columns" :key="index" :style="thStyle(item)">{{item.alias}}</th>
				</tr>
			</thead>
			<tbody>
				<row v-for="(item) in objects" :key="item.id" :fields="fields" :obj="item" @del="del">
					<template slot="edit">
						<input type="text" value="Hello World" />
					</template>
				</row>
			</tbody>
		</table>
	</div>
</template>

<script>
	import Row from '../parts/row.vue';

	export default {
		name: 'Grid',
		props: {
			columns: {
				type: Array,
				require: true,
				default() {
					return [{
						"field": "email",
						"alias": "邮箱",
						"width": 100,
						"text-align": "center"
					}];
				}
			},
			objects: {
				type: Array,
				require: true,
				default() {
					return [];
				}
			}
		},
		computed: {
			fields() {
				return this.columns.map(function (o) {
					let f = {
						'field': o.field,
						'text-align': 'center',
					};
					if (o['text-align']) {
						f['text-align'] = o['text-align'];
					}
					return f;
				});
			},
		},
		methods: {
			thStyle(item) {
				let style = {};
				if (item.width) style['width'] = item['width'] + 'px';
				return style;
			},
			del(e) {
				this.$emit('del', e);
			},
		},
		components: {
			Row,
		},
	};
</script>

<style>
	div.grid table {
		width: 100%;
		table-layout: fixed;
		border-collapse: collapse;
	}

		/*head*/
		div.grid table thead th {
			height: 50px;
			line-height: 50px;
			border-top: 1px solid #c3c3c3;
			border-bottom: 1px solid #c3c3c3;
			font-size: 16px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

			div.grid table thead th + th {
				border-left: 1px solid #e4e4e4;
			}

			div.grid table thead th:nth-child(1) {
				width: 50px;
			}

			div.grid table thead th:nth-child(2) {
				width: 80px;
			}

		/*body*/
		div.grid table tbody tr:nth-child(2n+1) {
			background: #e4e4e4;
		}

		div.grid table tbody tr:hover {
			background: #ededed;
		}

		div.grid table tbody td {
			height: 40px;
			line-height: 40px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

			div.grid table tbody td + td {
				border-left: 1px solid #e4e4e4;
			}
</style>
