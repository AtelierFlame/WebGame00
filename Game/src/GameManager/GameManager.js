/**
 * Created by Administrator on 2015/7/15.
 */
var g_GameZOrder =
{
    bg:0,

    ui:100
}

var GameManager = (function()
{
    var instance;
    var stateMachine;

    function constructor()
    {
        stateMachine = new StateMachine(this);

        return{
            GetStateMachine:function()
            {
                return stateMachine;
            },

            GotoState:function(state)
            {
                stateMachine.GotoState(state);
            }
        };
    }

    return{
        GetInstance:function()
        {
            if(instance == null)
            {
                instance = constructor();
            }
            return instance;
        }
    }
})();
