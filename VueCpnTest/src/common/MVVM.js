export default class MVVM {
  constructor(options) {
    this.$options = options;
    this.$el = options.el;
    this.$data = options.data;
    for (const key in this.$data) {
      this.$proxy(key);
    }
    observer(this.$data);
    this.$compile = new Compile(this.$el, this);
  }

  // 属性代理，实现 vm.xxx -> vm._data.xxx
  $proxy(key) {
    Object.defineProperty(this, key, {
      configurable: false,
      enumerable: true,
      get() {
        return this.$data[key];
      },
      set(newVal) {
        this.$data[key] = newVal;
      },
    });
  }
}

// 观察者，遍历监听所有数据
function observer(data) {
  if (!data || typeof data !== 'object') {
    return;
  }
  for (const key in data) {
    observeProperty(data, key, data[key]);
  }
}

// 为属性添加get和set方法劫持数据的变化
function observeProperty(data, key, val) {
  const dep = new Dependence();// 每个属性都有一个订阅器
  observer(val); // 递归监听子属性
  // 配置get set
  Object.defineProperty(data, key, {
    enumerable: true, // 可枚举
    configurable: false, // 不能再define
    get() {
      // Dep.target 表示当前正在计算的 Watcher，它是全局唯一的，因为在同一时间只能有一个 Watcher 被计算。
      if (Dependence.target) {
        dep.addSub(Dependence.target);// 当Dep.target不为空时，添加当前watcher
      }
      console.log(`绑定到${key}的watcher有${dep.subscribe.length}个`);/// /////////////////////////////
      return val;
    },
    set(newval) {
      if (newval != val) {
        // console.log("发生Set");///////////////////////////////
        val = newval;
        dep.notify(); // 只要set就通知所有订阅者
      }
    },
  });
}

// 每个data成员都有个消息订阅器，记录该data成员的用户和通知用户
class Dependence {
  constructor() {
    this.subscribe = [];// 存储所有订阅者，也就是Watcher
  }

  addSub(watcher) {
    this.subscribe.push(watcher);
  }

  notify() {
    this.subscribe.forEach((item) => {
      item.update();
    });
  }
}

// 每个使用data中成员对象的'地方'就有自己的记者Watcher对象，负责在消息订阅器中获取数据和更新(回调函数)
class Watcher {
  constructor(vm, expression, callbackFn) {
    this.vm = vm;
    this.expression = expression;// 使用该表达式(key)在data中获取对应成员的value
    this.callbackFn = callbackFn;
    // new Watcher对象的时候就在订阅数据中添加一个记者
    // 在闭包内通过Dependence定义一个全局target属性，暂存watcher, 添加后移除该属性
    Dependence.target = this; // 将当前订阅者指向自己
    this.value = this.vm[this.expression]; // 触发data成员的getter会添加该watcher到订阅器中
    Dependence.target = null; // 添加完毕，重置
  }

  // 获取当前数据;
  get() {
    return this.vm[this.expression];
  }

  update() {
    this.run();
  }

  run() {
    const newValue = this.get(); // 获取新值
    const oldValue = this.value;
    if (newValue !== oldValue) {
      // console.log("正在更新" + this.expression);/////////////////////////////////////////
      this.value = newValue;
      this.callbackFn.call(this.vm, this.value, oldValue); // 执行Compile中绑定的回调，更新视图
    }
  }
}

