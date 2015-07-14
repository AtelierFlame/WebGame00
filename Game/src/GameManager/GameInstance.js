var g_OriginCanvasHeight = 480;
var g_OriginCanvasWidth = 800;
var g_Policy = null;

var GameInstance=(function(){
    var instance;
    function constructor() {
        return {
            AdjustSizeForWindow:function () {
                var targetRatio = g_OriginCanvasHeight / g_OriginCanvasWidth;
                var winRatio = window.innerHeight / window.innerWidth;

                if(window.innerHeight >= g_OriginCanvasHeight && window.innerWidth >= g_OriginCanvasWidth)
                {
                    cc._canvas.height = g_OriginCanvasHeight;
                    cc._canvas.width = g_OriginCanvasWidth;
                }
                else if( winRatio <= targetRatio )
                {
                    cc._canvas.height = window.innerHeight;
                    cc._canvas.width = window.innerHeight / targetRatio;
                }
                else
                {
                    cc._canvas.height = window.innerWidth * targetRatio;
                    cc._canvas.width = window.innerWidth;
                }

                var xScale = cc._canvas.width / g_OriginCanvasWidth;

                var parentDiv = document.getElementById("Cocos2dGameContainer");
                if(parentDiv)
                {
                    parentDiv.style.width = cc._canvas.width + "px";
                    parentDiv.style.height = cc._canvas.height + "px";
                    parentDiv.style.position = "absolute";
                    parentDiv.style.top = "50%";
                    parentDiv.style.left = "50%";
                    parentDiv.style.marginLeft = (-cc._canvas.width / 2) + "px";
                    parentDiv.style.marginTop = (-cc._canvas.height / 2) + "px";
                }

                if(g_Policy)
                {
                    cc.view.setDesignResolutionSize(g_OriginCanvasWidth, g_OriginCanvasHeight, g_Policy);
                }
                //cc._renderContext.getContext().translate(0, cc._canvas.height);
                //cc._renderContext.getContext().scale(xScale, xScale);
                //cc.director.setContentScaleFactor(xScale);
            }
        }
    }

    return{
        getInstance:function () {
            if (!instance) {
                instance=constructor();
            };
            return instance;
        }
    }
})();