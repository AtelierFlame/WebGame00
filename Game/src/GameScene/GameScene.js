/**
 * Created by Administrator on 2015/7/15.
 */
var GameTitleLayer = cc.Layer.extend({
    background:null,

    init:function()
    {
        this._super();

        var size = cc.director.getWinSize();

        this.background = new cc.Sprite(s_gamestart);
        this.background.setAnchorPoint(0.5, 0.5);
        this.background.setPosition(size.width / 2, size.height / 2);
        this.background.setScale(size.height / this.background.getContentSize().height);
        this.addChild(this.background, g_GameZOrder.bg);
    }
});

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