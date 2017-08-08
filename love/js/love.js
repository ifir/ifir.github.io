'use strict';
(function(w, d){
    w.addEventListener('load', init, false);
    //初始化
    function init(){
        //常量
        var WINDOW_WIDTH = w.innerWidth;
        var WINDOW_HEIGHT = w.innerHeight;
        initLoadingCvs();
        //初始化loading
        function initLoadingCvs(){
            var cvs = d.getElementById('love-loading');
            var ctx = cvs.getContext('2d');
            cvs.width = WINDOW_WIDTH;
            cvs.height = WINDOW_HEIGHT;
            function drawLoading(){
                ctx.beginPath();
            }
        }
    }
})(window, document);