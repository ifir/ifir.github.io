'use strict';
!function(w, d){
    w.addEventListener('load', load, false);
    function load(){
    	var W_HEIGHT = w.innerHeight;
    	var W_WIDTH = w.innerWidth;
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
            banner: 'banner.jpg'
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
                            //setInterval(Scene1, 150);
                        }
                    }, false);
                })(key);
            }
        })();
        //startScene();
        function startScene(){
            //绘制背景
            var shake = true, shakeY = 100, startTime = Date.now(), nowTime = 0;
            function ani(){
                nowTime = Date.now();
                rAF(ani);
                if(nowTime - startTime > (1000 / 7)){
                    startTime = nowTime - ((nowTime - startTime) % (1000 / 7));
                    clean();
                    ctx.drawImage(imgObj.bg, 0, 0, W_WIDTH, W_HEIGHT);
                    shakeY = shake ? 100 : 110;
                    //绘制标题
                    ctx.drawImage(imgObj.title, 70, shakeY, imgObj.title.width, imgObj.title.height);
                    //绘制小鸟
                    ctx.drawImage(shake ? imgObj.bird0 : imgObj.bird1, imgObj.title.width + 80, shakeY + 4, imgObj.bird0.width, imgObj.bird0.height);
                    //绘制草坪
                    //绘制开始按钮
                    ctx.drawImage(imgObj.start, (W_WIDTH / 2 - imgObj.start.width / 2), (W_HEIGHT / 2 - imgObj.start.height / 2), imgObj.start.width, imgObj.start.height);
                    shake = !shake;
                }
            }
            return  ani;
        }
        
        function playScene(){}
        function endScene(){}
        function clean() {
            ctx.clearRect(0, 0, W_WIDTH, W_HEIGHT);
        }
        function rAF(fn){
            if(w.requestAnimationFrame){
                w.requestAnimationFrame(fn);
            }else{
                w.setTimeout(fn, 1000 / 60);
            }
        }
    }
}(window, document);
