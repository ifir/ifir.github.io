window.addEventListener('load', load, false);

function load() {
	//loading
	var timer = null;
	var $loading = utils.$('.loading')[0];
	var $pageone = utils.$('.section-pageone')[0];
	var height = window.innerHeight;
	var page = 0, translate = 0;
	var pageNum = utils.$('.page').length - 1;
	var isWheel = false, isComplete = false, wheelTimer = null;
	//触摸所需变量
	var startX = 0, startY = 0,
		offsetX = 0, offsetY = 0,
		isTouch = false, isMove = false,
		startTime = 0, endTime = 0;
	utils.addClass($loading, 'loaded');
	clearTimeout(timer);
	timer = setTimeout(function(){
		//移除loading节点
		$loading.remove();
		utils.addClass($pageone, 'active');
		clearTimeout(timer);
		//鼠标滑轮绑定事件
		window.addEventListener('mousewheel', function(e){
			if(e.deltaY > 0 && page < pageNum){
				nextPage();
			}
			if(e.deltaY < 0 && page > 0){
				prevPage();
			}
		});
		//触摸事件绑定
		utils.$('body')[0].addEventListener('touchstart', touchstart, false);
		utils.$('body')[0].addEventListener('touchmove', touchmove, false);
		utils.$('body')[0].addEventListener('touchend', touchend, false);
	},4001);
	//第一页
	utils.$('.next-pagetwo')[0].addEventListener('click', nextPage,false);
	utils.$('.next-pagethree')[0].addEventListener('click', nextPage,false);
	//第二页
	//下一页切换事件
	function nextPage(){
		if(page === pageNum) return;
		page++;
		translate -= height;
		var $page = utils.$('.page');
		utils.$('.container')[0].style.transform = "translateY(" + translate + "px)";
		utils.$('.container')[0].style.webkitTransform = "translateY(" + translate + "px)";
		for(var i = 0, len = $page.length; i < len; i++){
			utils.removeClass($page[i], 'active');
		}
		utils.addClass($page[page], 'active');
	}
	//上一页切换事件
	function prevPage(){
		if(page === 0) return;
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
	//触摸事件
	function touchstart(e){
		startTime = Date.now();
		isTouch = true;
		//startX = e.touches[0].pageX;
		startY = e.touches[0].pageY;
	}
	function touchmove(e){
		if(!isTouch) return;
		//offsetX = e.touches[0].pageX - startX;
		offsetY = e.touches[0].pageY - startY;
		//判断是否为真的移动了
		isMove = Math.abs(offsetY) > 11 ? true : false;
	}
	function touchend(e){
		if(!isMove) return;
		endTime = Date.now();
		var timer = null;
		var touchTime = endTime - startTime;
		isTouch = false;
		//判断是否为上下滑动
		//向上滑动
		clearTimeout(timer);
		if(Math.abs(offsetY) > 10 && offsetY < 0){
			timer = setTimeout(function(){
				nextPage();
				clearTimeout(timer);
			},10);
		}
		//向下滑动
		if(Math.abs(offsetY) > 10 && offsetY > 0){
			timer = setTimeout(function(){
				prevPage();
				clearTimeout(timer);
			},10);
		}
	}


}