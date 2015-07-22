/**
 * Created by Administrator on 2015/7/19.
 */
var BattleActionState = State.extend({
    cardIdx: -1,
    targetIdx: [],
    actionType: 0,

    ctor: function () {
        this._super();
        this.stateName = "BattleAction";
    },

    setAction: function (type, idx, idxarray) {
        this.actionType = type;
        this.cardIdx = idx;
        this.targetIdx = idxarray;
    },

    BeginState: function (stateName) {
        this._super(stateName);

        this.stateOwner.performLayer.setVisible(true);
        this.stateOwner.performLayer.setCardSprite(this.cardIdx);

        if (this.targetIdx.length > 0) {
            this.stateOwner.performLayer.setTargetCardSprites(this.targetIdx);
        }

        window.setTimeout(this.doPerformance, 500, this);
    },

    doPerformance: function (self) {
        var duration = 0;
        switch (self.actionType) {
            case BattleActionType.BAT_Move:
                if (self.targetIdx.length > 0) {
                    duration = self.stateOwner.performLayer.changePosition(self.cardIdx, self.targetIdx[0]);
                }
                break;
        }

        window.setTimeout(self.endPerformance, duration, self);
    },

    endPerformance: function (self) {
        cc.log("End Performance");
        switch (self.actionType) {
            case BattleActionType.BAT_Move:
                if (self.targetIdx.length > 0) {
                    self.stateOwner.notifyIndexChange(self.cardIdx, self.targetIdx[0]);
                }
                break;
        }

        window.setTimeout(self.endAction, 500, self);
    },

    endAction:function(self)
    {
        self.stateOwner.selectNextCard();
    },

    EndState:function(stateName)
    {
        this._super();
        this.stateOwner.performLayer.setVisible(false);
    }
});

BattleActionState.GetInstance = function()
{
    if(!this.instance)
    {
        this.instance = this.instance || new BattleActionState();
    }

    return this.instance;
}