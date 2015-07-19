/**
 * Created by Administrator on 2015/7/18.
 */

var g_MaxSkillCount = 4;
var g_CardThumbSize = 64;
var BattleSkillPanelLayer = BaseLayer.extend({
    cardThumb:null,
    skillList:[],
    curCardID:0,

    init:function()
    {
        this.cardThumb = new cc.Sprite();
        this.cardThumb.setPosition(0, 0);
        this.addChild(this.cardThumb, g_GameZOrder.ui);

        for(var i = 0; i < g_MaxSkillCount; ++i)
        {
            this.skillList.push(new cc.Sprite());
            this.skillList[i].setPosition(80 + 70 * i, 0);
            this.addChild(this.skillList[i], g_GameZOrder.ui);
        }
    },

    updateWithCard:function(cardid)
    {
        if(cardid < 0)
        {
            return;
        }

        if(cardid == this.curCardID)
        {
            return;
        }
        this.curCardID = cardid;

        if(g_CardList[cardid] != null)
        {
            this.cardThumb.initWithFile(g_CardList[cardid].image, g_CardList[cardid].thumbrect);
            this.cardThumb.setAnchorPoint(0, 0);
            this.cardThumb.setScale(this.cardThumb.getContentSize().width / g_CardThumbSize,
                this.cardThumb.getContentSize().height / g_CardThumbSize);
        }
    }
})