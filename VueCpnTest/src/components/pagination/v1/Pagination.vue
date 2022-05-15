<template>
	<div class="pagination clr" v-if="pageCount>0">
		<!--previous button-->
		<p v-if="pageCount>2" :class={disabled:isFirst} title='上一页' @click="move(false)">
			<slot name="pre">&lt;</slot>
		</p>

		<!--show all pages mode-->
		<template v-if="pageCount<=maximumDisplay">
			<p v-for="(number,index) in pageCount" :key="index" :class="{current:isActive(index)}" @click="flip(index)">
				{{number}}
			</p>
		</template>

		<!--show partial pages mode-->
		<template v-else>
			<!--current index in head paragraph-->
			<template v-if="value<=(0+adjustedCriticalNum-2)">
				<p v-for="(number,index) in adjustedCriticalNum" :key="index" :class="{current:isActive(index)}" @click="flip(index)">{{number}}</p>
				<span>...</span>
				<p @click="flip(pageCount-1)">{{pageCount}}</p>
			</template>

			<!--current index in middle paragraph-->
			<template v-else-if="(value>(0+adjustedCriticalNum-2))&&(value<(pageCount-adjustedCriticalNum+1))">
				<p @click="flip(0)">1</p>
				<span>...</span>
				<template v-for="(item,index) in middleParagraphPageIndexArray">
					<p :key="index" :class="{current:isActive(item-1)}" @click="flip(item-1)">{{item}}</p>
				</template>
				<span>...</span>
				<p @click="flip(pageCount-1)">{{pageCount}}</p>
			</template>

			<!--current index in tail paragraph-->
			<template v-else-if="value>=(pageCount-adjustedCriticalNum+1)">
				<p @click="flip(0)">1</p>
				<span>...</span>
				<p v-for="(number,index) in adjustedCriticalNum" :key="index" :class="{current:isActive(index+pageCount-adjustedCriticalNum)}" @click="flip(index+pageCount-adjustedCriticalNum)">{{pageCount-adjustedCriticalNum+number}}</p>
			</template>
		</template>

		<!--next button-->
		<p v-if="pageCount>2" :class={disabled:isLast} title='下一页' @click="move(true)">
			<slot name="next">&gt;</slot>
		</p>

		<!--controller-->
		<div v-if="pageCount>maximumDisplay">
			<input type="text" v-model="inputNum" autocomplete="off" @keyup.enter="redirect()" />
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
				temp: 0,
				inputNum: 0,
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
			//最多显示页码的个数
			maximumDisplay: {
				type: Number,
				default() {
					return 10;
				},
			},
			//分段显示的临界点
			criticalNum: {
				type: Number,
				default() {
					return 4;
				},
			},
			//中间部分页码的单边宽度，该值乘2加1就是中间部分页码的个数
			flankLength: {
				type: Number,
				default() {
					return 1;
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
			adjustedCriticalNum() {
				if (this.criticalNum < 4) {
					return 4;
				}
				else if (this.criticalNum > this.pageCount - 2) {
					return this.pageCount - 2;
				}
				return this.criticalNum;
			},
			adjustedFlankLength() {
				if (this.flankLength < 1) {
					return 1;
				}
				return this.flankLength;
			},
			middleParagraphPageIndexArray() {
				let startPage = this.value + 1 - this.flankLength;
				let endPage = this.value + this.flankLength + 2;

				//判断是否超出了边界，如果超出按照边界来剪切数组，上限为开始取值所以不减1，下线为结束取值的下一位所以要加1
				if (startPage < this.adjustedCriticalNum - 1) {
					startPage = this.adjustedCriticalNum - 1;
				}
				if (endPage > this.pageCount - this.adjustedCriticalNum + 3) {
					endPage = this.pageCount - this.adjustedCriticalNum + 3;
				}

				return this.pageIndexArray.slice(startPage, endPage);
			}
		},
		methods: {
			flip(val) {
				this.inputNum = val + 1;
				this.temp = val;
			},
			isActive(val) {
				return (val === this.value);
			},
			move(flag) {
				if (flag) {
					if (this.value < this.pageCount - 1) {
						this.flip(this.value + 1);
					}
				}
				else {
					if (this.value > 0) {
						this.flip(this.value - 1);
					}
				}
			},
			redirect() {
				//正整数
				if (/^\+?[1-9][0-9]*$/.test(this.inputNum)) {
					let _num = parseInt(this.inputNum);
					if (_num <= this.pageCount) {
						this.temp = _num - 1;
					}
				}
			},
		},
		watch: {
			temp: {
				handler(current) {
					this.$emit("input", current);
				}
			},
		},
		mounted() {
			this.inputNum = this.value + 1;
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
