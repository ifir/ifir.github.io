'use strict';
(function(w, d) {
    w.addEventListener('load', init, false);
    //初始化
    function init() {
        //常量
        var WINDOW_WIDTH = w.innerWidth,
            WINDOW_HEIGHT = w.innerHeight;

        var timer = null,
            timer2 = null;
        //移动端不支持自动播放
        //d.documentElement.addEventListener('touchstart', bgmAutoPlay, false);
        //水果切换
        utils.addClass(utils.$('.bubble-fantasy')[0], 'bubble-fantasy-scale');
        timer = w.setTimeout(function() {
            timer2 = w.setInterval(randomFood, 300);
            clearTimeout(timer);
        }, 2000);
        //资源加载完去掉loading
        function sourceLoading() {
            w.setTimeout(function() {
                utils.addClass(utils.$('.loading-wrap')[0], 'loaded');
                /*utils.remove(utils.$('.loading-wrap')[0]);
                clearInterval(timer2);*/
            }, 2000);
        }
        sourceLoading();
        //信封翻转
        utils.$('.envelope-wrap')[0].addEventListener('touchstart', function(){
            var $this = this, cls = 'envelope-wrap-turn';
            if(utils.hasClass($this, cls)){
                utils.removeClass($this, cls);
            }else{
                utils.addClass($this, cls);
            }
        }, false);
    }
    //bgm 播放
    function bgmAutoPlay() {
        utils.$('#bgm')[0].play();
        d.documentElement.removeEventListener('touchstart', bgmAutoPlay);
    }
    //loading动画中水果随机切换
    function randomFood() {
        var food = utils.$('.icon-food')[0];
        var cls = food.className.split(' ')[1];
        var index = Math.floor(Math.random() * 20);
        if (cls) {
            utils.removeClass(food, cls);
            //防止随机出现两次一样的index
            var lastIndex = parseInt(cls.split('-')[2], 10);
            if (lastIndex === index) {
                if (lastIndex === 22) {
                    index--;
                } else {
                    index++;
                }
            }
        }
        utils.addClass(food, 'icon-food-' + index);
    }
})(window, document);