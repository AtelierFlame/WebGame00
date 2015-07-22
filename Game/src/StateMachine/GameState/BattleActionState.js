/**
 * Created by Administrator on 2015/7/19.
 */
var BattleActionState = State.extend({
    cardIdx:-1,
    targetIdx:[],
    actionType:0,

    ctor:function()
    {
        this._super();
        this.stateName = "BattleAction";
    },

    setAction:function(type, idx, idxarray)
    {
        this.actionType = type;
        this.cardIdx = idx;
        this.targetIdx = idxarray;
    },

    BeginState:function(stateName)
    {
        this._super(stateName);

        this.stateOwner.performLayer.setVisible(true);
        this.stateOwner.performLayer.setCardSprite(this.cardIdx);
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