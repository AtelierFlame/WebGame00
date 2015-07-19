/**
 * Created by Administrator on 2015/7/18.
 */
var g_BattleCardListCount = 4;

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

        for(var i = 0; i < g_BattleCardListCount; ++i)
        {
            // left sprites
            this.spriteListLeft.push(new BattleCardSprite());
            this.spriteListLeft[i].setScale(0.7, 0.7);
            if(this.openingPerform)
            {
                this.spriteListLeft[i].setPosition(-200, 140);
            }
            else
            {
                this.spriteListLeft[i].setPosition(this.cardPosList[i]);
            }
            this.spriteListLeft[i].initTouchCallBack(this.onCardTouch, this);
            this.addChild(this.spriteListLeft[i], g_GameZOrder.card + g_BattleCardListCount - i);

            // right sprites
            this.spriteListRight.push(new BattleCardSprite());
            this.spriteListRight[i].setScale(0.7, 0.7);
            this.spriteListRight[i].setPosition(this.cardPosList[i + g_BattleCardListCount]);
            if(this.openingPerform)
            {
                this.spriteListRight[i].setOpacity(0);
            }
            this.spriteListRight[i].initTouchCallBack(this.onCardTouch, this);
            this.addChild(this.spriteListRight[i], g_GameZOrder.card + g_BattleCardListCount - i);
        }

        this.statemachine.GotoState(BattleStartState.GetInstance());
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

    initCards:function()
    {
        this.spriteListLeft[0].cardData = new PlayerCardData();
        this.spriteListLeft[0].cardIndex = 0;
        this.spriteListLeft[0].setCardID(1);
        this.spriteListLeft[0].isplayer = true;
        this.spriteListLeft[0].cardData.copy(g_CardList[this.spriteListLeft[0].getCardID()]);

        this.spriteListLeft[1].cardData = new PlayerCardData();
        this.spriteListLeft[1].cardIndex = 1;
        this.spriteListLeft[1].setCardID(2);
        this.spriteListLeft[1].isplayer = true;
        this.spriteListLeft[1].cardData.copy(g_CardList[this.spriteListLeft[1].getCardID()]);

        this.spriteListLeft[2].cardData = new PlayerCardData();
        this.spriteListLeft[2].cardIndex = 2;
        this.spriteListLeft[2].setCardID(3);
        this.spriteListLeft[2].isplayer = true;
        this.spriteListLeft[2].cardData.copy(g_CardList[this.spriteListLeft[2].getCardID()]);

        this.spriteListLeft[3].cardData = new PlayerCardData();
        this.spriteListLeft[3].cardIndex = 3;
        this.spriteListLeft[3].setCardID(4);
        this.spriteListLeft[3].isplayer = true;
        this.spriteListLeft[3].cardData.copy(g_CardList[this.spriteListLeft[3].getCardID()]);

        this.spriteListRight[0].cardData = new PlayerCardData();
        this.spriteListRight[0].cardIndex = 4;
        this.spriteListRight[0].setCardID(5);
        this.spriteListRight[0].isplayer = false;
        this.spriteListRight[0].cardData.copy(g_CardList[this.spriteListRight[0].getCardID()]);

        this.spriteListRight[1].cardData = new PlayerCardData();
        this.spriteListRight[1].cardIndex = 5;
        this.spriteListRight[1].setCardID(6);
        this.spriteListRight[1].isplayer = false;
        this.spriteListRight[1].cardData.copy(g_CardList[this.spriteListRight[1].getCardID()]);

        this.spriteListRight[2].cardData = new PlayerCardData();
        this.spriteListRight[2].cardIndex = 6;
        this.spriteListRight[2].setCardID(7);
        this.spriteListRight[2].isplayer = false;
        this.spriteListRight[2].cardData.copy(g_CardList[this.spriteListRight[2].getCardID()]);

        this.spriteListRight[3].cardData = new PlayerCardData();
        this.spriteListRight[3].cardIndex = 7;
        this.spriteListRight[3].setCardID(8);
        this.spriteListRight[3].isplayer = false;
        this.spriteListRight[3].cardData.copy(g_CardList[this.spriteListRight[3].getCardID()]);


        this.skillpanel.updateWithCard(this.getSelectCardID());
    },

    refreshCards:function()
    {
        for(var i = 0; i < g_BattleCardListCount; ++i)
        {
            if(this.spriteListLeft[i] != null)
            {
                if(g_CardList[this.spriteListLeft[i].getCardID()] != null)
                {
                    this.spriteListLeft[i].initWithFile(g_CardList[this.spriteListLeft[i].getCardID()].image);
                    this.spriteListLeft[i].setAnchorPoint(0, 0);
                }
            }

            if(this.spriteListRight[i] != null)
            {
                if(g_CardList[this.spriteListRight[i].getCardID()] != null)
                {
                    this.spriteListRight[i].initWithFile(g_CardList[this.spriteListRight[i].getCardID()].image);
                    this.spriteListRight[i].setAnchorPoint(1, 0);
                }
            }
        }
    },

    getCardByIndex:function(index)
    {
        if(index < 0 && index >= g_BattleCardListCount * 2)
        {
            return null;
        }
        if(index < g_BattleCardListCount)
        {
            return this.spriteListLeft[index];
        }
        else
        {
            return this.spriteListRight[index - g_BattleCardListCount];
        }
    },

    openingPerformance:function()
    {
        for(var i = 0; i < g_BattleCardListCount; ++i)
        {
            this.spriteListLeft[i].runAction(new cc.sequence(
                new cc.DelayTime(0.5 * i),
                new cc.MoveTo(0.5, this.cardPosList[i])
            ));
        }

        for(var i = g_BattleCardListCount - 1; i >= 0; --i)
        {
            this.spriteListRight[i].runAction(new cc.sequence(
                new cc.DelayTime(0.5 * (g_BattleCardListCount - i - 1) + 0.5 * g_BattleCardListCount),
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
        return g_GameZOrder.card + g_BattleCardListCount - order;
    },

    getCardOrderByZOrder:function(order)
    {
        return Math.abs(order - g_GameZOrder.card - g_BattleCardListCount);
    },

    notifyCardChange:function(target)
    {
        if(this.getCardOrderByZOrder(target.getLocalZOrder()) != 0)
        {
            this.setCardTopOrder(target.cardIndex);
        }
        if(this.skillpanel != null)
        {
            this.skillpanel.updateWithCard(target.cardID);
        }
    },

    setCardTopOrder:function(index)
    {
        if(index < g_BattleCardListCount)
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
            index = index - g_BattleCardListCount;
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

    setRoundCount:function(round)
    {
        cc.log("Round Start " + round);
        this.roundcount.setString(round);
    },

    notifyBattleStart:function()
    {
        BattlePreRoundState.GetInstance().setRound(this.curRoundCount);
        this.statemachine.GotoState(BattlePreRoundState.GetInstance());
    },

    initCardActionSequence:function()
    {
        this.cardActionSequence = new Array();
        var cardSpeedList = new Array();
        for(var i = 0; i < g_BattleCardListCount * 2; ++i)
        {
            this.cardActionSequence.push(i);
            if(i < g_BattleCardListCount)
            {
                if(this.spriteListLeft[i].getCardID() > 0)
                {
                    cardSpeedList.push(this.spriteListLeft[i].cardData.getSpeed());
                }
                else
                {
                    cardSpeedList.push(0);
                }
            }
            else
            {
                if(this.spriteListRight[i - g_BattleCardListCount].getCardID() > 0)
                {
                    cardSpeedList.push(this.spriteListRight[i - g_BattleCardListCount].cardData.getSpeed());
                }
                else
                {
                    cardSpeedList.push(0);
                }
            }
        }

        cc.assert(this.cardActionSequence.length == cardSpeedList.length);
        for(var i = 0; i < this.cardActionSequence.length; ++i )
        {
            for(var j = i; j < this.cardActionSequence.length; ++j)
            {
                if(cardSpeedList[i] < cardSpeedList[j])
                {
                    var temp = cardSpeedList[i];
                    cardSpeedList[i] = cardSpeedList[j];
                    cardSpeedList[j] = temp;

                    var tempIdx = this.cardActionSequence[i];
                    this.cardActionSequence[i] = this.cardActionSequence[j];
                    this.cardActionSequence[j] = tempIdx;
                }
            }
        }
    },

    selectNextCard:function()
    {
        if(this.cardActionSequence.length == 0)
        {
            return;
        }

        var index = this.cardActionSequence.shift();
        if(this.getCardByIndex(index).getCardID() <= 0)
        {
            cc.log("round over!");
        }
        else
        {
            this.curSelectCardIndex = index;
            BattlePreActionState.GetInstance().curCard = this.getCardByIndex(this.curSelectCardIndex);
            this.statemachine.GotoState(BattlePreActionState.GetInstance());
        }
    },

    enableActionCards:function(index, enable)
    {
        if(index >= 0 && index < g_BattleCardListCount * 2)
        {
            if(this.getCardByIndex(index) != null)
            {
                this.getCardByIndex(index).setActionEnable(enable);
            }
        }
        else
        {
            for(var i = 0; i < g_BattleCardListCount; ++i)
            {
                this.spriteListLeft[i].setActionEnable(enable);
                this.spriteListRight[i].setActionEnable(enable);
            }
        }
    },
})