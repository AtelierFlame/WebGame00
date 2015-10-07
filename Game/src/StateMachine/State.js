/**
 * Created by Administrator on 2015/7/14.
 */
var State = cc.Class.extend({
    stateOwner: null,
    stateName: "",

    ctor:function()
    {
        this.stateName = "State";
    },

    BeginState: function(stateName)
    {
        cc.log("Begin State From " + stateName + " to " + this.stateName);
    },

    EndState: function(stateName)
    {
        //cc.log("End State From " + this.stateName + " to " + stateName);
    },

    CheckState:function()
    {
        return true;
    }

})