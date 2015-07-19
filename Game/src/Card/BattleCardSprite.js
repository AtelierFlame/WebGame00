/**
 * Created by Administrator on 2015/7/18.
 */
var BattleCardSprite = cc.Sprite.extend({
    cardIndex:0,
    cardID:0,
    cardData:null,
    touchCallBack:null,
    touchCallBackTarget:null,
    isplayer:false,

    touchEnable:false,
    actionEnable:false,

    ctor:function()
    {
        this._super();
    },

    rect:function()
    {
        return cc.rect( 0, 0, this._rect.width, this._rect.height );
    },

    initTouchCallBack:function(callback, target)
    {
        this.touchCallBack = callback;
        this.touchCallBackTarget = target;

        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:this.onTouchBegan
        }, this);
    },

    containsTouchLocation:function(touch)
    {
        var pos = touch.getLocation();
        pos = this.convertToNodeSpace(pos);

        var rect = this.rect();
        return cc.rectContainsPoint(rect, pos);
    },

    setCardID:function(cardid)
    {
        this.cardID = cardid;
        if(this.cardData != null)
        {
            this.cardData.c = this.cardID;
        }
    },

    getCardID:function()
    {
        return this.cardID;
    },

    touchActive:function()
    {
        if(!this.touchCallBack)
        {
            return;
        }

        if(this.touchCallBackTarget && (typeof(this.touchCallBack) == "string"))
        {
            this.touchCallBackTarget[this.touchCallBack](this);
        }
        else if(this.touchCallBackTarget && (typeof(this.touchCallBack) == "function"))
        {
            this.touchCallBack.call(this.touchCallBackTarget, this);
        }
        else
        {
            this.touchCallBack(this);
        }
    },

    setActionEnable:function(enable)
    {
        this.actionEnable = enable;
        if(!this.actionEnable)
        {
            this.setColor(cc.color(128, 128, 128));
        }
        else
        {
            this.setColor(cc.color(255, 255,255));
        }
    },

    setTouchEnable:function(enable)
    {
        this.touchEnable = enable;
    },

    onTouchBegan:function(touch, event)
    {
        var target = event.getCurrentTarget();

        if(!target.containsTouchLocation(touch))
        {
            return false;
        }

        if(!target.touchEnable)
        {
            return false;
        }

        target.touchActive();

        return true;
    },

    onSelected:function(callback, target)
    {
        if(this.isplayer)
        {
            var color = this.getColor();
            var action = new cc.Sequence(
                //new cc.TintTo(0.2, 0, 255, 0),
                //new cc.TintTo(0.2, color.r, color.g, color.b),
                new cc.FadeOut(0.2),
                new cc.CallFunc(callback, target),
                new cc.FadeIn(0.2),
                new cc.DelayTime(0.1)
            );

            this.runAction(action);
        }
    }
})