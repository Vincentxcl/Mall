<template>
	<div class="textBox">
		<input ref="input" :type="type" :name="name" :placeholder="placeholder" :autocomplete="autocomplete" :maxlength="maxlength" :value="value" :title="title" @input="echoInput" @focus="echoFocus" @click="echoClick" />
		<div class="icon" :style="getIconPosition(rect)">
			<slot name="icon">
				<account title="账号"></account>
			</slot>
		</div>
		<slot name="tips" :tips="tips"></slot>
	</div>
</template>

<script>
	import Account from 'components/widgets/icons/account.vue';
	import { uuid } from 'common/helper/randomHelper';

	export default {
		name: 'TextBox',
		data() {
			return {
				rect: {},
				tips: '',
			};
		},
		props: {
			value: {},
			type: {
				type: String,
				default() {
					return 'text';
				},
			},
			name: {
				type: String,
				default() {
					return uuid();
				},
			},
			placeholder: {
				type: String,
				default() {
					return '';
				},
			},
			autocomplete: {
				type: String,
				default() {
					return 'off';
				},
			},
			maxlength: {
				type: Number,
				default() {
					return 30;
				},
			},
			title: {
				type: String,
				default() {
					return '';
				},
			},
			pattern: {
				type: String,
				default() {
					return '/[<>\\[\\]{}\\\\+=]/';//eval函数碰到单\就删除，双就留一个
				},
			},
		},
		methods: {
			getIconPosition(rect) {
				return { top: rect.y + 4 + 'px', left: rect.x + 4 + 'px' };
			},
			echoInput(event) {
				this.$emit("input", event.target.value);
			},
			echoFocus(event) {
				this.$emit("focus", event);
			},
			echoClick(event) {
				this.$emit("click", event);
			},
			//验证账号
			check() {
				//console.log(eval(this.pattern));//查看正则
				if (this.value.trim() == '') {
					this.tips = '请输入' + this.title;
					this.$refs.input.focus();
					return false;
				}
				else if (eval(this.pattern).test(this.value)) {
					this.tips = '请输入正确的格式';
					this.$refs.input.focus();
					return false;
				}
				else {
					this.tips = '';
					return true;
				}
			},
		},
		mounted() {
			this.rect = this.$refs.input.getBoundingClientRect();
		},
		components: {
			Account,
		},
	}
</script>

<style scoped>
	input {
		height: 30px;
		border: none;
		outline: none;
		border-radius: 3px;
		font-size: 15px;
		text-indent: 30px;
	}

	div.icon {
		position: absolute;
	}

	i.iconfont {
		font-size: 22px;
	}
</style>
