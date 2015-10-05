/**
 * Created by Administrator on 2015/7/18.
 */

var g_MaxSkillCount = 3;
var g_CardThumbSize = 64;
var g_CardSkillSize = 50;

var BattleSkillPanelLayer = BaseLayer.extend({
    cardThumb:null,
    thumbFrame:null,
    skillList:[],
    moveAction:null,
    defAction:null,
    curCardID:0,

    init:function()
    {
        this.cardThumb = new CardActionSprite();
        this.cardThumb.setPosition(0, 0);
        this.cardThumb.setEnable(false);
        this.addChild(this.cardThumb, g_GameZOrder.ui);
        this.cardThumb.initTouchCallBack(BattleManager.GetInstance().handleHintAttackAction, BattleManager.GetInstance());

        this.thumbFrame = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("thumbframe.png"));
        this.thumbFrame.setAnchorPoint(0, 0);
        this.thumbFrame.setPosition(0, 0);
        this.addChild(this.thumbFrame, g_GameZOrder.ui + 1);

        for(var i = 0; i < g_MaxSkillCount; ++i)
        {
            this.skillList.push(new CardActionSprite());
            this.skillList[i].setPosition(80 + 70 * i, 0);
            this.skillList[i].skillindex = i;
            this.addChild(this.skillList[i], g_GameZOrder.ui);
            this.skillList[i].initTouchCallBack(BattleManager.GetInstance().handleHintSkillAction, BattleManager.GetInstance());
            this.skillList[i].setEnable(false);
        }

        this.moveAction = new CardActionSprite(cc.spriteFrameCache.getSpriteFrame("moveicon.png"));
        this.moveAction.setAnchorPoint(1, 0);
        this.moveAction.setPosition(360, 0);
        this.moveAction.setEnable(false);
        this.addChild(this.moveAction, g_GameZOrder.ui);
        this.moveAction.initTouchCallBack(BattleManager.GetInstance().handleHintMoveAction, BattleManager.GetInstance());

        this.defAction = new CardActionSprite(cc.spriteFrameCache.getSpriteFrame("deficon.png"));
        this.defAction.setAnchorPoint(1, 0);
        this.defAction.setPosition(360, 34);
        this.defAction.setEnable(false);
        this.addChild(this.defAction, g_GameZOrder.ui);
        this.defAction.initTouchCallBack(BattleManager.GetInstance().handleDefenceAction, BattleManager.GetInstance());
    },

    updateWithCard:function(cardIdx, card)
    {
        if(card == null)
        {
            return;
        }

        if(card.cardID == this.curCardID)
        {
            return;
        }
        this.curCardID = card.cardID;

        if(g_CardList[this.curCardID] != null)
        {
            this.cardThumb.initWithFile(g_CardList[this.curCardID].image, g_CardList[this.curCardID].thumbrect);
            this.cardThumb.setAnchorPoint(0, 0);
            this.cardThumb.setScale(g_CardThumbSize / this.cardThumb.getContentSize().width,
                g_CardThumbSize / this.cardThumb.getContentSize().height);

            if(cardIdx < g_CardListSideSize)
            {
                if(BattleManager.GetInstance().getMoveablePosition(cardIdx).length > 0)
                {
                    this.moveAction.setEnable(true);
                }
                this.defAction.setEnable(true);
                this.cardThumb.setEnable(true);
            }
        }

        this.updateCardSkill(card);
    },

    updateCardSkill:function(card)
    {
        for(var i = 0; i < g_MaxSkillCount; ++i )
        {
            if(card.lightskill.length <= i)
            {
                break;
            }

            this.skillList[i].initWithSpriteFrame(
                cc.spriteFrameCache.getSpriteFrame(g_SkillList[card.lightskill[i].skillID].icon));
            this.skillList[i].setAnchorPoint(0, 0);
            this.skillList[i].setScale(g_CardSkillSize / this.skillList[i].getContentSize().width,
                g_CardSkillSize / this.skillList[i].getContentSize().height);
            this.skillList[i].setEnable(true);
        }
    },

    disableActionOrder:function()
    {
        this.moveAction.setEnable(false);
        this.defAction.setEnable(false);
        this.cardThumb.setEnable(false);

        for(var i = 0; i < g_MaxSkillCount; ++i)
        {
            this.skillList[i].setEnable(false);
        }
    }
})