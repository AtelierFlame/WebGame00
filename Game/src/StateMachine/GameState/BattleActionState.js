/**
 * Created by Administrator on 2015/7/19.
 */
var BattleActionState = State.extend({
    cardIdx: -1,
    targetIdx: [],
    actionType: 0,
    result:[],

    ctor: function () {
        this._super();
        this.stateName = "BattleAction";
    },

    setAction: function (type, idx, idxarray, res) {
        this.actionType = type;
        this.cardIdx = idx;
        this.targetIdx = idxarray;
        this.result = res;
    },

    BeginState: function (stateName) {
        this._super(stateName);

        this.stateOwner.cardLayer.enableActionCards(-1, false);
        this.stateOwner.performLayer.setVisible(true);
        this.stateOwner.performLayer.setCardSprite(this.cardIdx);

        if (this.targetIdx.length > 0)
        {
            this.stateOwner.performLayer.setTargetCardSprites(this.targetIdx);
        }

        window.setTimeout(this.doPerformance, 500, this);
    },

    doPerformance: function (self)
    {
        var duration = 0;
        switch (self.actionType)
        {
            case BattleActionType.BAT_Move:
                if (self.targetIdx.length > 0)
                {
                    duration = self.stateOwner.performLayer.changePosition(self.cardIdx, self.targetIdx[0]);
                }
                break;

            case BattleActionType.BAT_Defence:
                duration = self.stateOwner.performLayer.setupDefenceEffect(self.cardIdx);
                break;

            case BattleActionType.BAT_Attack:
                if (self.targetIdx.length > 0)
                {
                    duration = self.stateOwner.performLayer.setupMeleeAttackEffect(self.targetIdx, self.result);
                }
                break;

            case BattleActionType.BAT_Skill:
                if(self.targetIdx.length > 0)
                {
                    duration = self.stateOwner.performLayer.setupSkillAttackEffect(self.targetIdx, self.result);
                }
                break;
        }

        window.setTimeout(self.endPerformance, duration, self);
    },

    endPerformance: function (self)
    {
        var duration = 500;
        switch (self.actionType)
        {
            case BattleActionType.BAT_Move:
                if(self.targetIdx.length > 0)
                {
                    self.stateOwner.notifyIndexChange(self.cardIdx, self.targetIdx[0]);
                }
                break;

            case BattleActionState.BAT_Defence:
                break;

            case BattleActionType.BAT_Attack:
                if(self.targetIdx.length > 0)
                {
                    duration = self.stateOwner.performLayer.setupMeleeAttackResult(self.targetIdx, self.result);
                }
                break;
        }

        self.stateOwner.notifyEffectCommand();

        window.setTimeout(self.endAction, duration, self);
    },

    endAction:function(self)
    {
        self.stateOwner.selectNextCard();
    },

    EndState:function(stateName)
    {
        this._super(stateName);

        this.stateOwner.performLayer.clearTargetCardSprites();
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