// 编译器
class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);
    if (this.$el) {
      // 把el模板html对象放入内存(片段)
      this.$fragment = this.node2Fragment(this.$el);
      // 解析模板
      this.compile(this.$fragment);
      // 把编译后内存片段放回el元素
      this.$el.appendChild(this.$fragment);
    }
  }

  // 将节点解析成片段
  node2Fragment(el) {
    const fragment = document.createDocumentFragment();
    let child;
    while (child = el.firstChild) {
      // fragment有个特点，它每appendChild一个节点，该节点在dom上被删除
      fragment.appendChild(child);
    }
    return fragment;
  }

  // 编译el模板
  compile(el) {
    const { childNodes } = el;
    // Array.slice.call(arguments)，目的是将arguments对象提出来转化为数组，arguments本身并不是数组而是对象
    [].slice.call(childNodes).forEach((node) => {
      const text = node.textContent;
      const reg = /\{\{(.*)\}\}/;
      // 编译元素节点
      if (this.isElementNode(node)) {
        this.compileElement(node);
      }
      // 编译文本节点
      else if (this.isTextNode(node) && reg.test(text)) {
        this.compileText(node, RegExp.$1);
      }
      // 递归遍历编译子节点
      if (node.childNodes && node.childNodes.length) {
        this.compile(node);
      }
    });
  }

  // 编译元素node
  compileElement(node) {
    // 遍历所有属性
    const nodeAttrs = node.attributes;
    [].slice.call(nodeAttrs).forEach((attr) => {
      const attrName = attr.name;
      // 判断节点的属性是否为v-指令，如v-text='abc'
      if (this.isDerective(attrName)) {
        const expression = attr.value; // 如abc
        const dir = attrName.substring(2); // 如text
        // 是否为on指令 如 v-on:click='func'
        if (this.isEventDirective(dir)) {
          // 事件指令
          compileUtil.eventHandler(node, this.$vm, expression, dir);
        } else {
          // 普通指令
          if (compileUtil[dir]) {
            compileUtil[dir](node, this.$vm, expression);
          } else {
            console.log(`Sorry, Can't deal with v-${dir}!`);
          }
        }
      }
    });
  }

  // 编译文本node
  compileText(node, expression) {
    compileUtil.text(node, this.$vm, expression);
  }

  // 是否为元素node
  isElementNode(node) {
    return node.nodeType === 1;
  }

  // 是否为文本node
  isTextNode(node) {
    return node.nodeType === 3;
  }

  // 是否v-指令
  isDerective(attrName) {
    return attrName.indexOf('v-') >= 0;
  }

  // 是否为on··· 形式的指令(v-on指令)
  isEventDirective(attrName) {
    return attrName.slice(0, 3) == 'on:';
  }
}

// 编译工具
const compileUtil = {
  // 文本节点更新方法
  text(node, vm, expression) {
    this.bind(node, vm, expression, 'text');
  },
  // v-model
  model(node, vm, expression) {
    this.bind(node, vm, expression, 'model');
    node.addEventListener('input', (e) => {
      // 视图的变化更新到vm实例
      vm.$data[expression] = e.target.value;
    });
  },
  // 生成订阅者、节点更新、
  bind(node, vm, expression, dir) {
    // 选择更新节点方法
    const updaterFn = nodeUpdateUtils[`${dir}Updater`];
    // 每个使用data成员的地方就实例化一个订阅者，设置回调函数
    const watcher = new Watcher(vm, expression, (value) => {
      updaterFn && updaterFn(node, value);
    });
    // 获取date对应成员的value并更新节点
    updaterFn && updaterFn(node, watcher.value);
  },
  // 注册事件
  eventHandler(node, vm, expression, dir) {
    const eventType = dir.split(':')[1];// dir形式为 on:click，截取click
    if (eventType) {
      if (vm.$options.methods) {
        const fn = vm.$options.methods[expression];
        if (fn) {
          node.addEventListener(eventType, fn.bind(vm));// 绑定事件并指向vm!!!
        } else {
          console.log(`Can't find ${expression} in vm's methods`);
        }
      } else {
        console.log('There are no methods in vm');
      }
    } else {
      console.log("There is a problem in 'v-on:event' form");
    }
  },
};

// 节点node更新工具
const nodeUpdateUtils = {
  // 更新文本节点node的文本
  textUpdater(node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value;
  },
  // 更新元素节点node的value
  modelUpdater(node, value) {
    node.value = typeof value === 'undefined' ? '' : value;
  },
};
