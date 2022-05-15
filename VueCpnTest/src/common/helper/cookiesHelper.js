//返回当前日期第n天之后的日期
//n 天数
function ExpiresDays(n) {
	let _d = new Date();
	_d.setDate(_d.getDate() + n);
	return _d
}


// 设置Cookie
//key cookie键
//value cookie值
//t 过期天数
function setCookie(key, value, t = 3) {
	//encodeURIComponent() 函数可把字符串作为 URI 组件进行编码。 
	document.cookie = key + "=" + encodeURIComponent(value) + ";expires=" + ExpiresDays(t) + ";path=/";
}


// 读取cookies值
//key cookie键
function getCookie(key) {
	let strCookie = document.cookie;
	//使用正则表达式分割字符串，使用;或者=进行分割
	let cookieStringArr = strCookie.split(/[;=]/);
	//获取key对应的cookies值
	var value='';
	for (var i = 0; i < cookieStringArr.length; i++) {
		if (cookieStringArr[i].trim() == key) {
			//decodeURIComponent() 函数可对 encodeURIComponent() 函数编码的 URI 进行解码。
			value = decodeURIComponent(cookieStringArr[i + 1].trim());
			break;
		}
	}
	return value;
}


// 删除一个Cookie
//key cookie键
function deleteCookie(key) {
	setCookie(key, "", -1);
}


// 删除所有Cookies
function deleteAllCookies() {
	//分割cookie字符串
	let cookieStringArr = document.cookie.split(/[;]/);
	cookieStringArr.forEach(val => {
		let keyValuePair = val.split('=');
		deleteCookie(keyValuePair[0].trim());
	});
}

export {
	setCookie,
	getCookie,
	deleteCookie,
	deleteAllCookies,
};
