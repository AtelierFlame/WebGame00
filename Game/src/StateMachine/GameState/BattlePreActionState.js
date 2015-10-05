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
            this.curCardSprite.onTurnOn(this.stateOwner.notifyActionCardChange, this.stateOwner);

            if(BattleManager.GetInstance().isEnemyCard(this.curCardSprite.cardIndex))
            {
                window.setTimeout(this.AICommand, 800, this);
            }
        }
    },

    AICommand:function(self)
    {
        cc.log("AI Round");
        var card = BattleManager.GetInstance().getCardData(self.curCardSprite.cardIndex);
        if(card != null)
        {
            AICommandManager.GetInstance().setCard(card, self.curCardSprite.cardIndex);
            AICommandManager.GetInstance().selectCommand();
            //var action = AICommandManager.GetInstance().selectActionType();
            //var targets = AICommandManager.GetInstance().selectActionTarget();
            //
            //BattleManager.GetInstance().excuteAICommand(action, targets);
        }
    }
});

BattlePreActionState.GetInstance = function()
{
    if(!this.instance)
    {
        this.instance = this.instance || new BattlePreActionState();
    }

    return this.instance;
}
