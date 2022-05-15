<template>
	<div class="pagination clr" v-if="pageCount>0">
		<p v-if="pageCount>2" :class={disabled:isFirst} title='上一页' @click="move(false)">
			<slot name="pre">&lt;</slot>
		</p>

		<template v-if="pageCount<=maximumDisplay">
			<p v-for="(num,index) in pageCount" :key="index" :class="{current:isActive(index)}" @click="echoInput(index)">{{num}}</p>
		</template>

		<template v-else>
			<template v-if="value<=(0+adjustedBorderline-2)">
				<p v-for="(num,index) in adjustedBorderline" :key="index" :class="{current:isActive(index)}" @click="echoInput(index)">{{num}}</p>
				<span>...</span>
				<p @click="echoInput(pageCount-1)">{{pageCount}}</p>
			</template>

			<template v-else-if="(value>(adjustedBorderline-2))&&(value<(pageCount-adjustedBorderline+1))">
				<p @click="echoInput(0)">1</p>
				<span>...</span>
				<template v-for="(item,index) in pageIndexArray.slice(value,value+3)">
					<p :key="index" :class="{current:isActive(item-1)}" @click="echoInput(item-1)">{{item}}</p>
				</template>
				<span>...</span>
				<p @click="echoInput(pageCount-1)">{{pageCount}}</p>
			</template>

			<template v-else-if="value>=(pageCount-adjustedBorderline+1)">
				<p @click="echoInput(0)">1</p>
				<span>...</span>
				<p v-for="(num,index) in adjustedBorderline" :key="index" :class="{current:isActive(index+pageCount-adjustedBorderline)}" @click="echoInput(index+pageCount-adjustedBorderline)">{{pageCount-adjustedBorderline+num}}</p>
			</template>
		</template>

		<p v-if="pageCount>2" :class={disabled:isLast} title='下一页' @click="move(true)">
			<slot name="next">&gt;</slot>
		</p>

		<div v-if="pageCount>maximumDisplay">
			<input type="text" v-model="num" autocomplete="off" @keyup.enter="redirect()" />
			<span>&nbsp;页&nbsp;</span>
			<input type='button' value='跳转' @click="redirect()" />
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Pagination',
		data() {
			return {
				num: 0,
			};
		},
		props: {
			//当前页index
			value: {
				type: Number,
				default() {
					return 0;
				},
			},
			//总页数
			pageCount: {
				type: Number,
				require: true,
				default() {
					return 1;
				},
			},
			//页码最多显示个数
			maximumDisplay: {
				type: Number,
				default() {
					return 10;
				},
			},
			//超过最多显示个数后，一次显示多少个页码
			borderline: {
				type: Number,
				default() {
					return 4;
				},
			},
		},
		computed: {
			isFirst() {
				return this.value == 0;
			},
			isLast() {
				return this.value === this.pageCount - 1;
			},
			pageIndexArray() {
				let _arr = [];
				for (var i = 0; i < this.pageCount; i++) {
					_arr.push(i);
				}
				return _arr;
			},
			adjustedBorderline() {
				if (this.borderline < 4) {
					return 4;
				}
				else if (this.borderline > this.pageCount - 2) {
					return this.pageCount - 2;
				}
				return this.borderline;
			},
		},
		methods: {
			echoInput(val) {
				//console.log(val);
				this.num = val + 1;
				this.$emit("input", val);
			},
			isActive(val) {
				return (val === this.value);
			},
			move(flag) {
				if (flag) {
					if (this.value < this.pageCount - 1) {
						this.echoInput(this.value + 1);
					}
				}
				else {
					if (this.value > 0) {
						this.echoInput(this.value - 1);
					}
				}
			},
			redirect() {
				if (/^\+?[1-9][0-9]*$/.test(this.num)) {
					let _num = parseInt(this.num);
					if (_num <= this.pageCount) {
						this.echoInput(_num - 1);
					}
				}
			},
		},
		mounted() {
			this.num = this.value + 1;
		},
	}
</script>

<style scoped>
	input {
		padding: 0px;
		border: 0px;
		outline: none;
	}

	p, input, span {
		display: block;
		height: 20px;
		line-height: 20px;
		margin: 0px 2px;
		color: var(--color-text);
		font-size: var(--font-size);
		text-align: center;
		float: left;
	}

	p {
		width: 20px;
		border: 1px solid #bebebe;
		border-radius: 3px;
	}

	span {
		border: 1px solid white;
	}

	input[type=text] {
		margin-left: 20px;
		width: 40px;
		border: 1px solid #bebebe;
	}

	input[type=button] {
		width: 50px;
		height: 20px;
		border: 1px solid #bebebe;
		border-radius: 3px;
		background: none;
	}

		p:hover, input[type=button]:hover {
			background: #ffb400;
			cursor: pointer;
		}

	p.disabled {
		background: #f5f5f5;
		color: #bebebe;
	}

	p.current {
		background: #ffb400;
	}

		p.disabled:hover, p.current:hover {
			cursor: default;
		}
</style>
