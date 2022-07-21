<template>
  <div class="calender">
    <select @change="change" v-model="year">
      <option value="">年</option>
      <option v-for="item in listOfYear" :key="item" :value="item">{{ item }}</option>
    </select>
    <select @change="change" v-model="month">
      <option value="">月</option>
      <option v-for="item in listOfMonth" :key="item" :value="item">{{ item }}</option>
    </select>
    <select @change="change" v-model="day">
      <option value="">日</option>
      <option v-for="item in listOfDay" :key="item" :value="item">{{ item }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'Calender',
  data() {
    return {
      year: '',
      month: '',
      day: ''
    };
  },
  props: {
    value: {
      type: Date | Object
    }
  },
  computed: {
    listOfYear() {
      let list = [];
      const year = new Date().getFullYear();
      //以今年为准，前90年
      for (let i = year ; i > year - 91; i--) {
        list.push(i);
      }
      return list;
    },
    listOfMonth() {
      let list = [];
      for (let i = 1; i < 13; i++) {
        list.push(i);
      }
      return list;
    },
    listOfDay() {
      let list = [];

      if (this.isNumber(this.month)) {
        let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        //是否为闰年 2月
        let days = monthDays[this.month - 1];
        if (this.month - 1 == 1 && this.IsPinYear(this.year)) {
          days++;
        }
        for (let i = 1; i < days + 1; i++) {
          list.push(i);
        }
      }

      return list;
    }
  },
  methods: {
    //判断是否闰平年
    IsPinYear(year) {
      return 0 == year % 4 && (year % 100 != 0 || year % 400 == 0);
    },
    isNumber(str) {
      return new RegExp(/^[0-9]+$/).test(str);
    },
    change() {
      if (this.isNumber(this.year) && this.isNumber(this.month) && this.isNumber(this.day)) {
        let str = this.year + ',' + this.month + ',' + this.day;
        this.$emit('change', new Date(str));
      }
    },
    clear() {
      this.year = this.month = this.day = '';
    },
    check() {
      return this.isNumber(this.year) && this.isNumber(this.month) && this.isNumber(this.day);
    }
  },
  watch: {
    value: {
      handler(cur) {
        if (cur) {
          this.year = cur.getFullYear();
          this.month = cur.getMonth() + 1;
          this.day = cur.getDate();
        }
      }
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  }
};
</script>

<style scoped>
select {
  width: 100px;
  margin: 0px 2px;
  outline: none;
  text-align: center;
}
</style>
