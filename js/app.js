window.addEventListener('load', load, false);

function load() {
	//loading
	var timer = null;
	var $loading = utils.$('.loading')[0];
	var $pageone = utils.$('.section-pageone')[0];
	var height = window.innerHeight;
	var page = 0;
	var isWheel = false, isComplete = false, wheelTimer = null;
	utils.addClass($loading, 'loaded');
	clearTimeout(timer);
	timer = setTimeout(function(){
		//移除loading节点
		$loading.remove();
		utils.addClass($pageone, 'pageone-ani');
		clearTimeout(timer);
		//鼠标滑轮绑定事件
		window.addEventListener('mousewheel', function(e){
			if(e.deltaY > 0 && page < 1){
				nextPage();
				console.log('向下')
			}
			if(e.deltaY < 0 && page > 0){
				prevPage();
				console.log('向上')
			}
		})
	},4001);
	//第一页
	utils.$('.next-pagetwo')[0].addEventListener('click', nextPage,false);
	function nextPage(){
		page++;
		utils.$('.container')[0].style.transform = "translateY(" + -height*page + "px)";
		utils.$('.container')[0].style.webkitTransform = "translateY(" + -height*page + "px)";
	}
	function prevPage(){
		page--;
		utils.$('.container')[0].style.transform = "translateY(" + height*page + "px)";
		utils.$('.container')[0].style.webkitTransform = "translateY(" + height*page + "px)";
	}
	var isScroll = false;
	// window.addEventListener('scroll', function(){
	// 	var sTop = document.body.scrollTop || document.documentElement.scrollTop;
	// 	if(sTop > 0){
	// 		isScroll = true;

	// 	}
	// }, false)
	

}