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
    utils.$('#bgm')[0].play();
})(window, document);