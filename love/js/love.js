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
            }, false);
        }, false);
        utils.$('.open-front')[0].addEventListener('touchstart', function(){
            utils.addClass(utils.$('.flip')[0], 'flip-turn');
            w.setTimeout(function(){
                utils.$('.envelope-open')[0].style.zIndex = '3';
            }, 400);
        }, false);
        utils.$('.open-back')[0].addEventListener('touchstart', function(){
            utils.removeClass(utils.$('.flip')[0], 'flip-turn');
        }, false);
        //拖动信
        (function(){
            var isTouch = false, startX = 0, startY = 0, offsetX = 0, offsetY = 0;
            var letter = d.getElementById('letter');
            letter.addEventListener('touchstart', function(e){
                startX = e.touches[0].pageX;
                startY = e.touches[0].pageY;
                isTouch = true;
                var letterTop = d.getElementById('letter').getBoundingClientRect().top;
                var envelopeTop = utils.$('.envelope-wrap')[0].getBoundingClientRect().top;
                d.getElementById('letter').style.top =  letterTop - envelopeTop + 'px';
                console.log(e)
                //utils.addClass(letter, 'letter-wrap-fixed');
            }, false);
            letter.addEventListener('touchmove', function(e){
                if(isTouch){
                    var moveX = e.touches[0].pageX;
                    var moveY = e.touches[0].pageY;
                    offsetX = startX - moveX;
                    offsetY = startY - moveY;
                    //信底部距离封信里面有多少
                    var letterTop = d.getElementById('letter').getBoundingClientRect().top;
                    var letterLeft = d.getElementById('letter').getBoundingClientRect().left;
                    var letterBottom = d.getElementById('letter').getBoundingClientRect().bottom;
                    var backmaskBottom = utils.$('.envelope-backmask')[0].getBoundingClientRect().top;
                    var envelopeTop = utils.$('.envelope-wrap')[0].getBoundingClientRect().top;
                    if(letterBottom < backmaskBottom){
                        utils.addClass(letter, 'letter-wrap-fixed');
                        d.getElementById('letter').style.left =  - offsetX + 'px';
                        d.getElementById('letter').style.top = - offsetY + 'px';
                    }else{
                        console.log(offsetY - (letterTop - envelopeTop) + (startX - letterTop))
                        d.getElementById('letter').style.top = offsetX - letterTop - envelopeTop - startX - letterTop + 'px';
                    }
                }else{
                    return;
                }
            }, false);
            letter.addEventListener('touchend', function(){
                isTouch = false;
            }, false);
        })();
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