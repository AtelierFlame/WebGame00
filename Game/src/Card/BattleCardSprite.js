/**
 * Created by Administrator on 2015/7/18.
 */
var BattleCardSprite = cc.Sprite.extend({
    cardIndex:0,
    touchCallBack:null,
    touchCallBackTarget:null,

    actionEnable:false,
    actionType:0,

    healthBar:null,
    healthBarBG:null,

    isDead:false,

    ctor:function()
    {
        this._super();

        this.healthBar = new cc.LayerColor(cc.color(255, 64, 64));
        this.healthBar.setAnchorPoint(0, 1);
        this.healthBar.setContentSize(7, 70);
        this.healthBar.setPosition(5, 170);
        this.addChild(this.healthBar, g_GameZOrder.ui + 1);

        this.healthBarBG = new cc.LayerColor(cc.color(0, 0, 0))
        this.healthBarBG.setAnchorPoint(0, 1);
        this.healthBarBG.setContentSize(7, 70);
        this.healthBarBG.setPosition(5, 170);
        this.addChild(this.healthBarBG, g_GameZOrder.ui);
    },

    rect:function()
    {
        return cc.rect( 0, 0, this._rect.width, this._rect.height );
    },

    initCardIndex:function(index)
    {
        this.cardIndex = index;
        this.changeHealthBarPos(this.cardIndex < g_CardListSideSize);
    },

    changeHealthBarPos:function(bLeft)
    {
        if(bLeft)
        {
            this.healthBar.setPosition(5, 170);
            this.healthBarBG.setPosition(5, 170);
        }
        else
        {
            this.healthBar.setPosition(173, 170);
            this.healthBarBG.setPosition(173, 170);
        }
    },

    updateHealthBar:function(pct)
    {
        this.healthBar.setScale(1, pct);
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
        if(this.isDead)
        {
            return;
        }

        this.actionEnable = enable;
        if(!this.actionEnable)
        {
            this.stopAllActions();
            this.setOpacity(255);
            this.setColor(cc.color(128, 128, 128));
            this.healthBar.setOpacity(128);
            this.healthBarBG.setOpacity(128);
        }
        else
        {
            this.setColor(cc.color(255, 255, 255));
            this.healthBar.setOpacity(255);
            this.healthBarBG.setOpacity(255);
        }

        if(!enable)
        {
            this.actionType = BattleActionType.BAT_None;
        }
    },

    setSelectable:function(actiontype)
    {
        if(this.isDead)
        {
            return;
        }

        this.actionType = actiontype;

        var action = null;
        switch(this.actionType)
        {
            case BattleActionType.BAT_Move:
                action = new cc.Sequence(
                    new cc.TintTo(0.4, 128, 255, 128),
                    new cc.TintTo(0.4, 255, 255, 255)
                );
                break;

            case BattleActionType.BAT_HintAttack:
                break;

            case BattleActionType.BAT_Attack:
                action = new cc.Sequence(
                    new cc.TintTo(0.4, 255, 64, 64),
                    new cc.TintTo(0.4, 255, 255, 255)
                );
                break;

            case BattleActionType.BAT_HintSkill:
                action = new cc.Sequence(
                    new cc.TintTo(0.4, 255, 255, 128),
                    new cc.TintTo(0.4, 255, 255, 255)
                );
                break;

            case BattleActionType.BAT_Skill:
                action = new cc.Sequence(
                    new cc.TintTo(0.4, 255, 64, 64),
                    new cc.TintTo(0.4, 255, 255, 255)
                );
                break;
        }

        if(action != null)
        {
            this.runAction(cc.repeatForever(action));
        }
        this.setActionEnable(true);
    },

    setDead:function()
    {
        this.isDead = true;
        this.setActionEnable(false);
        this.setColor(cc.color(64, 32, 32));
    },

    onTouchBegan:function(touch, event)
    {
        var target = event.getCurrentTarget();

        if(!target.containsTouchLocation(touch))
        {
            return false;
        }

        if(!target.actionEnable)
        {
            return false;
        }

        target.touchActive();

        return true;
    },

    onTurnOn:function(callback, target)
    {
        var action = new cc.Sequence(
            new cc.FadeOut(0.5),
            new cc.CallFunc(callback, target),
            new cc.FadeIn(0.5),
            new cc.DelayTime(0.1)
        );

        this.runAction(action);
    }
})