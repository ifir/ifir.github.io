'use strict';
!function(w, d){
    w.addEventListener('load', load, false);
    function load(){
    	var W_HEIGHT = w.innerHeight;
    	var W_WIDTH = w.innerWidth;
        var rAFId = null;//requestAnimationFrame id
    	var cvs = d.getElementById('cvs');
    	var ctx = cvs.getContext('2d');
    	cvs.width = W_WIDTH;
    	cvs.height = W_HEIGHT;
    	//图片对象存储
    	var imgData = {
    	    bg : 'bg.jpg',
    	    title: 'title.png',
    	    bird0: 'bird0.png',
    	    bird1: 'bird1.png',
            start: 'start.jpg',
            grass: 'grass.jpg'
    	}, imgObj = {};
    	(function(){
            var imgNum = 0;
    	    for(var key in imgData){
    	        var img = new Image();
                img.src = './img/' + imgData[key];
                (function(key){
                    img.addEventListener('load', function(){
                        imgNum++;
                        imgObj[key] = this;
                        if(imgNum === 5){
                            var Scene1 = startScene();
                            Scene1();
                            /*w.setTimeout(function(){
                                w.cAF(rAFId);
                            }, 5000);*/
                        }
                    }, false);
                })(key);
            }
        })();
        //startScene();
        function startScene(){
            //绘制背景
            var shake = true, shakeY = 100, startTime = Date.now(), nowTime = 0, grassSpeed = 0;
            function draw(){
                nowTime = Date.now();
                rAFId = w.rAF(draw);
                if(nowTime - startTime > (1000 / 7)){
                    startTime = Math.floor(nowTime - ((nowTime - startTime) % (1000 / 7)));
                    clean();
                    shakeY = shake ? 100 : 110;
                    //绘制背景
                    ctx.drawImage(imgObj.bg, 0, 0, W_WIDTH, W_HEIGHT);
                    //绘制开始按钮
                    ctx.drawImage(imgObj.start, (W_WIDTH / 2 - imgObj.start.width / 2), (W_HEIGHT / 2 - imgObj.start.height / 2), imgObj.start.width, imgObj.start.height);
                    //绘制标题
                    ctx.drawImage(imgObj.title, (W_WIDTH / 2 - 210 / 2), shakeY, imgObj.title.width, imgObj.title.height);
                    //绘制小鸟
                    ctx.drawImage(shake ? imgObj.bird0 : imgObj.bird1, (W_WIDTH / 2 - 210 / 2 ) + imgObj.title.width + 10, shakeY + 4, imgObj.bird0.width, imgObj.bird0.height);
                    //绘制草坪
                    ctx.drawImage(imgObj.grass, 10 * grassSpeed, 1176 * W_HEIGHT / 1334, W_WIDTH, W_WIDTH * imgObj.grass.height / imgObj.grass.width);
                    ctx.drawImage(imgObj.grass, W_WIDTH + 10 * grassSpeed, 1176 * W_HEIGHT / 1334, W_WIDTH, W_WIDTH * imgObj.grass.height / imgObj.grass.width);
                    if(W_WIDTH + 10 * grassSpeed >= 10){
                        grassSpeed--;
                    }else{
                        grassSpeed = 0;
                    }
                    shake = !shake;
                }
            }
            return draw;
        }

        function playScene(){}
        function endScene(){}
        function clean() {
            ctx.clearRect(0, 0, W_WIDTH, W_HEIGHT);
        }
        //requestAnimationFrame
        w.rAF = (function() {
            return  w.requestAnimationFrame   ||
                w.webkitRequestAnimationFrame ||
                w.mozRequestAnimationFrame    ||
                w.oRequestAnimationFrame      ||
                w.msRequestAnimationFrame     ||
                function(cb){
                    return w.setTimeout(cb, 1000 / 60);
                }
        })();
        //cancelAnimationFrame
        w.cAF = (function(){
            return w.cancelAnimationFrame          ||
                w.webkitCancelRequestAnimationFrame||
                w.mozCancelRequestAnimationFrame   ||
                w.oCancelRequestAnimationFrame     ||
                w.msCancelRequestAnimationFrame    ||
                clearTimeout
        })();
    }
}(window, document);
