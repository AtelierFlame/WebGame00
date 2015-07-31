/**
 * Created by Administrator on 2015/7/26.
 */

var MyLabelAtlas = cc.LabelAtlas.extend({
    bUsed:false,

    setParent:function(parent)
    {
        this._parent = parent;
        this.bUsed = true;
    },

    removeFromParent:function(cleanup)
    {
        this._super(cleanup);
        this.bUsed = false;
    },

    runEffectAction:function()
    {
        var action = new cc.Sequence(
            new cc.MoveBy(0.2, 0, 20),
            new cc.Spawn(new cc.MoveBy(0.2, 0, 20), new cc.FadeOut(0.2)),
            new cc.CallFunc(this.notifyActionEnded, this)
        );

        this.runAction(action);
    },

    notifyActionEnded:function()
    {
        this.removeFromParent(false);
    }
});

var MyLabelBM = cc.LabelBMFont.extend({
    bUsed:false,

    setParent:function(parent)
    {
        this._parent = parent;
        this.bUsed = true;
    },

    removeFromParent:function(cleanup)
    {
        this._super(cleanup);
        this.bUsed = false;
    },

    runEffectAction:function()
    {
        var action = new cc.Sequence(
            new cc.MoveBy(0.2, 0, 20),
            new cc.Spawn(new cc.MoveBy(0.2, 0, 20), new cc.FadeOut(0.2)),
            new cc.CallFunc(this.notifyActionEnded, this)
        );

        this.runAction(action);
    },

    notifyActionEnded:function()
    {
        this.removeFromParent(false);
    }
});

var GameLabelPool = cc.Class.extend({
    labelAtlasList:[],
    labelBMList:[],

    getValidLabelAtlas:function()
    {
        for(var i = 0; i < this.labelAtlasList.length; ++i)
        {
            if(!this.labelAtlasList[i].bUsed)
            {
                return this.labelAtlasList[i];
            }
        }

        this.labelAtlasList.push(new MyLabelAtlas(0, s_damagenum, 35, 50, '0'));
        return this.labelAtlasList[this.labelAtlasList.length - 1];
    },

    getValidLabelBM:function()
    {
        for(var i = 0; i < this.labelBMList.length; ++i)
        {
            if(!this.labelBMList[i].bUsed)
            {
                return this.labelBMList[i];
            }
        }

        this.labelBMList.push(new MyLabelBM("-", s_perfont));
        return this.labelBMList[this.labelBMList.length - 1];
    },
});

GameLabelPool.GetInstance = function()
{
    if(!this.instance)
    {
        this.instance = this.instance || new GameLabelPool();
    }

    return this.instance;
}