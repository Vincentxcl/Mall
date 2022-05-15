<template>
	<li>
		<div class="showArea" v-show="!item.isEdit">
			<label>
				<input type="checkbox" :checked="item.isCompleted" @change="itemCheck(item.id)" />
				<span>{{item.name}}</span>
			</label>
		</div>
		<div class="editArea" v-show="item.isEdit">
			<input type="text" ref="edit" :value="item.name" @blur="endEditItem" />
		</div>
		<div class="ctrlArea">
			<input type="button" class="edit" value="编 辑" @click="editItem" v-show="!item.isEdit" />
			<input type="button" class="del" value="删 除" @click="deleteItem(item.id,item.name)" />
		</div>
	</li>
</template>

<script>
	export default {
		name: "CItem",
		props: {
			item: {
				required: true,
				type: Object
			}
		},
		methods: {
			itemCheck(id) {
				this.$bus.$emit("checkItem", id);
			},
			editItem() {
				if (!this.item.hasOwnProperty("isEdit")) {
					this.$set(this.item, "isEdit", true);//添加响应式的属性
				}
				else {
					this.item.isEdit = true;
				}
				this.$nextTick(function () {
					this.$refs.edit.focus();
				});
			},
			endEditItem(e) {
				if (e.target.value.trim() != "") {
					this.$bus.$emit("updateItem", this.item.id, e.target.value.trim());
				}
				this.item.isEdit = false;
			},
			deleteItem(id, name) {
				if (confirm("是否删除:" + name + "?")) {
					this.$bus.$emit("delClick", id);
				}
			}
		}
	}
</script>

<style scoped>
	li {
		display: flex;
		flex-flow: row;
		justify-content: flex-start;
		align-items: center;
		height: 36px;
		line-height: 36px;
	}

		li:hover {
			background-color: #eeeeee;
		}

			li:hover input[type="button"] {
				display: block;
			}

		li label {
			cursor: pointer;
		}

			li label input {
				margin-left: 10px;
			}

			li label span {
				margin-left: 10px;
			}

		li div.editArea {
			margin-left: 10px;
		}

			li div.editArea input {
				height: 28px;
				border: 1px solid #ddd;
				font-size: 14px;
			}

		li div.ctrlArea {
			display: flex;
			margin-left: auto;
			flex-flow: row;
		}

		li input[type="button"] {
			width: 60px;
			height: 22px;
			line-height: 22px;
			margin-right: 10px;
			border: none;
			border-radius: 2px;
			color: white;
			font-size: 13px;
			display: none;
			cursor: pointer;
		}

		li input.edit {
			background-color: #007ACC;
		}

			li input.edit:hover {
				background-color: #0069b0;
			}

		li input.del {
			background-color: #de1515;
		}

			li input.del:hover {
				background-color: #c81212;
			}

		li + li {
			border-top: 1px solid #ddd;
		}
</style>
