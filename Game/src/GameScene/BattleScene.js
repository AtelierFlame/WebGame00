/**
 * Created by Administrator on 2015/7/16.
 */
var BattleScene = cc.Scene.extend({
    battleLayer:null,

    onEnter:function()
    {
        this._super();

        this.battleLayer = new GameBattleLayer();
        this.addChild(this.battleLayer);
        this.battleLayer.init();
    }
})