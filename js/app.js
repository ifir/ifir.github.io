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
	},1);
	//每一页下的小箭头绑定事件
	for(var j = 0; j < pageNum; j++){
		utils.$('.next')[j].addEventListener('click', nextPage, false);
	}
	//雷达图
	var $radarBox = utils.$('.radar-box')[0];
	var radarData = [
		['HTML5', 0.8],
		['CSS3', 0.9],
		['JS', 0.8],
		['Jquery/Zepto', 0.85],
		['PS', 0.7],
		['Gulp/Webpack', 0.75],
		['React/Vue', 0.7]
	];
	//绘制雷达图背景
	var cvsbg = document.createElement('canvas');
	var ctxbg = cvsbg.getContext('2d');
	cvsbg.width = 400;
	cvsbg.height = 400;
	$radarBox.appendChild(cvsbg);

	//计算多边形顶点坐标
	// X坐标 = 圆心的x坐标 + Math.sin(弧度) * 半径;
	// Y坐标 = 圆心的y坐标 + Math.cos(弧度) * 半径;
	// 弧度 = (2*Math.PI/360) * (365/多边形的定点数) * 多边形第几个顶点;
	for(var s = 5; s > 0; s--){
		ctxbg.beginPath();
		for(var k = 0, len = radarData.length; k < len; k++){
			var rad = (2*Math.PI/360) * (365/len) * k;
			var x = 200 + Math.sin(rad) * 200 * (s/5);
			var y = 200 + Math.cos(rad) * 200 * (s/5);
			ctxbg.lineTo(x,y);
		}
		ctxbg.closePath();
		if(s%2){
			ctxbg.fillStyle = '#d3c9c4';
		}else{
			ctxbg.fillStyle = '#d9d6d5';
		}
		ctxbg.fill();
	}
	ctxbg.beginPath();
	//绘制伞骨
	for(var n = 0, len = radarData.length; n < len; n++){
		var rad = (2*Math.PI/360) * (365/len) * n;
		var x = 200 + Math.sin(rad) * 200;
		var y = 200 + Math.cos(rad) * 200;
		ctxbg.moveTo(200, 200);
		ctxbg.lineTo(x, y)
		// ctxbg.arc(x, y, 5, 0, Math.PI*2);
	}
	ctxbg.strokeStyle = '#e5dedb';
	ctxbg.stroke();

	//绘制雷达图数据图
	var cvsdata = document.createElement('canvas');
	var ctxdata = cvsbg.getContext('2d');
	cvsdata.width = 400;
	cvsdata.height = 400;
	$radarBox.appendChild(cvsdata);
	function renderRadar(per){
		//绘制折线
		ctxdata.beginPath();
		for(var n = 0, len = radarData.length; n < len; n++){
			var rate = radarData[n][1];
			var rad = (2*Math.PI/360) * (365/len) * n;
			var x = 200 + Math.sin(rad) * 200 * rate;
			var y = 200 + Math.cos(rad) * 200 * rate;
			ctxdata.lineTo(x, y)
		}
		ctxdata.closePath();
		ctxdata.fillStyle = 'rgba(241, 212, 199, 0.35)';
		ctxdata.fill();
		ctxdata.lineWidth = 4;
		ctxdata.strokeStyle = "#a19088";
		ctxdata.stroke();


		//绘制小圆点
		for(var j = 0, len = radarData.length; j < len; j++){
			var rate = radarData[j][1];
			var rad = (2*Math.PI/360) * (365/len) * j;
			var x = 200 + Math.sin(rad) * 200 * rate;
			var y = 200 + Math.cos(rad) * 200 * rate;
			ctxdata.beginPath();
			ctxdata.arc(x, y, 5, 0, Math.PI*2);
			ctxdata.closePath();
			ctxdata.fillStyle = '#919191';
			ctxdata.fill();
		}
	}
	renderRadar(1);
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
		var timer = null;
		isTouch = false;
		isMove = false;
		startY = 0;
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