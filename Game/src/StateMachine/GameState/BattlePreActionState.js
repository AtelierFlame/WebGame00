/**
 * Created by Administrator on 2015/7/19.
 */
var BattlePreActionState = State.extend({
    curCardSprite:null,

    ctor:function()
    {
        this._super();
        this.stateName = "BattlePreAction";
    },

    BeginState:function(stateName)
    {
        this._super(stateName);

        this.stateOwner.cardLayer.enableActionCards(-1, false);
        if(this.curCardSprite != null)
        {
            this.stateOwner.cardLayer.enableActionCards(this.curCardSprite.cardIndex, true);
            this.curCardSprite.onSelected(this.stateOwner.notifySelectedCardChange, this.stateOwner);
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
