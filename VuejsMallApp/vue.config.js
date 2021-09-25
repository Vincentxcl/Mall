
const path = require("path");
function resolve(dir) {
	return path.join(__dirname, dir);
}

module.exports = {
	pages: {
		index: {
			entry: "src/main.js"
		}
	},
	lintOnSave: true,

	chainWebpack: config => {
		config.resolve.alias
			.set("@", resolve("src"))
			.set("assets", resolve("src/assets"))
			.set("components", resolve("src/components"))
			.set("netWork", resolve("src/netWork"))
			.set("pages", resolve("src/pages"))
			.set("router", resolve("src/router"))
			.set("store", resolve("src/store"))
	},
};
