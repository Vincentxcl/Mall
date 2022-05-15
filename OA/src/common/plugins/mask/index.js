import MaskDiv from './maskDiv.vue';

export default {
	install(vue) {
		const ctor = vue.extend(MaskDiv);
		const mask = new ctor().$mount(document.createElement("div"));
		document.body.appendChild(mask.$el);
		vue.prototype.$mask = mask;
	}
};
