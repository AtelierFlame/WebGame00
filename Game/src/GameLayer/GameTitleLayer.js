/**
 * Created by Administrator on 2015/7/16.
 */

var GameTitleLayer = BaseLayer.extend({
    background:null,
    titlelabal:null,
    startbtn:null,
    menu:null,

    init:function()
    {
        this._super();

        var size = cc.director.getWinSize();

        this.background = new cc.Sprite(s_gamestart);
        this.background.setAnchorPoint(0.5, 0.5);
        this.background.setPosition(size.width / 2, size.height / 2);
        this.background.setScale(size.height / this.background.getContentSize().height);
        this.addChild(this.background, g_GameZOrder.bg);

        this.titlelabal = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("title.png"));
        this.titlelabal.setAnchorPoint(0, 0.5);
        this.titlelabal.setPosition(60, 360);
        this.addChild(this.titlelabal, g_GameZOrder.bg + 1);

        this.startbtn = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("startbtn_bg.png"),
            cc.spriteFrameCache.getSpriteFrame("startbtn.png"),
            this.onGameStart,
            this);
        this.startbtn.setAnchorPoint(0, 0.5);

        this.menu = new cc.Menu(this.startbtn);
        this.menu.setPosition(0, 0);
        this.addChild(this.menu, g_GameZOrder.bg + 1);
        this.startbtn.setPosition(80, 100);
    },

    onGameStart:function()
    {
        GameManager.GetInstance().gotoState(GameBattleState.GetInstance());
    }
});