/**
 * Created by Administrator on 2015/7/17.
 */
var GameBattleState = State.extend({

    ctor:function()
    {
        this._super();
        this.stateName = "GameBattle";
    },

    BeginState:function(stateName)
    {
        this._super(stateName);

        var battleScene = new BattleScene();
        var trans = new cc.TransitionProgressRadialCCW(1, battleScene);
        cc.director.runScene(trans);
    }
});

GameBattleState.GetInstance = function()
{
    if(!this.instance)
    {
        this.instance = this.instance || new GameBattleState();
    }

    return this.instance;
}