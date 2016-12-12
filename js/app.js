window.addEventListener('load', load, false);

function load() {
	//loading
	var timer = null;
	var $loading = utils.$('.loading')[0];
	utils.addClass($loading, 'loaded');
	clearTimeout(timer);
	timer = setTimeout(function(){
		//移除loading节点
		$loading.remove();
	},5000);
	//第一页
	



}