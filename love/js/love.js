'use strict';
(function(w, d) {
    w.addEventListener('load', ready, false);
    //初始化
    function ready() {
        init();
        //预加载
        (function(){
            var imgUrl = [
                'http://sta.ganjistatic1.com/html/test/other/img/memphis-colorful.png',
                'http://sta.ganjistatic1.com/html/test/other/img/envelope-bg.png',
                'http://sta.ganjistatic1.com/html/test/other/img/postmark.png',
                'http://sta.ganjistatic1.com/html/test/other/img/stamp.png',
                'http://sta.ganjistatic1.com/html/test/other/img/magnifier.png',
                'http://sta.ganjistatic1.com/html/test/other/img/fingerprint.png',
                'http://sta.ganjistatic1.com/html/test/other/img/notebook.png',
                'http://sta.ganjistatic1.com/html/test/other/img/qx-text.png',
                'http://sta.ganjistatic1.com/html/test/other/img/boy.png',
                'http://sta.ganjistatic1.com/html/test/other/img/girl.png',
                'http://sta.ganjistatic1.com/html/test/other/img/bridge.png',
                'http://sta.ganjistatic1.com/html/test/other/img/cloud6.png',
                'http://sta.ganjistatic1.com/html/test/other/img/cloud7.png',
                'http://sta.ganjistatic1.com/html/test/other/img/cloud8.png'
            ];
            var successNum = 0;
            for(var i = 0, len = imgUrl.length; i < len; i++){
                var src = imgUrl[i];
                var img = new Image();
                //图片加载成功
                img.addEventListener('load', function(){
                    successNum++;
                    //全部缓存完成
                    if(successNum === len){
                        sourceLoading(3000);
                    }
                }, false);
                //图片加载失败
                img.addEventListener('error', function(){
                    sourceLoading(5000);
                }, false);
                //发起请求
                img.src = src;
            }
        })();
        //资源加载完去掉loading
        function sourceLoading(time) {
            w.setTimeout(function() {
                utils.addClass(utils.$('.loading-wrap')[0], 'loaded');
                utils.$('.scene1')[0].style.display = 'block';
                w.setTimeout(function() {
                    utils.remove(utils.$('.loading-wrap')[0]);
                }, 1200);
            }, time);
        }
        function init(){
            //常量
            var WINDOW_WIDTH = w.innerWidth,
                WINDOW_HEIGHT = w.innerHeight;

            var timer = null,
                timer2 = null;
            //移动端不支持自动播放
            d.documentElement.addEventListener('touchstart', bgmAutoPlay, false);
            //水果切换
            utils.addClass(utils.$('.bubble-fantasy')[0], 'bubble-fantasy-scale');
            timer = w.setTimeout(function() {
                timer2 = w.setInterval(randomFood, 300);
                clearTimeout(timer);
            }, 2000);
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
                utils.$('.scene2')[0].style.display = 'block';
                w.setTimeout(function(){
                    utils.$('.music-control')[0].style.top = '-.8rem';

                    utils.remove(utils.$('.scene1')[0]);
                }, 1200)
            }
            //观看七夕动画
            utils.$('#qx')[0].addEventListener('touchstart', function(){
                utils.$('.scene3')[0].style.display = 'block';
                utils.remove(utils.$('.scene2')[0]);
            }, false);
            //音乐按钮播放控制
            utils.$('.music-control')[0].addEventListener('touchstart', function(){
                if(utils.hasClass(this, 'music-close')){
                    utils.$('#bgm')[0].play();
                    utils.removeClass(this, 'music-close');
                }else{
                    utils.$('#bgm')[0].pause();
                    utils.addClass(this, 'music-close');
                }
                //透明度控制
                utils.removeClass(utils.$('.music-control')[0], 'delayOpacity');
                w.setTimeout(function(){
                    utils.addClass(utils.$('.music-control')[0], 'delayOpacity');
                }, 2000);
            }, false);
            w.setTimeout(function(){
                utils.addClass(utils.$('.music-control')[0], 'delayOpacity');
            }, 2000);
        }
    }
    //bgm 播放
    function bgmAutoPlay() {
        utils.$('#bgm')[0].play();
        utils.removeClass(utils.$('.music-control')[0], 'music-close');
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