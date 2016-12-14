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
	},1);
	//第一页
	utils.$('.next-pagetwo')[0].addEventListener('click', nextPage,false);
	utils.$('.next-pagethree')[0].addEventListener('click', nextPage,false);
	function nextPage(){
		if(page === pageNum) return;
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
	//第二页
	//
	//
	//
	//
	//触摸滑动
	var startX = 0, startY = 0,
		offsetX = 0, offsetY = 0,
		isTouch = false, isMove = false,
		startTime = 0, endTime = 0;
	utils.$('.container')[0].addEventListener('touchstart', touchstart, false);
	utils.$('.container')[0].addEventListener('touchmove', touchmove, false);
	utils.$('.container')[0].addEventListener('touchend', touchend, false);


	function touchstart(e){
		startTime = Date.now();
		isTouch = true;
		//startX = e.touches[0].pageX;
		startY = e.touches[0].pageY;
		console.log('touchstart')
	}
	function touchmove(e){
		if(!isTouch) return;
		//offsetX = e.touches[0].pageX - startX;
		offsetY = e.touches[0].pageY - startY;
		//判断是否为真的移动了
		console.log(offsetY)
		isMove = Math.abs(offsetY) > 11 ? true : false;
	}
	function touchend(e){
		if(!isMove) return;
		endTime = Date.now();
		var touchTime = endTime - startTime;
		//判断是否为上下滑动
		//向上滑动
		if(Math.abs(offsetY) > 10 && offsetY < 0){
			nextPage();
			console.log('向上滑动')
		}
		//向下滑动
		if(Math.abs(offsetY) > 10 && offsetY > 0){
			prevPage();
			console.log('向下滑动')
		}
	}


}