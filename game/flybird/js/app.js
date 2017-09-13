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
        var score = null; //分数
        var pipes = []; //管道
        var storage = null;
        var bestScore = 0;
        var grassSpeed = 0;
        var lastTime = 0;
        var detailTime = 0;
        var move = 0;
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
                'dmod': 'down_mod.png',
                'msg': 'message.jpg'
            },
            imgObj = {};
        //初始化
        function init() {
            bird = new Bird();
            score = new Score();
            storage = new Storage('localStorage')
            pipes = [];
            move = 0;
            grassSpeed = 0;
            lastTime = Date.now();
            detailTime = 0;
            rAFId = null;
            //读取最高分数
            if (storage.get('fbs')) {
                bestScore = storage.get('fbs');
            } else {
                storage.set('fbs', 0);
            }
        }
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
                        if (imgNum === 11) {

                            var s = startScene();
                            s();
                        }
                    }, false);
                })(key);
            }
        })();
        //开始界面
        function startScene() {
            //绘制背景
            var shake = true,
                shakeY = 100,
                startTime = Date.now(),
                nowTime = 0;

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
                ctx.drawImage(imgObj.grass, grassSpeed, 1176 * W_HEIGHT / 1334, W_WIDTH, W_WIDTH * imgObj.grass.height / imgObj.grass.width);
                ctx.drawImage(imgObj.grass, W_WIDTH + grassSpeed, 1176 * W_HEIGHT / 1334, W_WIDTH, W_WIDTH * imgObj.grass.height / imgObj.grass.width);
                if (W_WIDTH + grassSpeed > 10) {
                    grassSpeed -= 2;
                } else {
                    grassSpeed = 0;
                }
            }
            return draw;
        }
        //首次开始游戏按钮
        cvs.addEventListener('touchstart', startGame, false);

        function startGame(e) {
            var X = e.touches[0].pageX,
                Y = e.touches[0].pageY;
            if ((X >= (W_WIDTH / 2 - imgObj.start.width / 2) && X <= ((W_WIDTH / 2 - imgObj.start.width / 2) + imgObj.start.width)) && (Y >= (W_HEIGHT / 2 - imgObj.start.height / 2) && Y <= (W_HEIGHT / 2 - imgObj.start.height / 2) + imgObj.start.height)) {
                startScene = null;
                w.cancelAnimationFrame(rAFId);
                clean();
                cvs.removeEventListener('touchstart', startGame, false);
                cvs.addEventListener('touchstart', fly, false);
                init();
                loop();
            }
        }
        //游戏主体
        function loop() {
            var nowTime = Date.now();
            detailTime = nowTime - lastTime;
            lastTime = nowTime;
            check();
            if (bird.alive) {
                ctx.clearRect(0, 0, W_WIDTH, W_HEIGHT);
                //绘制背景
                ctx.drawImage(imgObj.bg, 0, 0, W_WIDTH, W_HEIGHT);
                move += 2;
                //绘制水管
                if (pipes.length <= 0) {
                    creatPipe();
                }
                if (move > 182) {
                    move = 0;
                    creatPipe();
                }
                //画水管
                for (var i = 0, len = pipes.length; i < len; i++) {
                    pipes[i].draw();
                }
                //绘制草坪
                ctx.drawImage(imgObj.grass, grassSpeed, 1176 * W_HEIGHT / 1334, W_WIDTH, W_WIDTH * imgObj.grass.height / imgObj.grass.width);
                ctx.drawImage(imgObj.grass, W_WIDTH + grassSpeed, 1176 * W_HEIGHT / 1334, W_WIDTH, W_WIDTH * imgObj.grass.height / imgObj.grass.width);
                if (W_WIDTH + grassSpeed > 10) {
                    grassSpeed -= 2;
                } else {
                    grassSpeed = 0;
                }
                score.draw();
                bird.draw();
                rAFId = w.requestAnimationFrame(loop);
            } else {
                showScore();
                destroy();
                restart();
            }
        }
        //小鸟向上飞

        function fly() {
            bird.speed = -6;
        }
        //碰撞检测
        function check() {
            var birdRect = {
                top: bird.Y,
                left: bird.X,
                right: bird.X + imgObj.bird0.width,
                bottom: bird.Y + imgObj.bird0.height
            };
            //临界条件
            //坠地死亡
            if (birdRect.bottom >= (1176 * W_HEIGHT / 1334) - 10) {
                bird.alive = false;
            }
            //顶端不能越界
            if (birdRect.top <= 0) {
                bird.speed = 3;
            }
            //水管检测
            for (var i = 0, len = pipes.length; i < len; i++) {
                var pipe = pipes[i];
                var pipeRect = {
                    top: pipe.upipeY + imgObj.upipe.height, //上水管宽口距离顶部距离
                    left: pipe.pipeX,
                    right: pipe.pipeX + imgObj.upipe.width,
                    bottom: pipe.dpipeY //下水管宽口距离顶部距离
                };
                if (birdRect.right >= pipeRect.left && birdRect.left <= pipeRect.right) {
                    if (birdRect.top <= pipeRect.top || birdRect.bottom >= pipeRect.bottom) {
                        bird.alive = false;
                    }
                }
                //计数
                if (birdRect.left >= pipeRect.right && !pipe.skip) {
                    pipe.skip = true;
                    score.count++;
                }
                //小鸟轮廓辅助线
                /*ctx.beginPath();
                ctx.moveTo(birdRect.right, 0);
                ctx.lineTo(birdRect.right, W_HEIGHT);
                ctx.strokeStyle = 'red';
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(birdRect.left, 0);
                ctx.lineTo(birdRect.left, W_HEIGHT);
                ctx.strokeStyle = 'blue';
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, birdRect.top);
                ctx.lineTo(W_WIDTH, birdRect.top);
                ctx.strokeStyle = 'black';
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, birdRect.bottom);
                ctx.lineTo(W_WIDTH, birdRect.bottom);
                ctx.strokeStyle = 'green';
                ctx.stroke();*/

            }
        }
        //小鸟
        function Bird() {
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
            draw: function() {
                ctx.save();
                var _this = this;
                if(this.count === 8){
                    this.wing = 1;
                }
                if(this.count === 16){
                    this.wing = 0;
                    this.count = 0;
                }
                var index = _this.wing ? 0 : 1;
                this.count++;
                _this.Y += _this.speed;
                _this.speed = _this.speed + 0.02 * detailTime;
                if (bird.speed >= 10) {
                    bird.speed = 10;
                }
                //小鸟的头部方向
                //设置中心点
                ctx.translate(_this.X + (imgObj.bird0.width / 2), _this.Y + (imgObj.bird0.height / 2));
                if (_this.speed > 0) {
                    //旋转30deg
                    ctx.rotate(30 * Math.PI / 180);
                } else if (_this.speed < 0) {
                    ctx.rotate(-30 * Math.PI / 180);
                } else {
                    ctx.rotate(0);
                }
                ctx.translate(-_this.X - (imgObj.bird0.width / 2), -_this.Y - (imgObj.bird0.height / 2));
                //挥动翅膀
                ctx.drawImage(imgObj['bird' + index], _this.X, _this.Y);
                ctx.restore();
            }
        }
        //管道
        function Pipe() {
            var _this = this;
            _this.viewH = 1176 * W_HEIGHT / 1334; //管道出现的高度区域
            _this.distance = 124; //上下管道距离
            _this.pipeX = W_WIDTH;
            _this.upipeY = Math.floor(Math.random() * (_this.viewH - _this.distance - 150)); //上管道Y
            _this.dpipeY = _this.upipeY + _this.distance + 60; //下管道Y
            _this.alive = true;
            _this.skip = false; //是否被越过
        }
        Pipe.prototype = {
            constructor: Pipe,
            draw: function() {
                var _this = this;
                if (_this.alive) {
                    //上水管
                    ctx.drawImage(imgObj.upipe, _this.pipeX, _this.upipeY);
                    //上水管管体
                    (function() {
                        for (var i = 0, len = _this.upipeY / 3; i < len; i++) {
                            ctx.drawImage(imgObj.umod, _this.pipeX, i * 3);
                        }
                    })();
                    //下水管
                    ctx.drawImage(imgObj.dpipe, _this.pipeX, _this.dpipeY);
                    //下水管管体
                    (function() {
                        for (var i = 0, len = (_this.viewH - (_this.dpipeY + 60)) / 2; i < len; i++) {
                            ctx.drawImage(imgObj.dmod, _this.pipeX, _this.dpipeY + 60 + i * 2);
                        }
                    })();
                    if (_this.pipeX <= -62) {
                        _this.alive = false;
                    }
                    _this.pipeX -= 2;
                }

            },
        }
        //创建管道
        function creatPipe() {
            var pipe = new Pipe();
            if (pipes.length >= 4) {
                pipes.shift();
            }
            pipes.push(pipe);
        }
        //分数系统
        function Score() {
            this.count = 0;
            this.ready = false;
        }
        Score.prototype.draw = function() {
            //绘制分数
            ctx.save();
            ctx.font = 'bold 40px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 10;
            ctx.strokeText(this.count, W_WIDTH / 2, 50);
            ctx.fillText(this.count, W_WIDTH / 2, 50);
            ctx.restore();
        }
        //销毁
        function destroy() {
            bird = null;
            score = null;
            storage = null;
            pipes = [];
            w.cancelAnimationFrame(rAFId);
            cvs.removeEventListener('touchstart', fly, false);
            //clean();
        }
        //重新开始
        function restart() {
            cvs.addEventListener('touchstart', restartGame, false);

            function restartGame(e) {
                var X = e.touches[0].pageX,
                    Y = e.touches[0].pageY;
                if ((X >= (W_WIDTH / 2 - imgObj.start.width / 2) && X <= ((W_WIDTH / 2 - imgObj.start.width / 2) + imgObj.start.width)) && (Y >= (W_HEIGHT / 4 + imgObj.msg.height + 50) && Y <= (W_HEIGHT / 4 + imgObj.msg.height + 50) + imgObj.start.height)) {
                    cvs.removeEventListener('touchstart', restartGame, false);
                    cvs.addEventListener('touchstart', fly, false);
                    init();
                    loop();
                }
            }
        }

        function showScore() {
            ctx.save();
            ctx.drawImage(imgObj.start, (W_WIDTH / 2 - imgObj.start.width / 2), W_HEIGHT / 4 + imgObj.msg.height + 50, imgObj.start.width, imgObj.start.height);
            ctx.drawImage(imgObj.msg, (W_WIDTH / 2 - imgObj.msg.width / 2), W_HEIGHT / 4, imgObj.msg.width, imgObj.msg.height);
            ctx.font = 'bold 20px Arial';
            ctx.textBaseline = 'top';
            ctx.textAlign = 'left';
            ctx.fillStyle = '#e9b427';
            ctx.fillText('SCROE', (W_WIDTH / 2 - imgObj.msg.width / 2) + 44, W_HEIGHT / 4 + 64);
            ctx.fillText('BEST', (W_WIDTH / 2 - imgObj.msg.width / 2) + 170, W_HEIGHT / 4 + 64);
            ctx.font = 'bold 40px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#e47700';
            if (parseInt(storage.get('fbs'), 10) < score.count) {
                storage.set('fbs', score.count);
            }
            ctx.fillText(score.count, (W_WIDTH / 2 - imgObj.msg.width / 2) + 80, W_HEIGHT / 4 + 84);
            ctx.fillText(bestScore, (W_WIDTH / 2 - imgObj.msg.width / 2) + 196, W_HEIGHT / 4 + 84);
            ctx.restore();
        }
        //清除画布
        function clean() {
            ctx.clearRect(0, 0, W_WIDTH, W_HEIGHT);
        }
        //localStorage
        function Storage(type) {
            this.type = w[type];
        }
        Storage.prototype = {
            constructor: Storage,
            get: function(key) {
                return this.type.getItem(key);
            },
            set: function(key, value) {
                this.type.setItem(key, value);
            },
            clean: function(key) {
                this.type.removeItem(key);
            }
        }
    }
}(window, document);