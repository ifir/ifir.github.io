'use strict';
window.addEventListener('load', load, false);

function load() {
	//loading
	var timer = null;
	var $loading = utils.$('.loading')[0];
	var $pageone = utils.$('.section-pageone')[0];
	var $radarBox = utils.$('.radar-box')[0];
	var height = window.innerHeight;
	var page = 0, translate = 0;
	var pageNum = utils.$('.page').length - 1;
	//触摸所需变量
	var startX = 0, startY = 0,
		offsetX = 0, offsetY = 0,
		isTouch = false, isMove = false,
		startTime = 0, endTime = 0;
	//雷达图数据
	var radarData = [
		['Gulp/Webpack', 0.75],
		['React/Vue', 0.7],
		['HTML5', 0.8],
		['CSS3', 0.9],
		['JS', 0.85],
		['PS/AI', 0.7],
		['Jquery/Zepto', 0.85]
	];
	//雷达图所需变量
	var center = [200, 200], r = 200, cvsW = 400, cvsH = 400, dataLen = radarData.length;
	clearTimeout(timer);//清除loading的定时器
	timer = setTimeout(function(){
		//移除loading节点
		$loading.remove();
		utils.addClass($pageone, 'active');
		//鼠标滑轮绑定事件
		window.addEventListener('mousewheel', function(e){
			if(e.deltaY > 0 && page < pageNum){
				nextPage(radarAntimate);
			}
			if(e.deltaY < 0 && page > 0){
				prevPage(radarAntimate);
			}
		});
		var $body = utils.$('body')[0];
		//触摸事件绑定
		$body.addEventListener('touchstart', touchstart, false);
		$body.addEventListener('touchmove', touchmove, false);
		$body.addEventListener('touchend', touchend, false);
		clearTimeout(timer);//清除loading的定时器
	},3000);
	//每一页下的小箭头绑定事件
	for(var j = 0; j < pageNum; j++){
		utils.$('.next')[j].addEventListener('click', nextPage, false);
	}
	//最后一页向上的小箭头
	utils.$('.prev')[0].addEventListener('click', prevPage, false);
	//绘制雷达图背景
	renderRadarBg();
	//绘制雷达图数据图
	var cvsdata = document.createElement('canvas');
	var ctxdata = cvsdata.getContext('2d');
	cvsdata.width = cvsW;
	cvsdata.height = cvsH;
	$radarBox.appendChild(cvsdata);
	//绘制雷达图背景函数
	function renderRadarBg(){
		var cvsbg = document.createElement('canvas');
		var ctxbg = cvsbg.getContext('2d');
		cvsbg.width = cvsW;
		cvsbg.height = cvsH;
		$radarBox.appendChild(cvsbg);
		for(var s = 5; s > 0; s--){
			ctxbg.beginPath();
			for(var k = 0; k < dataLen; k++){
				var rate = s/5;
				//计算多边形顶顶点{x,y}坐标
				var point = calcPolygon(dataLen, k, center[0], center[1], r, rate);
				ctxbg.lineTo(point.x,point.y);
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
		for(var n = 0; n < dataLen; n++){
			var point = calcPolygon(dataLen, n, center[0], center[1], r, 1);
			ctxbg.moveTo(center[0], center[1]);
			ctxbg.lineTo(point.x, point.y);
			//绘制文字
			var span = document.createElement('span');
			span.innerHTML = radarData[n][0];
			//判断文字左右
			point.x > cvsW/2 ? (span.style.left = point.x/2 + 'px') : (span.style.right = (cvsW - point.x)/2 + 'px');
			//判断文字上下
			point.y > cvsH/2 ? (span.style.top = point.y/2 + 'px') : (span.style.bottom = ((cvsH - point.y)/2) + 'px');
			if(point.x === cvsW/2 ){span.style.left = (point.x/2 - 50) + 'px';}
			$radarBox.appendChild(span);
		}
		ctxbg.strokeStyle = '#e5dedb';
		ctxbg.stroke();
	}
	//绘制雷达折线图
	function renderRadar(per){
		ctxdata.clearRect(0,0,cvsW,cvsH);
		//绘制折线
		ctxdata.beginPath();
		for(var n = 0; n < dataLen; n++){
			var rate = radarData[n][1] * per;
			var point = calcPolygon(dataLen, n, center[0], center[1], r, rate);
			ctxdata.lineTo(point.x, point.y);
		}
		ctxdata.closePath();
		ctxdata.fillStyle = 'rgba(241, 212, 199, 0.35)';
		ctxdata.fill();
		ctxdata.lineWidth = 4;
		ctxdata.strokeStyle = "#a19088";
		ctxdata.stroke();
		//绘制小圆点
		for(var j = 0; j < dataLen; j++){
			var rate = radarData[j][1] * per;
			var point = calcPolygon(dataLen, j, center[0], center[1], r, rate);
			ctxdata.beginPath();
			ctxdata.arc(point.x, point.y, 5, 0, Math.PI*2);
			ctxdata.closePath();
			ctxdata.fillStyle = '#919191';
			ctxdata.fill();
		}
	}
	/**
	 * [calcPolygon description]计算多边形顶点坐标
	 * @param  {[type]} apexNum 多边形的顶点个数
	 * @param  {[type]} index 	当前第几个顶点
	 * @param  {[type]} centerX 圆心x坐标
	 * @param  {[type]} centerY 圆心y坐标
	 * @param  {[type]} r 		圆的半径
	 * @param  {[type]} rate    比率
	 * @return {[type]}         返回{x,y}
	 */
	function calcPolygon(apexNum, index, centerX, centerY, r, rate){
		//计算多边形顶点坐标
		// X坐标 = 圆心的x坐标 + Math.sin(弧度) * 半径;
		// Y坐标 = 圆心的y坐标 + Math.cos(弧度) * 半径;
		// 弧度 = (2*Math.PI/360) * (365/多边形的定点数) * 多边形第几个顶点;
		var point = {};
		var rad = (2*Math.PI/360) * (365/apexNum) * index;//弧度
		point.x = centerX + Math.sin(rad) * r * rate;
		point.y = centerY + Math.cos(rad) * r * rate;
		return point;
	}
	//下一页切换事件
	function nextPage(callback){
		if(page === pageNum) return;
		page++;
		translate -= height;
		pageTransform(page, translate);
		callback && callback();
	}
	//上一页切换事件
	function prevPage(callback){
		if(page === 0) return;
		page--;
		translate += height;
		pageTransform(page, translate);
		callback && callback();
	}
	//添加page切换的transform动画
	function pageTransform(page, translate){
		var $page = utils.$('.page');
		utils.$('.container')[0].style.transform = "translateY(" + translate + "px)";
		utils.$('.container')[0].style.webkitTransform = "translateY(" + translate + "px)";
		for(var i = 0, len = $page.length; i < len; i++){
			utils.removeClass($page[i], 'active');
		}
		utils.addClass($page[page], 'active');
	}
	//雷达图动画
	function radarAntimate(){
		var timeid = null;
		if(utils.hasClass(utils.$('.section-pagethree')[0], 'active')){
			var speed = 0;
			for(var u = 0; u < 100; u++){
				speed += 0.01;
				(function(speed){
					timeid = setTimeout(function(){
						renderRadar(speed);
					},u*10+500);
				})(speed);
			}
		}else{
			timeid = setTimeout(function(){
				renderRadar(0);
			},500);
		}
		clearTimeout(timeid);
	}
	//触摸事件
	function touchstart(e){
		isTouch = true;
		startY = e.touches[0].pageY;
	}
	function touchmove(e){
		if(!isTouch) return;
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
				nextPage(radarAntimate);
				clearTimeout(timer);
			},10);
		}
		//向下滑动
		if(Math.abs(offsetY) > 10 && offsetY > 0){
			timer = setTimeout(function(){
				prevPage(radarAntimate);
				clearTimeout(timer);
			},10);
		}
	}
}