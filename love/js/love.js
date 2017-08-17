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
        utils.$('.envelope-front')[0].addEventListener('touchstart', function(){
            var $this = utils.$('.envelope-wrap')[0], cls = 'envelope-wrap-turn';
            utils.addClass($this, cls);
            utils.$('.envelope-backmask')[0].addEventListener('touchstart', function(){
                utils.removeClass($this, cls);
                utils.removeClass(utils.$('.flip')[0], 'flip-turn');
                utils.$('.envelope-open')[0].style.zIndex = '8';
            }, false);
        }, false);
        utils.$('.open-front')[0].addEventListener('touchstart', function(){
            utils.addClass(utils.$('.flip')[0], 'flip-turn');
            utils.addClass(d.getElementById('letter'), 'letter-wrap-animate');
            w.setTimeout(function(){
                utils.$('.envelope-open')[0].style.zIndex = '3';
            }, 400);
        }, false);
        utils.$('.open-back')[0].addEventListener('touchstart', function(){
            utils.$('.envelope-open')[0].style.zIndex = '8';
            utils.removeClass(utils.$('.flip')[0], 'flip-turn');
            utils.removeClass(d.getElementById('letter'), 'letter-wrap-animate');
        }, false);
        //打开信
        var letter = d.getElementById('letter');
        letter.addEventListener('touchstart', openLetter, false);
        function openLetter(){
            letter.style.top = '-2.5rem';
            w.setTimeout(function(){
                utils.addClass(letter, 'open-letter');
                w.setTimeout(function(){
                    letter.addEventListener('touchstart', readLetter, false);
                }, 1000);
            }, 1000);
            letter.removeEventListener('touchstart', openLetter, false);
        }
        function readLetter(){
            utils.addClass(utils.$('.scene1')[0], 'scene-hide');
            w.setTimeout(function(){
                utils.remove(utils.$('.scene1')[0]);
            }, 1200)
        }

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