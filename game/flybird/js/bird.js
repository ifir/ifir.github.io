'use strict';
function Bird(cvs, ctx, imgObj){
    var _this = this;
    _this.winW = window.innerWidth;
    _this.winH = window.innerHeight;
    _this.imgObj = imgObj;
    _this.cvs = cvs;
    _this.ctx = ctx;
    _this.normalBird = [this.imgObj.bird0, this.imgObj.bird1];
    _this.upBird = [this.imgObj.ubird0, this.imgObj.ubird1];
    _this.downBird = [this.imgObj.dbird0, this.imgObj.dbird1];
    _this.X = _this.winW / 2 - 20;
    _this.Y = _this.winH / 2 - 15;
    _this.speed = 0;
    _this.wing = true;
    _this.alive = true;
}
Bird.prototype = {
    constructor: Bird,
    draw: function(bird){
        var _this = this;
        _this.ctx.drawImage(bird, _this.X, _this.Y, bird.width, bird.height);
    },
    fly: function(){
        var _this = this;
        var index = _this.wing ? 0 : 1;
        //Y轴坐标随速度变化
        _this.Y += _this.speed;
        _this.speed += 0.1;
        //临界条件
        //坠地死亡
        if(_this.Y >= 1176 * _this.winH / 1334 - 30){
            _this.speed = 0;
            _this.draw(_this.normalBird[index]);
            _this.dead();
        }
        //顶端不能越界
        if(_this.Y === 0){
            _this.speed = 6;
        }
        //重力加速度判断
        //重力加速度为正，下降，反之，上升
        if(_this.speed > 0){
            _this.draw(_this.downBird[index]);
        }else if(_this.speed < 0){
            _this.draw(_this.upBird[index]);
        }else{
            //水平
            _this.draw(_this.normalBird[index]);
        }
        //重力加速度限制
        if(_this.speed > 6){
            _this.speed = 6;
        }
    },
    wingWave: function(){
        this.wing = !this.wing;
    },
    dead: function(){
        this.alive = false;
    }
}