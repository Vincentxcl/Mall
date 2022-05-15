//配置webpack
const path = require("path");//引入path模块
function resolve(dir) {
  return path.join(__dirname, dir);//path.join(__dirname, dir)设置绝对路径
}

module.exports = {
  lintOnSave: true,//语法检查
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
      .set("config", resolve("./src/config"))
      .set("netWork", resolve("./src/netWork"))
      .set("pages", resolve("./src/pages"))
      .set("router", resolve("./src/router"))
      .set("store", resolve("./src/store"))
  },
  devServer: {
    open: false,  // 自动打开浏览器
    hot: true, // 实时打包编译
    host: 'localhost',
    inline: true,  // 表示实时刷新浏览器
    port: '8004'   // 指定打开浏览器的端口号
  }
};
