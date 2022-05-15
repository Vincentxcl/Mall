<template>
	<button class="btn" :title="title" :class="btnClass" @mouseenter="enter" @mouseleave="leave">
		<slot></slot>
	</button>
</template>

<script>
	export default {
		name: 'Btn',
		data() {
			return {
				isHover: false
			};
		},
		props: {
			title: {
				type: String,
				default() {
					return 'Button';
				}
			},
			type: {
				type: String,
				default: () => "normal"
			}
		},
		computed: {
			btnClass() {
				let obj = { hover: this.isHover };
				obj[this.type] = true;
				return obj;
			},
		},
		methods: {
			enter() {
				this.isHover = true;
			},
			leave() {
				this.isHover = false;
			}
		}
	};
</script>

<style scoped>
	/*按钮*/
	.btn {
		width: 100px;
		height: 30px;
		line-height: 30px;
		border-radius: 3px;
		font-size: 14px;
		text-align: center;
		border: none;
		outline: none;
		transition: all 0.5s ease;
	}

	.normal {
		background: white;
		color: var(--color-text);
		border: 1px solid var(--color-text);
	}

	.brand {
		background: var(--color-brand);
		color: white;
	}

	.success {
		background: var(--color-success);
		color: white;
	}

	.warning {
		background: var(--color-warming);
		color: white;
	}

	.danger {
		background: var(--color-danger);
		color: white;
	}


	.hover {
		opacity: 0.7;
	}
</style>
