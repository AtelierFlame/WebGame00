/**
 * Created by Administrator on 2015/7/15.
 */
var GameStartState = State.extend({

    ctor:function()
    {
        this._super();
        this.stateName = "GameStart";
    },

    BeginState: function(stateName)
    {
        this._super(stateName);

        var titleScene = new GameTitleScene();
        cc.director.runScene(titleScene);
    }
});

GameStartState.GetInstance = function()
{
    if(!this.instance)
    {
        this.instance = this.instance || new GameStartState();
    }

    return this.instance;
}