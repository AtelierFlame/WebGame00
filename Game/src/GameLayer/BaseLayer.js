/**
 * Created by Administrator on 2015/7/16.
 */

var BaseLayer=cc.Layer.extend({
    bgFrame:null,
    canTouch:false,
    showBg:false,
    showBgAction:false,

    ctor:function()
    {
        this._super();

        if(this.showBg)
        {
            var bgFrame = cc.LayerColor(cc.color(0, 0, 0, 200));
            this.addChild(bgFrame, g_GameZOrder.bg);
            this.bgFrame = bgFrame;
            this.setAnchorPoint(cc.p(0.5, 0.5));

            this.ignoreAnchorPointForPosition(false);
            var winsize = cc.director.getWinSize();
            this.setContentSize(winsize);
            this.setPosition(cc.p(winsize.width / 2, winsize.height / 2));
        }

        if(this.canTouch)
        {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches:true,

                onTouchBegan:function()
                {
                    return true;
                }
            }, this);
        }

        if(this.showBgAction)
        {
            var obj = this;
            this.setScale(0.8);
            if(obj != null)
            {
                var scale = cc.scaleTo(0.15, 1.1);
                var sl = scale.easing(cc.easeIn(2));
                var sl2 = cc.scaleTo(0.15, 1);
                var seq = cc.Sequence(sl, sl2);
                obj.runAction(seq);
            }
        }
    },

    setBgColor:function(color)
    {
        this.bgFrame.setColor(color);
    }
})