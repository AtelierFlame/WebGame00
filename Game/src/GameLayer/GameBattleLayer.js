/**
 * Created by Administrator on 2015/7/16.
 */

var GameBattleLayer = BaseLayer.extend({
    background:null,
    pic:null,

    init:function()
    {
        this._super();

        var size = cc.director.getWinSize();

        this.background = new cc.Sprite(s_battle_bg);
        this.background.setAnchorPoint(0.5, 0.5);
        this.background.setPosition(size.width / 2, size.height / 2);
        this.background.setScale(size.height / this.background.getContentSize().height);
        this.addChild(this.background, g_GameZOrder.bg);

        this.pic = new cc.Sprite(s_funnypic);
        this.pic.setAnchorPoint(0.5, 0.5);
        this.pic.setPosition(size.width / 2, size.height / 2);
        this.addChild(this.pic, g_GameZOrder.bg + 1);
    }
})