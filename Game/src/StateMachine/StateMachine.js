/**
 * Created by Administrator on 2015/7/14.
 */
var StateMachine = cc.Class.extend({
    stateMachineOwner:null,

    currentState:null,
    previousState:null,
    globalState:null,

    ctor:function(owner)
    {
        this.stateMachineOwner = owner;
    },

    SetGlobalState:function(state)
    {
        this.globalState = state;
    },

    SetCurrentState:function(state)
    {
        this.currentState = state;
    },

    BeginGlobalState:function()
    {
        if(this.globalState)
        {
            this.globalState.BeginState();
        }
    },

    GotoState:function(state)
    {
        if(!state)
        {
            cc.error("State NULL error!!");
        }

        if(this.currentState)
        {
            this.currentState.EndState(state.stateName);
        }
        this.previousState = this.currentState;
        this.currentState = state;
        this.currentState.stateOwner = this.stateMachineOwner;

        if(this.previousState)
        {
            this.currentState.BeginState(this.previousState.stateName);
        }
        else
        {
            this.currentState.BeginState("");
        }
    },

    ReverState:function()
    {
        this.GotoState(this.previousState);
    }
})