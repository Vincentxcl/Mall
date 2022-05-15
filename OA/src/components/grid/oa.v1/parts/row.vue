<template>
	<tr v-if="!temp.isEdit">
		<td style="text-align:center">
			<input type="checkbox" />
		</td>
		<td style="text-align:center">
			<div class="edit" @click="editItem()">
				<edit title="编辑"></edit>
			</div>
			<div class="del" @click="deleteItem()">
				<delete title="删除"></delete>
			</div>
		</td>
		<td v-for="(item,index) in fields" :key="index" :style="tdStyle(item)">
			{{temp[item.field]}}
		</td>
	</tr>
	<tr v-else>
		<slot name="edit"></slot>
	</tr>
</template>

<script>
	import Edit from 'icons/edit.vue';
	import Delete from 'icons/delete.vue';

	export default {
		name: 'Row',
		data() {
			return {
				temp: {},
			};
		},
		props: {
			fields: {
				require: true,
				type: Array
			},
			obj: {
				required: true,
				type: Object
			}
		},
		methods: {
			tdStyle(val) {
				return {
					'text-align': val['text-align']
				};
			},
			editItem() {
				if (!this.temp.hasOwnProperty("isEdit")) {
					this.$set(this.temp, "isEdit", true);//添加响应式的属性
				}
				else {
					this.temp.isEdit = true;
				}
			},
			deleteItem() {
				this.$emit('del',this.obj.id);
			},
		},
		watch: {
			obj: {
				handler(current) {
					this.temp = current;
				}
			},
		},
		mounted() {
			this.temp = this.obj;
		},
		components: {
			Edit,
			Delete,
		},
	};
</script>

<style scoped>
	.edit, .del {
		width: 25px;
		display: inline-block;
		cursor: pointer
	}
</style>
