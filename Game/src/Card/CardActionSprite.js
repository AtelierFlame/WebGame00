/**
 * Created by Administrator on 2015/7/20.
 */
var CardActionSprite = cc.Sprite.extend({
    callBack:null,
    callBackTarget:null,

    enable:false,
    skillindex:0,

    rect:function()
    {
        return cc.rect( 0, 0, this._rect.width, this._rect.height );
    },

    getIndex:function()
    {
        return this.skillindex;
    },

    containsTouchLocation:function(touch)
    {
        var pos = touch.getLocation();
        pos = this.convertToNodeSpace(pos);

        var rect = this.rect();
        return cc.rectContainsPoint(rect, pos);
    },

    setEnable:function(enable)
    {
        this.enable = enable;
        if(!this.enable)
        {
            this.setColor(cc.color(128, 128, 128));
        }
        else
        {
            this.setColor(cc.color(255, 255, 255));
        }
    },

    initTouchCallBack:function(callback, target)
    {
        this.callBack = callback;
        this.callBackTarget = target;

        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:this.onTouchBegan
        }, this);
    },

    onTouchBegan:function(touch, event)
    {
        var target = event.getCurrentTarget();

        if(!target.containsTouchLocation(touch))
        {
            return false;
        }

        if(!target.enable)
        {
            return false;
        }

        target.activated();

        return true;
    },

    activated:function()
    {
        if(!this.callBack)
        {
            return;
        }

        if(this.callBackTarget && (typeof(this.callBack) == "string"))
        {
            this.callBackTarget[this.callBack](this);
        }
        else if(this.callBackTarget && (typeof(this.callBack) == "function"))
        {
            this.callBack.call(this.callBackTarget, this);
        }
        else
        {
            this.callBack(this);
        }
    }
})