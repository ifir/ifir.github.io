'use strict';
(function(w, d){
    w.addEventListener('load', init, false);
    //初始化
    function init(){
        //常量
        var WINDOW_WIDTH = w.innerWidth;
        var WINDOW_HEIGHT = w.innerHeight;

        var timer = null;
        //移动端不支持自动播放
        d.documentElement.addEventListener('touchstart', bgmAutoPlay, false);
        //水果切换
        utils.addClass(utils.$('.bubble-fantasy')[0], 'bubble-fantasy-scale');
        timer = w.setTimeout(function(){
            var timer2 = null;
            timer2 = w.setInterval(randomFood, 300);
            clearTimeout(timer);
        }, 2000);
    }
    //bgm 播放
    function bgmAutoPlay(){
        utils.$('#bgm')[0].play();
        d.documentElement.removeEventListener('touchstart', bgmAutoPlay);
    }
    //loading动画中水果随机切换
    function randomFood(){
        var food = utils.$('.icon-food')[0];
        var cls = food.className.split(' ')[1];
        //防止随机出现两次一样的index
        var index = Math.floor(Math.random() * 20);
        if(cls){
            utils.removeClass(food, cls);
            var lastIndex = parseInt(cls.split('-')[2], 10);
            if(lastIndex === index){
                if(lastIndex === 22){
                    index--;
                }else{
                    index++;
                }
            }
        }
        utils.addClass(food, 'icon-food-' + index);
    }
})(window, document);