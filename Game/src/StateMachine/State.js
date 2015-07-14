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
        cc.log("Begin State From" + stateName);
    },

    EndState: function(stateName)
    {
        cc.log("End State To" + stateName);
    },

    CheckState:function()
    {
        return true;
    }

})