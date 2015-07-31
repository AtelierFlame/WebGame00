/**
 * Created by Administrator on 2015/7/22.
 */
var CardPerformSprite = cc.Sprite.extend({
    cardIndex:0,

    ctor:function()
    {
        this._super();
    },

    notifyAttacked:function(bLeft, success)
    {
        if(success)
        {
            var action = new cc.Sequence(
                new cc.DelayTime(0.3),
                bLeft ? new cc.MoveBy(0.1, -20, -20) : new cc.MoveBy(0.1, 20, -20),
                bLeft ? new cc.MoveBy(0.2, 40, 40) : new cc.MoveBy(0.2, -40, 40),
                bLeft ? new cc.MoveBy(0.1, -20, -20) : new cc.MoveBy(0.1, 20, -20)
            );

            this.runAction(action);
        }
        else
        {
            var action = new cc.Sequence(
                bLeft ? new cc.MoveBy(0.1, -20, 0) : new cc.MoveBy(0.1, 20, 0),
                new cc.DelayTime(0.5),
                bLeft ? new cc.MoveBy(0.1, 20, 0) : new cc.MoveBy(0.1, -20, 0)
            );

            this.runAction(action);
        }
    },
})