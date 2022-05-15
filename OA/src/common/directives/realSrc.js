// realSrc指令
//<img src="xxx" v-realSrc="yyy"/>
// 判断img的realSrc='yyy'地址是否能成功加载，否则使用xxx地址
const realSrc = {
  bind(element, binding) {
    //图片地址
    let imgURL = binding.value;
    if (imgURL) {
      //如果该图片存在就当前元素的src
      imageIsExist(imgURL).then((val) => {
        if (val) {
          element.setAttribute('src', imgURL);
        }
      });
    }
  }
};

function imageIsExist(url) {
  return new Promise((resolve) => {
    let img = new Image();
    img.src = url;
    img.onload = () => {
      resolve(true);
      img = null;
    };
    img.onerror = () => {
      resolve(false);
      img = null;
    };
  });
}

export { realSrc };
