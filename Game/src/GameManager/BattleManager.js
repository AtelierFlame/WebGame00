/**
 * Created by Administrator on 2015/7/21.
 */
var g_CardListSize = 8;
var g_CardListSideSize = 4;

var BattleActionType =
{
    BAT_Move:0,
    BAT_Defence:1,
    BAT_Attak:2,
    BAT_Skill:3
}

var BattleManager = cc.Class.extend({
    stateMachine:null,

    roundLabel:null,
    cardLayer:null,
    skillLayer:null,
    infoLayer:null,
    performLayer:null,

    openingPerform:false,
    curRoundCount:1,

    cardList:[],
    cardActionSequence:[],
    curSelectCardIndex:0,

    ctor:function()
    {
        this.stateMachine = new StateMachine(this);
        this.cardList = new Array();
    },

    gotoState:function(state)
    {
        this.stateMachine.GotoState(state);
    },

    setCardLayer:function(layer)
    {
        this.cardLayer = layer;
    },

    setSkillLayer:function(layer)
    {
        this.skillLayer = layer;
    },

    setInfoLayer:function(layer)
    {
        this.infoLayer = layer;
    },

    setPerformLayer:function(layer)
    {
        this.performLayer = layer;
    },

    setRoundLabel:function(label)
    {
        this.roundLabel = label;
    },

    setRoundCount:function(count)
    {
        cc.log("Round Start " + count);
        this.roundLabel.setString(count);
    },

    loadCardsData:function()
    {
        // for test
        for(var i = 0; i < g_CardListSize; ++i)
        {
            this.cardList.push(new PlayerCardData());
            this.cardList[i].copy(g_CardList[i + 1]);
        }
    },

    getCardData:function(index)
    {
        if(index < this.cardList.length)
        {
            return this.cardList[index];
        }

        return null;
    },

    readyForBattle:function()
    {
        BattlePreRoundState.GetInstance().setRound(this.curRoundCount);
        this.gotoState(BattlePreRoundState.GetInstance());
    },

    initCardActionSequence:function()
    {
        this.cardActionSequence = new Array();
        var cardSpeedList = new Array();
        for(var i = 0; i < g_CardListSize; ++i)
        {
            this.cardActionSequence.push(i);
            if(this.cardList[i] != null)
            {
                cardSpeedList.push(this.cardList[i].getSpeed());
            }
            else
            {
                cardSpeedList.push(0);
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
            cc.log("round over!");
            return;
        }

        var index = this.cardActionSequence.shift();
        if(this.cardList[index] == null)
        {
            cc.log("round over!");
            return;
        }

        this.curSelectCardIndex = index;
        BattlePreActionState.GetInstance().curCardSprite = this.cardLayer.getCardByIndex(this.curSelectCardIndex);
        this.gotoState(BattlePreActionState.GetInstance());
    },

    notifySelectedCardChange:function(target)
    {
        if(this.cardLayer.getCardOrderByZOrder(target.getLocalZOrder()) != 0)
        {
            this.cardLayer.setCardTopOrder(target.cardIndex);
        }
        if(this.skillLayer != null)
        {
            this.skillLayer.updateWithCard(this.cardList[target.cardIndex].cardID);
        }
        if(this.infoLayer != null)
        {
            this.infoLayer.updateFromCardData(this.cardList[target.cardIndex]);
        }

        this.startBattleAction(0, this.curSelectCardIndex, [this.curSelectCardIndex]);
    },

    startBattleAction:function(type, cardidx, targetidx)
    {
        BattleActionState.GetInstance().setAction(type, cardidx, targetidx);
        this.gotoState(BattleActionState.GetInstance());
    }

});

BattleManager.GetInstance = function()
{
    if(!this.instance)
    {
        this.instance = this.instance || new BattleManager();
    }

    return this.instance;
}
