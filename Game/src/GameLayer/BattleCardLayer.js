/**
 * Created by Administrator on 2015/7/18.
 */
var BattleCardLayer = BaseLayer.extend({
    showBg:true,
    openingPerform:false,
    cardPosList:[],

    spriteListLeft:[],
    spriteListRight:[],

    curRoundCount:1,

    skillpanel:null,
    infopanel:null,
    roundcount:null,

    ctor:function()
    {
        this._super();
    },

    init:function()
    {
        this.initCardPostionList();
        this.spriteListLeft = new Array();
        this.spriteListRight = new Array();

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
                this.spriteListLeft[i].initCardIndex(i);
                if(BattleManager.GetInstance().getCardData(i) != null)
                {
                    this.spriteListLeft[i].initWithFile(
                        g_CardList[BattleManager.GetInstance().getCardData(i).cardID].image);
                    this.spriteListLeft[i].setAnchorPoint(0, 0);
                }
            }

            if(this.spriteListRight[i] != null)
            {
                this.spriteListRight[i].initCardIndex(i + g_CardListSideSize);
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

    setCardByIndex:function(index, card)
    {
        if(index < 0 && index >= g_CardListSize * 2)
        {
            return;
        }

        if(index < g_CardListSideSize)
        {
            this.spriteListLeft[index] = card;
            this.spriteListLeft[index].cardIndex = index;
        }
        else
        {
            this.spriteListRight[index - g_CardListSideSize] = card;
            this.spriteListRight[index - g_CardListSideSize].cardIndex = index - g_CardListSideSize;
        }
    },

    openingPerformance:function()
    {
        for(var i = 0; i < g_CardListSideSize; ++i)
        {
            this.spriteListLeft[i].runAction(new cc.Sequence(
                new cc.DelayTime(0.5 * i),
                new cc.MoveTo(0.5, this.cardPosList[i])
            ));
        }

        for(var i = g_CardListSideSize - 1; i >= 0; --i)
        {
            this.spriteListRight[i].runAction(new cc.Sequence(
                new cc.DelayTime(0.5 * (g_CardListSideSize - i - 1) + 0.5 * g_CardListSideSize),
                new cc.FadeIn(0.5)
            ));
        }
    },

    onCardTouch:function(card)
    {
        switch(card.actionType)
        {
            case BattleActionType.BAT_Move:
                if(card.cardIndex == BattleManager.GetInstance().curSelectCardIndex)
                {
                    break;
                }
                BattleManager.GetInstance().handleMoveAction(card.cardIndex);
                break;

            case BattleActionType.BAT_Attack:
                if(card.cardIndex == BattleManager.GetInstance().curSelectCardIndex)
                {
                    break;
                }
                BattleManager.GetInstance().handleAttackAction(card.cardIndex);
                break;
        }
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
                    this.spriteListLeft[0].changeHealthBarPos(true);
                    this.spriteListLeft[1].setLocalZOrder(this.getCardZOrderByOrder(1));
                    this.spriteListLeft[1].changeHealthBarPos(true);
                    this.spriteListLeft[2].setLocalZOrder(this.getCardZOrderByOrder(2));
                    this.spriteListLeft[2].changeHealthBarPos(true);
                    this.spriteListLeft[3].setLocalZOrder(this.getCardZOrderByOrder(3));
                    this.spriteListLeft[3].changeHealthBarPos(true);
                    break;
                case 1:
                    this.spriteListLeft[0].setLocalZOrder(this.getCardZOrderByOrder(3));
                    this.spriteListLeft[0].changeHealthBarPos(false);
                    this.spriteListLeft[1].setLocalZOrder(this.getCardZOrderByOrder(0));
                    this.spriteListLeft[1].changeHealthBarPos(true);
                    this.spriteListLeft[2].setLocalZOrder(this.getCardZOrderByOrder(1));
                    this.spriteListLeft[2].changeHealthBarPos(true);
                    this.spriteListLeft[3].setLocalZOrder(this.getCardZOrderByOrder(2));
                    this.spriteListLeft[3].changeHealthBarPos(true);
                    break;
                case 2:
                    this.spriteListLeft[0].setLocalZOrder(this.getCardZOrderByOrder(2));
                    this.spriteListLeft[0].changeHealthBarPos(false);
                    this.spriteListLeft[1].setLocalZOrder(this.getCardZOrderByOrder(1));
                    this.spriteListLeft[1].changeHealthBarPos(false);
                    this.spriteListLeft[2].setLocalZOrder(this.getCardZOrderByOrder(0));
                    this.spriteListLeft[2].changeHealthBarPos(true);
                    this.spriteListLeft[3].setLocalZOrder(this.getCardZOrderByOrder(3));
                    this.spriteListLeft[3].changeHealthBarPos(true);
                    break;
                case 3:
                    this.spriteListLeft[0].setLocalZOrder(this.getCardZOrderByOrder(3));
                    this.spriteListLeft[0].changeHealthBarPos(false);
                    this.spriteListLeft[1].setLocalZOrder(this.getCardZOrderByOrder(2));
                    this.spriteListLeft[1].changeHealthBarPos(false);
                    this.spriteListLeft[2].setLocalZOrder(this.getCardZOrderByOrder(1));
                    this.spriteListLeft[2].changeHealthBarPos(false);
                    this.spriteListLeft[3].setLocalZOrder(this.getCardZOrderByOrder(0));
                    this.spriteListLeft[3].changeHealthBarPos(true);
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
                    this.spriteListRight[0].changeHealthBarPos(true);
                    this.spriteListRight[1].setLocalZOrder(this.getCardZOrderByOrder(1));
                    this.spriteListRight[1].changeHealthBarPos(false);
                    this.spriteListRight[2].setLocalZOrder(this.getCardZOrderByOrder(2));
                    this.spriteListRight[2].changeHealthBarPos(false);
                    this.spriteListRight[3].setLocalZOrder(this.getCardZOrderByOrder(3));
                    this.spriteListRight[3].changeHealthBarPos(false);
                    break;
                case 1:
                    this.spriteListRight[0].setLocalZOrder(this.getCardZOrderByOrder(3));
                    this.spriteListRight[0].changeHealthBarPos(true);
                    this.spriteListRight[1].setLocalZOrder(this.getCardZOrderByOrder(0));
                    this.spriteListRight[1].changeHealthBarPos(true);
                    this.spriteListRight[2].setLocalZOrder(this.getCardZOrderByOrder(1));
                    this.spriteListRight[2].changeHealthBarPos(false);
                    this.spriteListRight[3].setLocalZOrder(this.getCardZOrderByOrder(2));
                    this.spriteListRight[3].changeHealthBarPos(false);
                    break;
                case 2:
                    this.spriteListRight[0].setLocalZOrder(this.getCardZOrderByOrder(2));
                    this.spriteListRight[0].changeHealthBarPos(true);
                    this.spriteListRight[1].setLocalZOrder(this.getCardZOrderByOrder(1));
                    this.spriteListRight[1].changeHealthBarPos(true);
                    this.spriteListRight[2].setLocalZOrder(this.getCardZOrderByOrder(0));
                    this.spriteListRight[2].changeHealthBarPos(true);
                    this.spriteListRight[3].setLocalZOrder(this.getCardZOrderByOrder(3));
                    this.spriteListRight[3].changeHealthBarPos(false);
                    break;
                case 3:
                    this.spriteListRight[0].setLocalZOrder(this.getCardZOrderByOrder(3));
                    this.spriteListRight[0].changeHealthBarPos(true);
                    this.spriteListRight[1].setLocalZOrder(this.getCardZOrderByOrder(2));
                    this.spriteListRight[1].changeHealthBarPos(true);
                    this.spriteListRight[2].setLocalZOrder(this.getCardZOrderByOrder(1));
                    this.spriteListRight[2].changeHealthBarPos(true);
                    this.spriteListRight[3].setLocalZOrder(this.getCardZOrderByOrder(0));
                    this.spriteListRight[3].changeHealthBarPos(true);
                    break;
            }
        }
    },

    initNonActionCards:function(curindex)
    {
        for(var i = 0; i < g_CardListSideSize; ++i)
        {
            if(curindex >= g_CardListSideSize)
            {
                if(i + g_CardListSideSize == curindex)
                {
                    this.spriteListLeft[i].setActionEnable(false);
                    continue;
                }
            }
            else
            {
                if(i == curindex)
                {
                    this.spriteListRight[i].setActionEnable(false);
                    continue;
                }
            }

            this.spriteListLeft[i].setActionEnable(false);
            this.spriteListRight[i].setActionEnable(false);
        }
    },

    enableActionCards:function(index, enable)
    {
        if(index >= 0 && index < g_CardListSize)
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

    notifyIndexChange:function(idx, targetidx)
    {
        var card = this.getCardByIndex(idx);
        var targetcard = this.getCardByIndex(targetidx);

        this.setCardByIndex(targetidx, card);
        this.setCardByIndex(idx, targetcard);

        var targetpos =  targetcard.getPosition();
        targetcard.setPosition(card.getPosition());
        card.setPosition(targetpos);

        this.setCardTopOrder(targetidx);
    },

    hintMoveAction:function(cardIdx, targetIdxArray)
    {
        if(this.getCardByIndex(cardIdx) != null)
        {
            this.getCardByIndex(cardIdx).setActionEnable(false);
        }

        for(var i = 0; i < targetIdxArray.length; ++i)
        {
            if(this.getCardByIndex(targetIdxArray[i]) != null)
            {
                this.getCardByIndex(targetIdxArray[i]).setSelectable(BattleActionType.BAT_Move);
            }
        }
    },

    hintAttackAction:function(cardIdx, targetIdxArray)
    {
        for(var i = 0; i < targetIdxArray.length; ++i)
        {
            if(this.getCardByIndex(targetIdxArray[i]) != null)
            {
                this.getCardByIndex(targetIdxArray[i]).setSelectable(BattleActionType.BAT_Attack);
            }
        }
    }
})