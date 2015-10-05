/**
 * Created by flame on 2015/10/5.
 */

var AICommandManager = cc.Class.extend({
    card:null,
    cardindex:0,
    curActionType:0,

    setCard:function(data, index)
    {
        this.card = data;
        this.cardindex = index;
    },

    selectCommand:function()
    {
        this.curActionType = this.selectActionType();
        var targets = this.selectActionTarget();
        if(targets.length == 0)
        {
            this.curActionType = BattleActionType.BAT_Defence;
        }

        BattleManager.GetInstance().excuteAICommand(this.curActionType, targets);
    },

    selectActionType:function()
    {
        return BattleActionType.BAT_Attack;
    },

    selectActionTarget:function()
    {
        switch(this.curActionType)
        {
            case BattleActionType.BAT_Attack:
                return this.selectAttackTarget();
                break;
        }

        return [];
    },

    selectAttackTarget:function()
    {
        var targets = BattleManager.GetInstance().getAttackRangePosition(this.cardindex);
        if(targets.length > 0)
        {
            var mindis = g_CardListSize;
            var tar = -1;
            for(var i = 0; i < targets.length; ++i)
            {
                var dis = BattleManager.GetInstance().getCardDistance(this.cardindex, targets[i]);
                if(dis < mindis)
                {
                    mindis = dis;
                    tar = targets[i];
                }
            }

            if(tar >= 0)
            {
                return [tar];
            }
        }
        return [];
    }
});

AICommandManager.GetInstance = function()
{
    if(!this.instance)
    {
        this.instance = this.instance || new AICommandManager();
    }

    return this.instance;
}

