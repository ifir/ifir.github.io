'use strict';
var utils = {};
//获取dom
utils.$ = function(selector){
	return document.querySelectorAll(selector);
}
utils.addClass = function(ele, cls){
	if (ele.classList){
		ele.classList.add(cls);
	}
	else{
		ele.className += ' ' + cls;
	}
}
utils.removeClass = function(ele, cls){
	if (ele.classList){
		ele.classList.remove(cls);
	}else{
  		ele.className = ele.className.replace(new RegExp('(^|\\b)' + cls.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}
}
utils.hasClass = function(ele, cls){
	if (ele.classList){
		return ele.classList.contains(cls);
	}
	else{
		return new RegExp('(^| )' + cls + '( |$)', 'gi').test(ele.className);
	}
}