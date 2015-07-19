/**
 * Created by Administrator on 2015/7/16.
 */

var GameBattleLayer = BaseLayer.extend({
    background:null,
    vsbg:null,
    roundbg:null,
    roundcount:null,
    menu:null,
    cardlayer:null,

    skillpanel:null,
    infopanel:null,

    init:function()
    {
        this._super();

        this.initBackground();
        this.initBattleUI();
        this.initBattleCards();
    },

    initBackground:function()
    {
        var size = cc.director.getWinSize();

        this.background = new cc.Sprite(s_battle_bg);
        this.background.setAnchorPoint(0.5, 0.5);
        this.background.setPosition(size.width / 2, size.height / 2);
        this.background.setScale(size.height / this.background.getContentSize().height);
        this.addChild(this.background, g_GameZOrder.bg);
    },

    initBattleUI:function()
    {
        this.vsbg = new cc.Sprite(s_vs);
        this.vsbg.setAnchorPoint(0.5, 0.5);
        this.vsbg.setPosition(g_OriginCanvasWidth / 2, g_OriginCanvasHeight - 60)
        this.addChild(this.vsbg, g_GameZOrder.bg + 1);

        this.roundbg = new cc.Sprite(s_round);
        this.roundbg.setAnchorPoint(0, 1);
        this.roundbg.setPosition(0, g_OriginCanvasHeight);
        this.addChild(this.roundbg, g_GameZOrder.ui);

        this.roundcount = new cc.LabelAtlas(1, s_roundcount, 35, 50, '0');
        this.roundcount.setAnchorPoint(0.5, 0.5);
        this.roundcount.setPosition(g_OriginCanvasWidth / 2, g_OriginCanvasHeight - 25);
        this.addChild(this.roundcount, g_GameZOrder.label);

        this.menu = new cc.Sprite(s_menu);
        this.menu.setAnchorPoint(0, 0);
        this.menu.setPosition(0, 0);
        this.addChild(this.menu, g_GameZOrder.ui);

        this.skillpanel = new BattleSkillPanelLayer();
        this.skillpanel.setContentSize(360, 64);
        this.skillpanel.setPosition(20, 8);
        this.menu.addChild(this.skillpanel, g_GameZOrder.ui);
        this.skillpanel.init();

        this.infopanel = new BattleCardInfoPanelLayer();
        this.infopanel.setContentSize(360, 64);
        this.infopanel.setPosition(420, 8);
        this.menu.addChild(this.infopanel, g_GameZOrder.ui);
        this.infopanel.init();
    },

    initBattleCards:function()
    {
        this.cardlayer = new BattleCardLayer();
        this.cardlayer.setAnchorPoint(0.5, 0.5);
        this.cardlayer.setPosition(g_OriginCanvasWidth / 2, g_OriginCanvasHeight / 2);
        this.addChild(this.cardlayer, g_GameZOrder.card);

        this.cardlayer.skillpanel = this.skillpanel;
        this.cardlayer.infopanel = this.infopanel;
        this.cardlayer.roundcount = this.roundcount;

        this.cardlayer.init();
    }
})