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
                        startScene();
                    }
                }, false);
            })(key);
        }
    })();
    //startScene();
    function startScene(){
        console.log(1)
        ctx.drawImage(imgObj.bg, 0, 0, W_WIDTH, W_HEIGHT);
    }
    function playScene(){}
    function endScene(){}
    function rAF(fn){
        if(w.requestAnimationFrame){
            w.requestAnimationFrame(fn);
        }else{
            w.setTimeout(fn, 1000 / 60);
        }
    }
    }
}(window, document);
