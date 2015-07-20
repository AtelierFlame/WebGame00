/**
 * Created by Administrator on 2015/7/19.
 */
var BattleStartState = State.extend({
    ctor:function()
    {
        this._super();
        this.stateName = "BattleStart";
    },

    BeginState:function(stateName)
    {
        this._super(stateName);

        this.stateOwner.loadCardsData();
        this.stateOwner.cardLayer.initCardSprites();

        if(this.stateOwner.openingPerform)
        {
            window.setTimeout(this.performEnded, 4000, this.stateOwner);
            this.stateOwner.cardLayer.openingPerformance();
        }
        else
        {
            this.performEnded(this.stateOwner);
        }
    },

    performEnded:function(owner)
    {
        owner.readyForBattle();
    }
});

BattleStartState.GetInstance = function()
{
    if(!this.instance)
    {
        this.instance = this.instance || new BattleStartState();
    }

    return this.instance;
}