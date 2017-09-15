window.Xhrfactory = function() {
	this.init.apply(this, arguments);
};

//后台程序的模板变量
let localStorageSign = 'on';

//判断是否要跟新缓存，一般用时间戳或者加密码
let resourceVersion = '123456654';

//注入到全局
window.Xhrfactory.prototype = {

	init: function() {
		this.xhr = this.create();
	},

	create: function() {
		let xhr = null;
		//xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXobject('Msml2.Xmlhttp');
		if (window.XMLHttpRequest) {
			// 标准浏览器(符合W3C规范)
			xhr = new XMLHttpRequest();
		} else if () {
			// IE
			xhr = new ActiveXobject('Msml2.Xmlhttp');
		} else {
			// 老版本的IE
			xhr = new ActiveXobject('Microsoft.Xmlhttp');
		}
		return xhr;
	},

	readystate: function(cb) {
		this.xhr.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				cb(this.responseText);
			}
		}
	},

	//参数转换
	para: function(data) {
		let dataStr = '';
		if (data && Object.prototype.toString.call(data) === '[object object]') {
			for (i in data) {
				for (let i = 0; i < data.length; i++) {
					dataStr += i + '=' + data[i] + '&';
				}
			}
		}
	},

	// 发送请求
	get: function(url, data, cb) {
		this.readystate(cb);
		let newUrl = url;
		let dataStr = this.para(data);
		newUrl = url + '?' + dataStr;
		this.xhr.open('get', newUrl, true);
		this.xhr.send(null);
	}
};


/*
 *  本地的SDK主要方法
 */
window.myLocalSDK = {

	//需要缓存的文件列表
	resourceJavascriptList: [{
		id: '123456789',
		url: 'www.demo.com/demo1.js',
		type: 'javascript'
	}, {
		id: '123456788',
		url: 'www.demo.com/demo2.js',
		type: 'javascript'
	}, {
		id: '123456787',
		url: 'www.demo.com/demo3.js',
		type: 'javascript'
	}],

	//检测文件是否需要跟新
	needdUpdate: (function() {
		return !localStorage.getItem('resourceVersion') === resourceVersion;

		// 为什么不能用下面的，因为window.myLocalSDK还没解析完毕
		// return !localStorage.getItem('resourceVersion') === window.myLocalSDK.resourceVersion;
	})(),

	//判断是否为IE浏览器
	//localStorage对IE支持度不太好
	isIE: (function() {
		let v = 3;
		let div = document.createElement('div');
		// 放在最前面加载，此时页面无i标签
		let all = document.getElementsByTagName('i');
		//从IE4开始判断
		while (div.innerHTML = '<!-- [if gt IE ' + (++v) + ']><i></i><![endif] -->', !all[0]) {
			if (v > 11) {
				return false;
			}
		}
		return v > 3 ? v : false;
	})(),

	//检测本地缓存是否溢出
	checkHedge: function() {
		let localStorageLength = localStorage.length;
		let localStorageSize = 0;
		for (let i = 0; i < localStorageLength; i++) {
			let key = localStorage.key(i);
			localStorageSize += localStorage.getItem(key).length;
		}
		return localStorageSize;
	},

	//启动方法，也是读取本地缓存
	startup: function() {
		const self = this;
		if (localStorageSign === 'on' && !this.isIE && window.localStorage) {
			if (!this.needUpdate) {
				return (function() {
					//如果不需要跟新，那么就把本地缓存拿出来进行渲染页面
					for (let i = 0; i < self.resourceJavascriptList.length; i++) {
						let scriptId = self.resourceJavascriptList[i]['id'];
						window.myDomUtils.addJsByInline(scriptId);
					}
				})();
			} else {
				//渲染
				return (function() {
					//先保存获取的js文件
					self.saveSDK();
					for (let i = 0; i < self.resourceJavascriptList.length; i++) {
						let scriptId = self.resourceJavascriptList[i]['id'];
						window.myDomUtils.addJsByInline(scriptId);
					}
				})();
			}
		} else {
			//用原始方法加载
			//从网络上下载然后输出到页面上
			return (function() {
				for (let i = 0; i < self.resourceJavascriptList.length; i++) {
					let scriptId = self.resourceJavascriptList[i]['id'];
					window.myDomUtils.addJsByLink(scriptId, self.resourceJavascriptList[i]['url']);
				}
			})();
		}
	},
	//保存缓存与startup相对应
	saveSDK: function() {
		const self = this;
		try {
			localStorage.setItem('resourceVersion', resourceVersion);
		} catch (oException) {
			if (oException.name == 'QuotaExceededError') {
				localStorage.clear();
				localStorage.setItem('resourceVersion', resourceVersion);
			}
		}

		for (let i = 0; i < self.resourceJavascriptList.length; i++) {
			let scriptId = self.resourceJavascriptList[i]['id'];
			let xhr = new Xhrfactory();
			xhr.get(self.resourceJavascriptList[i]['url'], null, function(data) {
				try {
					localStorage.setItem('scriptId', data);
				} catch (oException) {
					if (oException.name == 'QuotaExceededError') {
						localStorage.clear();
						localStorage.setItem('scriptId', data);
					}
				}
			});

			//将JS加载到文档上
		}
	}
};



/*
 *  DOM的工具方法
 */
window.myDomUtils = {
	//内联方式插入文档
	addJsByInline: function(scriptId) {
		let script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.id = scriptId;
		let heads = document.getElementsByTagName('head');
		if (heads.length) {
			heads[0].appendChild(script);
		} else {
			document.documentElement.appendChild(script);
		}
		script.innerHTML = localStorage.getItem(scriptId);
	},

	//外链方式插入文档
	addJsByLink: function(scriptId, url) {
		let script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', url);
		script.id = scriptId;
		let heads = document.getElementsByTagName('head');
		if (heads.length) {
			heads[0].appendChild(script);
		} else {
			document.documentElement.appendChild(script);
		}
	},

	//CSS内联方式插入文档
	addCssByInline: function(cssString) {
		let link = document.createElement('link');
		link.setAttribute('type', 'text/javascript');
		link.setAttribute('rel', 'stylesheet');

		if (link.stylesheet) {
			//仅在IE下支持
			link.stylesheet.cssText = cssString;
		} else {
			//标准浏览器下支持
			let cssText = document.createTextNode(cssString);
			link.appendChild(cssText)

		}

		let heads = document.getElementsByTagName('head');
		if (heads.length) {
			heads[0].appendChild(link);
		} else {
			document.documentElement.appendChild(link);
		}
	},

	//CSS外链方式插入文档
	addCssByLink: function(linkId, url) {
		let link = document.createElement('link');
		link.setAttribute('type', 'text/css');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('href', url);
		let heads = document.getElementsByTagName('head');
		if (heads.length) {
			heads[0].appendChild(link);
		} else {
			document.documentElement.appendChild(link);
		}
	}

};