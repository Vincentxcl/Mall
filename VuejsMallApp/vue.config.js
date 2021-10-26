
const path = require("path");//引入path模块
function resolve(dir) {
  return path.join(__dirname, dir);//path.join(__dirname, dir)设置绝对路径
}

module.exports = {
  lintOnSave: true,
  pages: {
    index: {
      entry: "src/main.js"
    }
  },

  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("./src"))
      .set("assets", resolve("./src/assets"))
      .set("common", resolve("./src/common"))
      .set("components", resolve("./src/components"))
      .set("netWork", resolve("./src/netWork"))
      .set("pages", resolve("./src/pages"))
  },
};
