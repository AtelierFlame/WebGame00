/**
 * Created by Administrator on 2015/7/19.
 */
var BattlePreRoundState = State.extend({
    roundcount:0,

    ctor:function()
    {
        this._super();
        this.stateName = "BattlePreRound";
    },

    BeginState:function(stateName)
    {
        this._super(stateName);
        this.stateOwner.setRoundCount(this.roundcount);
        this.stateOwner.initCardActionSequence();
        this.stateOwner.selectNextCard();
    },

    setRound:function(round)
    {
        this.roundcount = round;
    }
});

BattlePreRoundState.GetInstance = function()
{
    if(!this.instance)
    {
        this.instance = this.instance || new BattlePreRoundState();
    }

    return this.instance;
}