/**
 * Created by Administrator on 2015/7/19.
 */
var BattlePreActionState = State.extend({
    curCard:null,

    ctor:function()
    {
        this._super();
        this.stateName = "BattlePreAction";
    },

    BeginState:function(stateName)
    {
        this._super(stateName);

        this.stateOwner.enableActionCards(-1, false);
        if(this.curCard != null)
        {
            this.stateOwner.enableActionCards(this.curCard.cardIndex, true);
            this.curCard.onSelected(this.stateOwner.notifyCardChange, this.stateOwner);
        }
    },

});

BattlePreActionState.GetInstance = function()
{
    if(!this.instance)
    {
        this.instance = this.instance || new BattlePreActionState();
    }

    return this.instance;
}
