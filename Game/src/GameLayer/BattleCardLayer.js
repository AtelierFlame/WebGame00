/**
 * Created by Administrator on 2015/7/18.
 */
var BattleCardLayer = BaseLayer.extend({
    statemachine:null,

    showBg:true,
    openingPerform:false,
    cardPosList:[],

    spriteListLeft:[],
    spriteListRight:[],

    curRoundCount:1,
    curSelectCardIndex:0,

    cardActionSequence:[],

    skillpanel:null,
    infopanel:null,
    roundcount:null,

    ctor:function()
    {
        this._super();
        this.statemachine = new StateMachine(this);
    },

    init:function()
    {
        this.initCardPostionList();
        this.spriteListLeft = new Array();
        this.spriteListRight = new Array();
        this.cardActionSequence = new Array();

        for(var i = 0; i < g_CardListSideSize; ++i)
        {
            // left sprites
            this.spriteListLeft.push(new BattleCardSprite());
            this.spriteListLeft[i].setScale(0.7, 0.7);
            if(BattleManager.GetInstance().openingPerform)
            {
                this.spriteListLeft[i].setPosition(-200, 140);
            }
            else
            {
                this.spriteListLeft[i].setPosition(this.cardPosList[i]);
            }
            this.spriteListLeft[i].initTouchCallBack(this.onCardTouch, this);
            this.addChild(this.spriteListLeft[i], g_GameZOrder.card + g_CardListSideSize - i);

            // right sprites
            this.spriteListRight.push(new BattleCardSprite());
            this.spriteListRight[i].setScale(0.7, 0.7);
            this.spriteListRight[i].setPosition(this.cardPosList[i + g_CardListSideSize]);
            if(BattleManager.GetInstance().openingPerform)
            {
                this.spriteListRight[i].setOpacity(0);
            }
            this.spriteListRight[i].initTouchCallBack(this.onCardTouch, this);
            this.addChild(this.spriteListRight[i], g_GameZOrder.card + g_CardListSideSize - i);
        }
    },

    initCardPostionList:function()
    {
        this.cardPosList.push(cc.p(200, 140));
        this.cardPosList.push(cc.p(140, 140));
        this.cardPosList.push(cc.p(80, 140));
        this.cardPosList.push(cc.p(20, 140));
        this.cardPosList.push(cc.p(600, 140));
        this.cardPosList.push(cc.p(660, 140));
        this.cardPosList.push(cc.p(720, 140));
        this.cardPosList.push(cc.p(780, 140));
    },

    initCardSprites:function()
    {
        for(var i = 0; i < g_CardListSideSize; ++i)
        {
            if(this.spriteListLeft[i] != null)
            {
                this.spriteListLeft[i].cardIndex = i;
                if(BattleManager.GetInstance().getCardData(i) != null)
                {
                    this.spriteListLeft[i].initWithFile(
                        g_CardList[BattleManager.GetInstance().getCardData(i).cardID].image);
                    this.spriteListLeft[i].setAnchorPoint(0, 0);
                }
            }

            if(this.spriteListRight[i] != null)
            {
                this.spriteListRight[i].cardIndex = i + g_CardListSideSize;
                if(BattleManager.GetInstance().getCardData(i + g_CardListSideSize) != null)
                {
                    this.spriteListRight[i].initWithFile(
                        g_CardList[BattleManager.GetInstance().getCardData(i + g_CardListSideSize).cardID].image);
                    this.spriteListRight[i].setAnchorPoint(1, 0);
                }
            }
        }

        //this.skillpanel.updateWithCard(this.getSelectCardID());
    },

    refreshCards:function()
    {

    },

    getCardByIndex:function(index)
    {
        if(index < 0 && index >= g_CardListSize * 2)
        {
            return null;
        }
        if(index < g_CardListSideSize)
        {
            return this.spriteListLeft[index];
        }
        else
        {
            return this.spriteListRight[index - g_CardListSideSize];
        }
    },

    openingPerformance:function()
    {
        for(var i = 0; i < g_CardListSideSize; ++i)
        {
            this.spriteListLeft[i].runAction(new cc.sequence(
                new cc.DelayTime(0.5 * i),
                new cc.MoveTo(0.5, this.cardPosList[i])
            ));
        }

        for(var i = g_CardListSideSize - 1; i >= 0; --i)
        {
            this.spriteListRight[i].runAction(new cc.sequence(
                new cc.DelayTime(0.5 * (g_CardListSideSize - i - 1) + 0.5 * g_CardListSideSize),
                new cc.FadeIn(0.5)
            ));
        }
    },

    getSelectCardID:function()
    {
        if(this.getCardByIndex(this.curSelectCardIndex) != null)
        {
            return this.getCardByIndex(this.curSelectCardIndex).getCardID();
        }
        return -1;
    },

    onCardTouch:function(card)
    {
        card.onSelected(this.notifyCardChange, this);
    },

    getCardZOrderByOrder:function(order)
    {
        return g_GameZOrder.card + g_CardListSideSize - order;
    },

    getCardOrderByZOrder:function(order)
    {
        return Math.abs(order - g_GameZOrder.card - g_CardListSideSize);
    },

    setCardTopOrder:function(index)
    {
        if(index < g_CardListSideSize)
        {
            switch(index)
            {
                case 0:
                    this.spriteListLeft[0].setLocalZOrder(this.getCardZOrderByOrder(0));
                    this.spriteListLeft[1].setLocalZOrder(this.getCardZOrderByOrder(1));
                    this.spriteListLeft[2].setLocalZOrder(this.getCardZOrderByOrder(2));
                    this.spriteListLeft[3].setLocalZOrder(this.getCardZOrderByOrder(3));
                    break;
                case 1:
                    this.spriteListLeft[0].setLocalZOrder(this.getCardZOrderByOrder(3));
                    this.spriteListLeft[1].setLocalZOrder(this.getCardZOrderByOrder(0));
                    this.spriteListLeft[2].setLocalZOrder(this.getCardZOrderByOrder(1));
                    this.spriteListLeft[3].setLocalZOrder(this.getCardZOrderByOrder(2));
                    break;
                case 2:
                    this.spriteListLeft[0].setLocalZOrder(this.getCardZOrderByOrder(2));
                    this.spriteListLeft[1].setLocalZOrder(this.getCardZOrderByOrder(1));
                    this.spriteListLeft[2].setLocalZOrder(this.getCardZOrderByOrder(0));
                    this.spriteListLeft[3].setLocalZOrder(this.getCardZOrderByOrder(3));
                    break;
                case 3:
                    this.spriteListLeft[0].setLocalZOrder(this.getCardZOrderByOrder(3));
                    this.spriteListLeft[1].setLocalZOrder(this.getCardZOrderByOrder(2));
                    this.spriteListLeft[2].setLocalZOrder(this.getCardZOrderByOrder(1));
                    this.spriteListLeft[3].setLocalZOrder(this.getCardZOrderByOrder(0));
                    break;
            }
        }
        else
        {
            index = index - g_CardListSideSize;
            switch(index)
            {
                case 0:
                    this.spriteListRight[0].setLocalZOrder(this.getCardZOrderByOrder(0));
                    this.spriteListRight[1].setLocalZOrder(this.getCardZOrderByOrder(1));
                    this.spriteListRight[2].setLocalZOrder(this.getCardZOrderByOrder(2));
                    this.spriteListRight[3].setLocalZOrder(this.getCardZOrderByOrder(3));
                    break;
                case 1:
                    this.spriteListRight[0].setLocalZOrder(this.getCardZOrderByOrder(3));
                    this.spriteListRight[1].setLocalZOrder(this.getCardZOrderByOrder(0));
                    this.spriteListRight[2].setLocalZOrder(this.getCardZOrderByOrder(1));
                    this.spriteListRight[3].setLocalZOrder(this.getCardZOrderByOrder(2));
                    break;
                case 2:
                    this.spriteListRight[0].setLocalZOrder(this.getCardZOrderByOrder(2));
                    this.spriteListRight[1].setLocalZOrder(this.getCardZOrderByOrder(1));
                    this.spriteListRight[2].setLocalZOrder(this.getCardZOrderByOrder(0));
                    this.spriteListRight[3].setLocalZOrder(this.getCardZOrderByOrder(3));
                    break;
                case 3:
                    this.spriteListRight[0].setLocalZOrder(this.getCardZOrderByOrder(3));
                    this.spriteListRight[1].setLocalZOrder(this.getCardZOrderByOrder(2));
                    this.spriteListRight[2].setLocalZOrder(this.getCardZOrderByOrder(1));
                    this.spriteListRight[3].setLocalZOrder(this.getCardZOrderByOrder(0));
                    break;
            }
        }
    },
    enableActionCards:function(index, enable)
    {
        if(index >= 0 && index < g_CardListSideSize * 2)
        {
            if(this.getCardByIndex(index) != null)
            {
                this.getCardByIndex(index).setActionEnable(enable);
            }
        }
        else
        {
            for(var i = 0; i < g_CardListSideSize; ++i)
            {
                this.spriteListLeft[i].setActionEnable(enable);
                this.spriteListRight[i].setActionEnable(enable);
            }
        }
    },
})