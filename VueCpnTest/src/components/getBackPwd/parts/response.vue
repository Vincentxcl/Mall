<template>
	<div class="response">
		<text-box ref="responseCode" v-model="code" :width="280" :height="40" type="text" placeholder="请输入申请码" :maxlength="6" title="申请码">
			<div class="msg" slot="tips" slot-scope="textbox">
				<p>{{textbox.tips}}</p>
			</div>
		</text-box>

		<btn @click.native="next">下一步</btn>
		<div class="msg">{{tips}}</div>
	</div>
</template>

<script>
	import TextBox from 'components/widgets/textbox.vue';
	import Btn from 'components/button/btn.vue';

	export default {
		name: 'response',
		data() {
			return {
				code: '',
				tips: '',
			};
		},
		methods: {
			next() {
				if (this.$refs.responseCode.check()) {
					this.$emit('response', this.code);
				}
			},
			clear() {
				this.code = '';
				this.tips = '';
			},
		},
		components: {
			TextBox,
			Btn,
		},
	};
</script>

<style>
	.response {
		width: 280px;
		height: calc(100% - 76px);
		margin: auto;
		padding-top: 80px;
	}

		.response input {
			border: 1px solid #c6c6c6;
			text-indent: 10px;
		}

		.response .msg {
			height: 30px;
			color: var(--color-high-text);
			font-size: 14px;
		}

		.response .button {
			background-color: #c62b26;
			width: 280px;
			height: 40px;
			line-height: 40px;
			color: white;
			margin-top: 50px;
		}
</style>
