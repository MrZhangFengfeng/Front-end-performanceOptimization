//注入到全局
window.Xhrfactory.prototype = function(){

	init:function(){
		this.xhr = this.create();
	};

	create:function(){
		var xhr = null;
		//xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXobject('Msml2.Xmlhttp');
		if(window.XMLHttpRequest){
			// 标准浏览器(符合W3C规范)
			xhr = new XMLHttpRequest();
		}else if(){
			// IE
			xhr = new ActiveXobject('Msml2.Xmlhttp');
		}else{
			// 老版本的IE
			xhr = new ActiveXobject('Microsoft.Xmlhttp');
		}
	};

	readystate:function(cb){
		this.xhr.onreadystatechange = function(){
			if(this.readystate === 4 && this.status ===200){
				cb(this.responseTest);
			}
		}
	};

	//参数转换
	para:function(data){
		var dataStr = '';
		if(data && Object.prototype.toString.call(data) === '[object object]'){
			for(i in data){
				for(var i=0;i<data.length;i++){
					dataStr += i + '=' + data[i] + '&';
				}
			}
		}
	};

	// 发送请求
	get:function(url,data,cb){
		this.readystate(cb);
		var newUrl = url;
		var dataStr = this.para(data);
		newUrl = url + '?' +dataStr;
		this.xhr.open('get',newUrl,true);
		this.xhr.send(null);
	}
};

window.Xhrfactory = function(){
	this.init.apply(this,arguments);
}


/*
*  本地的SDK主要方法
 */
window.myLocalSDK = {
	//判断是否要跟新缓存，一般用时间戳或者加密码
	resourceVersion:'',

	//需要缓存的文件列表
	resourceJavascriptList :[
		{
			id:'123456789',
			url:'www.baidu.com/winter.js',
			type:'javascript'
		},
		{
			id:'123456788',
			url:'www.baidu.com/summer.js',
			type:'javascript'
		},
		{
			id:'123456787',
			url:'www.baidu.com/chris.js',
			type:'javascript'
		}
	],

	//检测文件是否需要跟新
	needdUpdate : (function(){
		return localStorage.getItem('resourceVersion') === resourceVersion;
	})(),

	//判断是否为IE浏览器
	//localStorage对IE支持度不太好
	isIE : (function(){
		var v = 1;
		var div = document.createElement('div');
		var all = document.getElementsByTagName('i');
		while(div.innerHTML = '<!-- [if gt IE '+(++v)+']><i></i>'){

		}
	})(),

	//检测本地缓存是否溢出
	checkHedge : function(){
		var localStorageLength = localStorage.length;
		var localStorageSize = 0;
		for(var i=0;i<localStorageLength;i++){
			var key = localStorage.key(i);
			localStorageSize += localStorage.getItem(key).length;
		}
		return localStorageSize;
	},

	//启动方法，也是读取本地缓存
	startup : function(){

	},
	//保存缓存与startup相对应
	save : function(){

	}
}