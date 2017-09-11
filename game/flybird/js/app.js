'use strict';
! function(w, d) {
    (function() {
        var lastTime = 0;
        var prefixes = 'webkit moz ms o'.split(' '); //各浏览器前缀

        var requestAnimationFrame = w.requestAnimationFrame;
        var cancelAnimationFrame = w.cancelAnimationFrame;

        var prefix;
        //通过遍历各浏览器前缀，来得到requestAnimationFrame和cancelAnimationFrame在当前浏览器的实现形式
        for (var i = 0; i < prefixes.length; i++) {
            if (requestAnimationFrame && cancelAnimationFrame) {
                break;
            }
            prefix = prefixes[i];
            requestAnimationFrame = requestAnimationFrame || w[prefix + 'RequestAnimationFrame'];
            cancelAnimationFrame = cancelAnimationFrame || w[prefix + 'CancelAnimationFrame'] || window[prefix + 'CancelRequestAnimationFrame'];
        }

        //如果当前浏览器不支持requestAnimationFrame和cancelAnimationFrame，则会退到setTimeout
        if (!requestAnimationFrame || !cancelAnimationFrame) {
            requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                //为了使setTimteout的尽可能的接近每秒60帧的效果
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = w.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

            cancelAnimationFrame = function(id) {
                w.clearTimeout(id);
            };
        }

        //得到兼容各浏览器的API
        w.requestAnimationFrame = requestAnimationFrame;
        w.cancelAnimationFrame = cancelAnimationFrame;
    })()
    w.addEventListener('load', load, false);

    function load() {
        var W_HEIGHT = w.innerHeight;
        var W_WIDTH = w.innerWidth;
        var rAFId = null; //requestAnimationFrame id
        var cvs = d.getElementById('cvs');
        var ctx = cvs.getContext('2d');
        cvs.width = W_WIDTH;
        cvs.height = W_HEIGHT;
        var bird = null; //小鸟
        var pipes = []; //管道
        var index = 0; //管道index
        var lastTime = Date.now();
        var detailTime = 0;
        //图片对象存储
        var imgData = {
                'bg': 'bg.jpg',
                'title': 'title.png',
                'bird0': 'bird0.png',
                'bird1': 'bird1.png',
                'start': 'start.jpg',
                'grass': 'grass.jpg',
                'upipe': 'up_pipe.png',
                'dpipe': 'down_pipe.png',
                'umod': 'up_mod.png',
                'dmod': 'down_mod.png'
            },
            imgObj = {};
        //图像对象缓存
        (function() {
            var imgNum = 0;
            for (var key in imgData) {
                var img = new Image();
                img.src = './img/' + imgData[key];
                (function(key) {
                    img.addEventListener('load', function() {
                        imgNum++;
                        imgObj[key] = this;
                        if(imgNum === 10){
                            var move = 0;
                            bird = new Bird();
                            loop();
                            function loop(){
                                var nowTime = Date.now();
                                detailTime = nowTime - lastTime;
                                lastTime = nowTime;
                                if(bird.alive){
                                    move += 2;
                                    ctx.clearRect(0, 0, W_WIDTH, W_HEIGHT);
                                    //绘制水管
                                    if(pipes.length <= 0){
                                        creatPipe();
                                    }
                                    if(move > 182){
                                        move = 0;
                                        creatPipe();
                                    }
                                    //画水管
                                    for(var i = 0, len = pipes.length; i < len; i++){
                                        pipes[i].draw();
                                    }
                                    bird.draw();
                                    rAFId = w.requestAnimationFrame(loop);
                                }else{
                                    destroy();
                                }
                                
                            }
                            
                            cvs.addEventListener('touchstart', function(){
                                bird.speed = -6;
                            }, false);
                        }
                    }, false);
                })(key);
            }
        })();

        /*function startScene() {
            //绘制背景
            var shake = true,
                shakeY = 100,
                startTime = Date.now(),
                nowTime = 0,
                grassSpeed = 0;

            function draw() {
                rAFId = w.requestAnimationFrame(draw);
                clean();
                nowTime = Date.now();
                //绘制背景
                ctx.drawImage(imgObj.bg, 0, 0, W_WIDTH, W_HEIGHT);
                //绘制开始按钮
                ctx.drawImage(imgObj.start, (W_WIDTH / 2 - imgObj.start.width / 2), (W_HEIGHT / 2 - imgObj.start.height / 2), imgObj.start.width, imgObj.start.height);
                if (nowTime - startTime > (1000 / 7)) {
                    startTime = Math.floor(nowTime - ((nowTime - startTime) % (1000 / 7)));
                    shakeY = shake ? 100 : 110;
                    shake = !shake;
                }
                //绘制标题
                ctx.drawImage(imgObj.title, (W_WIDTH / 2 - 210 / 2), shakeY, imgObj.title.width, imgObj.title.height);
                //绘制小鸟
                ctx.drawImage(shake ? imgObj.bird0 : imgObj.bird1, (W_WIDTH / 2 - 210 / 2) + imgObj.title.width + 10, shakeY + 4, imgObj.bird0.width, imgObj.bird0.height);
                //绘制草坪
                console.log(imgObj.grass.height)
                ctx.drawImage(imgObj.grass, 10 * grassSpeed, 1176 * W_HEIGHT / 1334, W_WIDTH, W_WIDTH * imgObj.grass.height / imgObj.grass.width);
                ctx.drawImage(imgObj.grass, W_WIDTH + 10 * grassSpeed, 1176 * W_HEIGHT / 1334, W_WIDTH, W_WIDTH * imgObj.grass.height / imgObj.grass.width);
                if (W_WIDTH + 10 * grassSpeed >= 10) {
                    grassSpeed -= 0.05;
                } else {
                    grassSpeed = 0;
                }
            }
            return draw;
        }
        //开始游戏按钮
        cvs.addEventListener('touchstart', startGame, false);

        function startGame(e) {
            var X = e.touches[0].pageX,
                Y = e.touches[0].pageY;
            if ((X >= (W_WIDTH / 2 - imgObj.start.width / 2) && X <= ((W_WIDTH / 2 - imgObj.start.width / 2) + imgObj.start.width)) && (Y >= (W_HEIGHT / 2 - imgObj.start.height / 2) && Y <= (W_HEIGHT / 2 - imgObj.start.height / 2) + imgObj.start.height)) {
                cvs.addEventListener('touchstart', startGame, false);
                startScene = null;
                w.cancelAnimationFrame(rAFId);
                clean();

            }
        }*/
        //碰撞检测
        function check(){

        }
        //bg
        function bg(){
            ctx.rect(0, 0, W_WIDTH, W_HEIGHT);
            ctx.fillStyle = '#6fc6cd';
            ctx.fill();
        }
        //小鸟
        function Bird(){
            var _this = this;
            _this.X = W_WIDTH / 2 - imgObj.bird0.width / 2;
            _this.Y = W_HEIGHT / 2 - imgObj.bird0.height / 2;
            _this.speed = 0;
            _this.alive = true;
            _this.wing = true;
            _this.count = 0;
        }
        Bird.prototype = {
            constructor: Bird,
            draw: function(){
                ctx.save();
                var _this = this;
                var index = _this.wing ? 0 : 1;
                _this.Y += _this.speed;
                _this.speed = _this.speed + 0.02 * detailTime;
                //临界条件
                //坠地死亡
                if(_this.Y >= (1176 * W_HEIGHT / 1334 - 30)){
                    _this.speed = 0;
                    _this.alive = false;
                    //_this.Y = 1176 * W_HEIGHT / 1334 - 30;
                }
                //顶端不能越界
                if(_this.Y <= 0){
                    _this.Y = 0;
                    _this.speed = 3;
                }
                if(_this.speed >= 10){
                    _this.speed = 10;
                }
                //小鸟的头部方向
                //设置中心点
                ctx.translate(_this.X, _this.Y);
                if(_this.speed > 0){
                    //旋转30deg
                    ctx.rotate(30 * Math.PI / 180);
                }else if(_this.speed < 0){
                    ctx.rotate(-30 * Math.PI / 180);
                }else{
                    ctx.rotate(0);
                }
                ctx.translate(-_this.X,- _this.Y);
                //挥动翅膀
                ctx.drawImage(imgObj['bird'+ index], _this.X, _this.Y);
                ctx.restore();
            }
        }
        //管道
        function Pipe(){
            var _this = this;
            _this.viewH = 1176 * W_HEIGHT / 1334; //管道出现的高度区域
            _this.distance = 124; //上下管道距离
            _this.pipeX = W_WIDTH;
            _this.upipeY = Math.floor(Math.random() * (_this.viewH - _this.distance - 60));//上管道Y
            _this.dpipeY = _this.upipeY + _this.distance + 60;//下管道Y
        }
        Pipe.prototype = {
            constructor: Pipe,
            draw: function(){
                var _this = this;
                //上水管
                ctx.drawImage(imgObj.upipe, _this.pipeX, _this.upipeY);
                //上水管管体
                (function(){
                    for(var i = 0, len = _this.upipeY / 3; i < len; i++){
                        ctx.drawImage(imgObj.umod, _this.pipeX, i * 3);
                    }
                })();
                //下水管
                ctx.drawImage(imgObj.dpipe, _this.pipeX, _this.dpipeY);
                //下水管管体
                (function(){
                    for(var i = 0, len = (_this.viewH - (_this.dpipeY + 60)) / 2; i < len; i++){
                        ctx.drawImage(imgObj.dmod, _this.pipeX, _this.dpipeY + 60 + i * 2);
                    }
                })();
                _this.pipeX -= 2;
            },
        }
        function creatPipe(){
            var pipe = new Pipe();
            if(pipes.length >= 4){
                pipes.shift();
                pipes.push(pipe);
            }else{
                pipes.push(pipe);
            }
            console.log(pipes)
        }
        //销毁
        function destroy(){
            w.cancelAnimationFrame(rAFId);
            //clean();
        }
        //清除画布
        function clean() {
            ctx.clearRect(0, 0, W_WIDTH, W_HEIGHT);
        }
    }
}(window, document);
