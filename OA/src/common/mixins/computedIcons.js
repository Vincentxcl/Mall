import appsetting from 'config/appsettings.json';

// 动态加载主工具栏元素
const computedIcons = {
  computed: {
    iconDetail() {
      return appsetting.systemIcon.toolIcon.detail;
    },
    iconEdit() {
      return appsetting.systemIcon.toolIcon.edit;
    },
    iconDel() {
      return appsetting.systemIcon.toolIcon.del;
    },
    iconEnable() {
      return appsetting.systemIcon.toolIcon.enable;
    },
    iconDisable() {
      return appsetting.systemIcon.toolIcon.disable;
    }
  }
};

export { computedIcons };
