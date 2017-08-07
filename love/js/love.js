'use strict';
(function(w, d){
    w.addEventListener('load', init, false);
    //初始化
    function init(){
        //重力感应
        d.addEventListener('plusready', function(){
        function gets(){
            /**
             * 获取手机当前加速度 plus.Accelerometer.getCurrentAcceleration(success(){}, error(){});
             *     success(加速度对象): 获取成功之后的回调函数
             *     error(错误信息对象): 获取失败之后的回调函数 
             */
            plus.accelerometer.getCurrentAcceleration(function(append){
                /**
                 * append: 加速度对象
                 * 三个属相: xAxis, yAxis, zAxis 分别为三个方向的坐标值(范围在 : -10到10之间);
                 * 屏幕六种状态极端坐标参考
                 *     正横屏/反横屏     xAxis = 10 / -10
                 *     正竖屏/反竖屏     yAxis = 10 / -10
                 *     朝天屏/朝地屏     zAxis = 10 / -10    
                 */
                d.getElementById('test').innerHTML = 'X轴: ' + append.xAxis + '<br>Y轴: ' + append.yAxis + '<br>Z轴: ' + append.zAxis;
            }, function(errors){
                /**
                 * errors: 错误信息对象
                 * 一个属性: message 错误的描述
                 */
                d.getElementById('test').html(errors.message);
            });
        } 
        
        var appendNumber = 0;
        function open(){
            /**
             * plus.accelerometer.watchAcceleration(success()){}, error(){}, options)
             *     success(加速度对象): 监听成功之后的回调函数
             *     error(错误信息对象): 监听失败之后的回调函数 
             *     options: 监听的设置对象 
             *         一个属性: frequency 监听频率(毫秒)
             * 返回值: 监听加速度的唯一标示符(number类型)
             */
            appendNumber = plus.accelerometer.watchAcceleration(function(append){
                d.getElementById('test').innerHTML = 'X轴: ' + append.xAxis + '<br>Y轴: ' + append.yAxis + '<br>Z轴: ' + append.zAxis;
            }, function(append){
                d.getElementById('test').innerHTML = append.message;
            }, {
                frequency: 1000
            })
        }
        
        function down(){
            /**
             * 关闭监听事件: plus.accelerometer.clearWatch(appendNumber)
             *     appendNumber: 监听加速度的唯一标示符(number类型)
             */
            plus.accelerometer.clearWatch(appendNumber);
        }
        
        d.getElementById('gets').addEventListener('touchstart', gets);
        d.getElementById('open').addEventListener('touchstart', open);
        d.getElementById('down').addEventListener('touchstart', down);
    });
    }
})(window, document);