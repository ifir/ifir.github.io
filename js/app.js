window.addEventListener('load', load, false);

function load() {
	//loading
	var timer = null;
	var $loading = utils.$('.loading')[0];
	var $pageone = utils.$('.section-pageone')[0];
	var height = window.innerHeight;
	var page = 0, translate = 0;
	var isWheel = false, isComplete = false, wheelTimer = null;
	utils.addClass($loading, 'loaded');
	clearTimeout(timer);
	timer = setTimeout(function(){
		//移除loading节点
		$loading.remove();
		utils.addClass($pageone, 'active');
		clearTimeout(timer);
		//鼠标滑轮绑定事件
		window.addEventListener('mousewheel', function(e){
			if(e.deltaY > 0 && page < 2){
				nextPage();
				console.log('向下')
			}
			if(e.deltaY < 0 && page > 0){
				prevPage();
				console.log('向上')
			}
		});
	},4001);
	//第一页
	utils.$('.next-pagetwo')[0].addEventListener('click', nextPage,false);
	function nextPage(){
		page++;
		translate -= height;
		var $page = utils.$('.page');
		console.log(page)
		utils.$('.container')[0].style.transform = "translateY(" + translate + "px)";
		utils.$('.container')[0].style.webkitTransform = "translateY(" + translate + "px)";
		for(var i = 0, len = $page.length; i < len; i++){
			utils.removeClass($page[i], 'active');
		}
		utils.addClass($page[page], 'active');
	}
	function prevPage(){
		page--;
		translate += height;
		var $page = utils.$('.page');
		utils.$('.container')[0].style.transform = "translateY(" + translate + "px)";
		utils.$('.container')[0].style.webkitTransform = "translateY(" + translate + "px)";
		for(var i = 0, len = $page.length; i < len; i++){
			utils.removeClass($page[i], 'active');
		}
		utils.addClass($page[page], 'active');
	}
	//第二页
	// var perList = utils.$('.per-list li');
	// for(var i = 0, len = perList.length; i < len; i++){

	// }
}