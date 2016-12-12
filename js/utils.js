'use strict';
var utils = {};
//获取dom
utils.$ = function(selector){
	return document.querySelectorAll(selector);
}
utils.addClass = function(ele, cls){
	var className = ele.className;
	ele.className = className + ' ' + cls;
}
utils.removeClass = function(ele, cls){
	if(ele.className === '') return;
	var clsArr = ele.className.split(' ');
	var clsObj = {};
	for(var i = 0, len = clsArr.length; i < len; i++){
		clsObj[clsArr[i]] = i;
	}
	clsArr.splice(clsObj[cls],1);
	ele.className = clsArr.join(' ');
}