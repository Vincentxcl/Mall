<template>
  <div class="sysParamsDetail">
    <div class="grid">
      <div>
        <div class="ttl">名称:</div>
        <div>
          {{ title }}
          <span v-if="isEnable" class="enable">启用中</span>
          <span v-if="!isEnable" class="disable">禁用中</span>
        </div>
        <div class="ttl">属性:</div>
        <div>{{ value }}</div>
        <div class="ttl">排序:</div>
        <div>{{ ord }}</div>
        <div class="ttl">创建时间:</div>
        <div>{{ adjustedEstablish }}</div>
        <div class="ttl">说明:</div>
        <div>{{ description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { dateFormat, fillProps } from 'common/helper/convertHelper';
import { requestItem } from 'netWork/appSetting.js';

export default {
  name: 'SysParamsDetail',
  data() {
    return {
      title: '',
      value: '',
      ord: 0,
      establish: '',
      description: '',
      isEnable: false
    };
  },
  computed: {
    adjustedEstablish() {
      return dateFormat(this.establish);
    }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  activated() {
    if (this.$route.meta.fromList) {
      //请求数据
      requestItem(this.id, this)
        .then((res) => {
          let ttls = ['title', 'value', 'description', 'ord', 'establish', 'isEnable'];
          //为组件data填充数据
          fillProps(res.data, this, ttls);
        })
        .catch(() => {});
    }
  },
  beforeRouteEnter(to, from, next) {
    let pages = ['sysParamsList', 'searchSysParamsResult'];
    if (pages.indexOf(from.name) > -1) {
      to.meta.fromList = true; //使用meta中变量标识是否从搜索控件跳转过来
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    from.meta.fromList = false; //重置meta fromSearch设置
    next();
  }
};
</script>

<style>
div.sysParamsDetail {
  width: 100%;
  height: calc(100% - 40px);
  overflow: auto;
}

div.sysParamsDetail div.grid {
  padding: 10px;
  font-size: 14px;
}

div.sysParamsDetail div.grid > div {
  display: grid;
  grid-template-columns: 10% 90%;
  row-gap: 5px;
  padding: 10px;
  border: 1px solid rgb(226, 226, 226);
  border-radius: 5px;
}

div.sysParamsDetail div.grid > div > div {
  height: 30px;
  line-height: 30px;
}

div.sysParamsDetail div.grid span.enable {
  display: inline-block;
  color: white;
  font-size: 12px;
  width: 60px;
  height: 18px;
  line-height: 18px;
  border-radius: 9px;
  background-color: var(--color-success);
  text-align: center;
  margin: 0px 5px;
}

div.sysParamsDetail div.grid span.disable {
  display: inline-block;
  color: white;
  font-size: 12px;
  width: 60px;
  height: 18px;
  line-height: 18px;
  border-radius: 9px;
  background-color: var(--color-danger);
  text-align: center;
  margin: 0px 5px;
}
</style>
