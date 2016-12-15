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

// utils.animate = function(){
//     var lastTime = 0;
//     var vendors = ['webkit', 'moz', 'ms', 'o'];
//     for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
//         return window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
//         window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
//     }
//     if(!window.requestAnimationFrame){
//         return window.requestAnimationFrame = function(callback, element) {
//             var currTime = new Date().getTime();
//             var timeToCall = Math.max(0, 16 - (currTime - lastTime));
//             var id = window.setTimeout(function() {
//             	callback(currTime + timeToCall);
//             },timeToCall);
//             lastTime = currTime + timeToCall;
//             return id;
//         };
//     }

//     if(!window.cancelAnimationFrame){
//         window.cancelAnimationFrame = function(id) {
//             clearTimeout(id);
//         };
//     }
// }