/**
 * Created by Administrator on 2015/7/15.
 */

var GameTitleScene = cc.Scene.extend({
    titleLayer:null,

    onEnter:function()
    {
        this._super();

        this.titleLayer = new GameTitleLayer();
        this.addChild(this.titleLayer);
        this.titleLayer.init();
    }
})