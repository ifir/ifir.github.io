'use strict';
(function(w, d) {
    w.addEventListener('load', ready, false);
    //初始化
    function ready() {
        //常量
        var WINDOW_WIDTH = w.innerWidth,
            WINDOW_HEIGHT = w.innerHeight;

        var timer = null,
            timer2 = null;
        //预加载
        (function() {
            var imgUrl = [
                'memphis-colorful.png',
                'envelope-bg.png',
                'postmark.png',
                'stamp.png',
                'magnifier.png',
                'fingerprint.png',
                'notebook.png',
                'qx-text.png',
                'boy.png',
                'girl.png',
                'bridge.png',
                'cloud6.png',
                'cloud7.png',
                'cloud8.png'
            ];
            var successNum = 0;
            for (var i = 0, len = imgUrl.length; i < len; i++) {
                var src = 'http://sta.ganjistatic1.com/html/test/other/img/' + imgUrl[i];
                var img = new Image();
                //图片加载成功
                img.addEventListener('load', function() {
                    successNum++;
                    //全部缓存完成
                    if (successNum === len) {
                        sourceLoading(3000);
                    }
                }, false);
                //图片加载失败
                img.addEventListener('error', function() {
                    sourceLoading(5000);
                }, false);
                //发起请求
                img.src = src;
            }
        })();
        init();
        //资源加载完去掉loading
        function sourceLoading(time) {
            w.setTimeout(function() {
                utils.addClass(utils.$('.loading-wrap')[0], 'loaded');
                utils.$('.scene1')[0].style.display = 'block';
                clearTimeout(timer2);
                w.setTimeout(function() {
                    utils.remove(utils.$('.loading-wrap')[0]);
                }, 1200);
            }, time);
        }

        function init() {
            //移动端不支持自动播放
            //d.documentElement.addEventListener('touchstart', bgmAutoPlay, false);
            //水果切换
            utils.addClass(utils.$('.bubble-fantasy')[0], 'bubble-fantasy-scale');
            timer = w.setTimeout(function() {
                timer2 = w.setInterval(randomFood, 300);
                clearTimeout(timer);
            }, 2000);
            //信封翻转
            utils.$('.envelope-front')[0].addEventListener('touchstart', function() {
                utils.addClass(utils.$('.envelope-wrap')[0], 'envelope-wrap-turn');
                utils.$('.envelope-backmask')[0].addEventListener('touchstart', backmask, false);
            }, false);
            function backmask() {
                utils.removeClass(utils.$('.envelope-wrap')[0], 'envelope-wrap-turn');
                utils.removeClass(utils.$('.flip')[0], 'flip-turn');
                utils.$('.envelope-open')[0].style.zIndex = '8';
            }
            utils.$('.open-front')[0].addEventListener('touchstart', openfront, false);
            function openfront() {
                utils.addClass(utils.$('.flip')[0], 'flip-turn');
                utils.addClass(d.getElementById('letter'), 'letter-wrap-animate');
                w.setTimeout(function() {
                    utils.$('.envelope-open')[0].style.zIndex = '3';
                }, 400);
            }
            utils.$('.open-back')[0].addEventListener('touchstart', openback, false);
            function openback() {
                utils.$('.envelope-open')[0].style.zIndex = '8';
                utils.removeClass(utils.$('.flip')[0], 'flip-turn');
                utils.removeClass(d.getElementById('letter'), 'letter-wrap-animate');
            }
            //打开信
            var letter = d.getElementById('letter');
            letter.addEventListener('touchstart', openLetter, false);

            function openLetter() {
                letter.style.top = '-2.5rem';
                utils.$('.open-front')[0].removeEventListener('touchstart', openfront, false);
                utils.$('.open-back')[0].removeEventListener('touchstart', openback, false);
                utils.$('.envelope-backmask')[0].removeEventListener('touchstart', backmask, false);
                w.setTimeout(function() {
                    utils.addClass(letter, 'open-letter');
                    w.setTimeout(function() {
                        letter.addEventListener('touchstart', readLetter, false);
                    }, 1000);
                }, 1000);
                letter.removeEventListener('touchstart', openLetter, false);
            }

            function readLetter() {
                utils.addClass(utils.$('.scene1')[0], 'scene-hide');
                utils.$('.scene2')[0].style.display = 'block';
                w.setTimeout(function() {
                    utils.$('.music-control')[0].style.top = '-.8rem';

                    utils.remove(utils.$('.scene1')[0]);
                }, 1200)
            }
            //观看七夕动画
            utils.$('#qx')[0].addEventListener('touchstart', function() {
                utils.$('.scene3')[0].style.display = 'block';
                utils.remove(utils.$('.scene2')[0]);
            }, false);
            //音乐按钮播放控制
            utils.$('.music-control')[0].addEventListener('touchstart', function() {
                if (utils.hasClass(this, 'music-close')) {
                    utils.$('#bgm')[0].play();
                    utils.removeClass(this, 'music-close');
                } else {
                    utils.$('#bgm')[0].pause();
                    utils.addClass(this, 'music-close');
                }
                //透明度控制
                utils.removeClass(utils.$('.music-control')[0], 'delayOpacity');
                w.setTimeout(function() {
                    utils.addClass(utils.$('.music-control')[0], 'delayOpacity');
                }, 2000);
            }, false);
            w.setTimeout(function() {
                utils.addClass(utils.$('.music-control')[0], 'delayOpacity');
            }, 2000);
            //ajax请求信封内容
            (function() {
                //判断url
                var url = w.location.search.substr(1).split('=');
                if (url[0] === 'love' && url[1] === 'manli') {
                    var xhr = new XMLHttpRequest();
                    xhr.open('get', 'https://ifir.github.io/love/text/text.json', true);
                    xhr.send(null);
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            var data = JSON.parse(xhr.responseText);
                            //信封正面
                            utils.$('.envelope-front h1')[0].innerHTML = 'Dear<b></b>Manli';
                            //信的内容
                            var tpl = [];
                            for( var key in data){
                                tpl.push("<p class='notebook-p'>" + data[key] + "</p>");
                            }
                            tpl.push("<p class='notebook-p' id='qx'>观看七夕动画<i class='css-movie'></i></p>");
                            utils.$('.scene2')[0].innerHTML = tpl.join('');
                        }
                    }
                } else {
                    //信封正面
                    utils.$('.envelope-front h1')[0].innerHTML = 'Dear<b></b>Friend';
                }
            })();
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


