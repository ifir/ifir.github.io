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
        utils.$('#bgm')[0].onloadedmetadata = function(){
            var e = document.createEvent("HTMLEvents");
            e.initEvent("touchstart", true, true);
            utils.$('#bgm')[0].dispatchEvent(e);
        }
        utils.$('#bgm')[0].addEventListener('touchstart', function(){
            utils.$('#bgm')[0].play();
        }, false);

    }
    bgmAutoplay();
})(window, document);