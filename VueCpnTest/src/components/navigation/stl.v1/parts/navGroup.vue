<template>
	<ul v-if="items && items.value.length > 0" v-show="isShow" class="navGroup" :class="ulClass">
		<nav-item v-for="item in value" :key="item.id" :item="item" @mouseenter="movein(item)" @mouseleave="moveout(item)" @click="itemClick(item)">
			<template slot="content">
				<!-- icon -->
				<div v-if="isCollapse && level == 0" class="icon">
					<icon :icon="item.icon" :title="item.title" />
				</div>
				<div v-else-if="!isCollapse" class="icon">
					<icon v-if="level == 0" :icon="item.icon" :title="item.title" />
				</div>

				<!-- title -->
				<div v-show="isCollapse && level > 0" class="ttl">{{ item.title }}</div>
				<transition name="slide-fade">
					<div v-show="!isCollapse" class="ttl">{{ item.title }}</div>
				</transition>

				<!-- child menu pointer icon -->
				<div v-if="isCollapse && item.children && level > 0" class="wrap">
					<icon icon="icon-xiayiyehouyiye" />
				</div>
				<div v-else-if="!isCollapse && item.children" class="wrap">
					<icon icon="icon-xiangshang" v-show="item.children.isShow" />
					<icon icon="icon-xiangxia" v-show="!item.children.isShow" />
				</div>
			</template>

			<!-- recursion child menu-->
			<nav-group v-if="item.children" :isCollapse="isCollapse" :items="item.children" :level="nextLevel()" />
		</nav-item>
	</ul>
</template>

<script>
//使用组合指南 1.Vuex module navigation.js记录使用的节点; 2.VueRouter 将节点使用过程登记到Vuex中

	import icon from 'components/widgets/icon.vue';
	import NavItem from './navItem.vue';

	export default {
		name: 'NavGroup',
		data() {
			return {
				value: [],
				isShow: true
			};
		},
		props: {
			isCollapse: {
				type: Boolean,
				default() {
					return false;
				}
			},
			items: {
				type: Object,
				required: true
			},
			level: {
				type: Number,
				default() {
					return 0;
				}
			}
		},
		computed: {
			ulClass() {
				let obj = {};
				obj['lv' + this.level] = true;
				obj.fold = this.isCollapse;
				obj.unfold = !this.isCollapse;
				return obj;
			}
		},
		methods: {
			nextLevel() {
				return this.level + 1;
			},
			movein(val) {
				if (this.isCollapse && val.children) {
					val.children.isShow = true;
				}
			},
			moveout(val) {
				if (this.isCollapse && val.children) {
					val.children.isShow = false;
				}
			},
			itemClick(val) {
				if (!this.isCollapse && val.children) {
					val.children.isShow = !val.children.isShow;
				}
			}
		},
		watch: {
			isCollapse: {
				handler(current) {
					if (current) {
						for (let i of this.value) {
							if (i.children) {
								i.children.isShow = false;//设置子菜单的显示
							}
						}
					}
				}
			},
			items: {
				deep: true,
				handler(current) {
					this.isShow = current.isShow;
				}
			}
		},
		created() {
			if (this.items) {
				this.value = this.items.value;
				this.isShow = this.items.isShow;
			}
		},
		components: {
			icon,
			NavItem
		}
	};
</script>
