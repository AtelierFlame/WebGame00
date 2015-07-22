/**
 * Created by Administrator on 2015/7/15.
 */
var g_GameZOrder =
{
    bg:0,

    card:100,

    ui:200,

    label:500,

    performance:1000,
}

var GameManager = cc.Class.extend({
    stateMachine:null,

    ctor:function()
    {
        this.stateMachine = new StateMachine(this);
    },

    gotoState:function(state)
    {
        this.stateMachine.GotoState(state);
    }
})

GameManager.GetInstance = function()
{
    if(!this.instance)
    {
        this.instance = this.instance || new GameManager();
    }

    return this.instance;
}
