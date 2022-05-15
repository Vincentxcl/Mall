<template>
  <div class="pagination">
    <select v-model="index">
      <option v-for="(item, index) in pageCount" :key="index" :value="index">{{ item }}</option>
    </select>

    <div class="btn" :class="{ disabled: isFirst }" @click="jumpToFirst()">
      <slot name="first">
        <icon icon="icon-diyiye" title="第一页"></icon>
      </slot>
    </div>
    <div class="btn" :class="{ disabled: isFirst }" @click="move(false)">
      <slot name="pre">
        <icon icon="icon-shangyiyeqianyiye" title="前一页"></icon>
      </slot>
    </div>

    <div class="dialog">
      <input type="text" v-model="inputNum" autocomplete="off" @keyup.enter="redirect()" />
      <span>&nbsp;共&nbsp;{{ pageCount }}&nbsp;页&nbsp;</span>
    </div>

    <div class="btn" :class="{ disabled: isLast }" @click="move(true)">
      <slot name="next">
        <icon icon="icon-xiayiyehouyiye" title="下一页"></icon>
      </slot>
    </div>
    <div class="btn" :class="{ disabled: isLast }" @click="jumpToLast()">
      <slot name="last">
        <icon icon="icon-zuihouyiye" title="最后页"></icon>
      </slot>
    </div>
  </div>
</template>

<script>
import Icon from 'components/widgets/icon.vue';

export default {
  name: 'Pagination',
  data() {
    return {
      index: 0,
      inputNum: 0
    };
  },
  props: {
    pageIndex: {
      type: Number,
      default() {
        return 0;
      }
    },
    pageCount: {
      type: Number,
      require: true,
      default() {
        return 1;
      }
    }
  },
  computed: {
    isFirst() {
      return this.index == 0;
    },
    isLast() {
      return this.index == this.pageCount - 1;
    }
  },
  methods: {
    move(flag) {
      if (flag) {
        if (this.index < this.pageCount - 1) this.index++;
      } else {
        if (this.index > 0) this.index--;
      }
    },
    redirect() {
      //正整数
      if (/^\+?[1-9][0-9]*$/.test(this.inputNum)) {
        let _num = parseInt(this.inputNum);
        if (_num <= this.pageCount) {
          this.index = _num - 1;
        }
      }
    },
    jumpToFirst() {
      this.index = 0;
    },
    jumpToLast() {
      this.index = this.pageCount - 1;
    }
  },
  watch: {
    pageIndex: {
      handler(current) {
        this.index = current;
      }
    },
    index: {
      handler(current) {
        this.inputNum = current + 1;
        this.$emit('flip', current);
      }
    }
  },
  mounted() {
    this.inputNum = this.index + 1;
  },
  components: {
    Icon
  },
  model: {
    prop: 'pageIndex',
    event: 'flip'
  }
};
</script>

<style scoped>
div.pagination {
  height: 25px;
  line-height: 25px;
  display: flex;
  font-size: 14px;
}

div.pagination select {
  min-width: 50px;
  height: 100%;
  outline: none;
  border: none;
  text-align: center;
  margin-right: 15px;
}

div.btn {
  width: 25px;
  line-height: 25px;
  text-align: center;
  cursor: pointer;
}

div.btn > i.iconfont {
  font-size: 22px;
}

div.disabled {
  color: #adadad;
  cursor: not-allowed;
}

div.dialog {
  min-width: 120px;
  line-height: 25px;
  text-align: center;
  border-left: 1px solid #e1e1e1;
  border-right: 1px solid #e1e1e1;
}

div.dialog input {
  outline: none;
  width: 40px;
  border: 1px solid #bebebe;
  text-align: center;
}
</style>
