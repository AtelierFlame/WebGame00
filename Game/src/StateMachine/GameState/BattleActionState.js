/**
 * Created by Administrator on 2015/7/19.
 */
var BattleActionState = State.extend({
    ctor:function()
    {
        this._super();
        this.stateName = "BattleAction";
    },

});

BattleActionState.GetInstance = function()
{
    if(!this.instance)
    {
        this.instance = this.instance || new BattleActionState();
    }

    return this.instance;
}