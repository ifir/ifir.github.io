'use strict';
(function(w, d){
    w.addEventListener('load', init, false);
    //初始化
    function init(){
        //常量
        var WINDOW_WIDTH = w.innerWidth;
        var WINDOW_HEIGHT = w.innerHeight;
    }
    //移动端不支持自动播放
    function bgmAutoplay(){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
            //微信
            document.addEventListener("WeixinJSBridgeReady", function () {
               utils.$('#bgm')[0].play();
            }, false);
        }else{
            //通用
            var timer = null;
            clearTimeout(timer);
            timer = setTimeout(function(){
                
                clearTimeout(timer);
            },2000);
        }
    bgmAutoplay();
    }
})(window, document);