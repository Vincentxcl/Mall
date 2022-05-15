
//防抖函数
//func是一个函数，不是执行结果，提前对频繁触发的函数进行防抖化，
export function debounce(func, delay = 300) {
	let handler = null;
	return function (...args) {
		if (handler) {
			clearTimeout(handler);
		}
		handler = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
}
