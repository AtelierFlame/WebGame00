/**
 * Created by Administrator on 2015/7/21.
 */
var g_CardListSize = 8;
var g_CardListSideSize = 4;

if(typeof BattleActionType == "undefined")
{
    var BattleActionType =
    {
        BAT_Move:0,
        BAT_Defence:1,
        BAT_Attack:2,
        BAT_Skill:3
    }
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

    notifyActionCardChange:function(target)
    {
        if(this.cardLayer.getCardOrderByZOrder(target.getLocalZOrder()) != 0)
        {
            this.cardLayer.setCardTopOrder(target.cardIndex);

            this.handleHintAttackAction();
        }
        if(this.skillLayer != null)
        {
            this.skillLayer.updateWithCard(target.cardIndex, this.cardList[target.cardIndex].cardID);
        }
        if(this.infoLayer != null)
        {
            this.infoLayer.updateFromCardData(this.cardList[target.cardIndex]);
        }
    },

    startBattleAction:function(type, cardidx, targetidx, res)
    {
        this.skillLayer.disableActionOrder();
        if(cardidx == 1)
        {
            BattleActionState.GetInstance().setAction(type, cardidx, targetidx, res);
            this.gotoState(BattleActionState.GetInstance());
        }
    },

    notifyIndexChange:function(idx, targetidx)
    {
        if(idx == targetidx)
        {
            return;
        }

        var cardData = this.cardList[targetidx];
        this.cardList[targetidx] = this.cardList[idx];
        this.cardList[idx] = cardData;

        for(var i = 0; i < this.cardActionSequence.length; ++i)
        {
            if(this.cardActionSequence[i] == idx)
            {
                this.cardActionSequence[i] = targetidx;
            }
            if(this.cardActionSequence[i] == targetidx)
            {
                this.cardActionSequence[i] = idx;
            }
        }

        this.cardLayer.notifyIndexChange(idx, targetidx);
    },

    getMoveablePosition:function(index)
    {
        if(this.cardList[index] == null)
        {
            return [];
        }

        var moveable = new Array();
        if(index < g_CardListSideSize)
        {
            if(index - 1 >= 0 && this.cardList[index - 1] != null)
            {
                moveable.push(index - 1);
            }

            if(index + 1 < g_CardListSideSize && this.cardList[index + 1] != null)
            {
                moveable.push(index + 1);
            }
        }
        else
        {
            if(index - 1 >= g_CardListSideSize && this.cardList[index - 1] != null)
            {
                moveable.push(index - 1);
            }

            if(index + 1 < g_CardListSize && this.cardList[index + 1] != null)
            {
                moveable.push(index + 1);
            }
        }

        return moveable;
    },

    getAttackRangePosition:function(index)
    {
        if(this.cardList[index] == null)
        {
            return [];
        }

        var minrange = this.cardList[index].getMinRange();
        var maxrange = this.cardList[index].getMaxRange();
        return this.getRangePosition(index, minrange, maxrange, false);
    },

    getRangePosition:function(index, minrange, maxrange, bSameSide)
    {
        var ar = new Array();
        if(index < g_CardListSideSize)
        {
            if(bSameSide)
            {
                for(var i = minrange; i <= maxrange; ++i)
                {
                    if(index - i >= 0)
                    {
                        var right = this.getCardIndexOffset(index, i, false);

                        if(right >= 0 && this.cardList[right] != null)
                        {
                            ar.push(right);
                        }
                    }

                    if(index + i < g_CardListSideSize)
                    {
                        var left = this.getCardIndexOffset(index, i, true);

                        if(left >= 0 && this.cardList[left] != null)
                        {
                            ar.push(left);
                        }
                    }
                }
            }
            else
            {
                for(var i = minrange; i <= maxrange; ++i)
                {
                    if(index - i < 0)
                    {
                        var right = this.getCardIndexOffset(index, i, false);

                        if(right >= 0 && this.cardList[right] != null)
                        {
                            ar.push(right);
                        }
                    }
                }
            }
        }
        else
        {
            if(bSameSide)
            {
                for(var i = minrange; i <= maxrange; ++i)
                {
                    if(index + i < g_CardListSize)
                    {
                        var right = this.getCardIndexOffset(index, i, false);

                        if(right >= 0 && this.cardList[right] != null)
                        {
                            ar.push(right);
                        }
                    }

                    if(index - i >= g_CardListSideSize)
                    {
                        var left = this.getCardIndexOffset(index, i, true);

                        if(left >= 0 && this.cardList[left] != null)
                        {
                            ar.push(left);
                        }
                    }
                }
            }
            else
            {
                for(var i = minrange; i <= maxrange; ++i)
                {
                    if(index - i < g_CardListSideSize)
                    {
                        var left = this.getCardIndexOffset(index, i, true);

                        if(left >= 0 && this.cardList[left] != null)
                        {
                            ar.push(left);
                        }
                    }
                }
            }
        }

        return ar;
    },

    getCardIndexOffset:function(index, offset, bLeft)
    {
        if(index < g_CardListSideSize)
        {
            if(!bLeft)
            {
                if(index - offset > 0)
                {
                    return index - offset;
                }
                else
                {
                    if(offset - index <= g_CardListSideSize)
                    {
                        return offset - index + g_CardListSideSize - 1;
                    }
                }
            }
            else
            {
                if(index + offset < g_CardListSideSize)
                {
                    return index + offset;
                }
            }
        }
        else
        {
            if(bLeft)
            {
                if(index - offset >= g_CardListSideSize)
                {
                    return index - offset;
                }
                else if(index - offset >= 0)
                {
                    return g_CardListSideSize - 1 - (index - offset);

                }
            }
            else
            {
                if(index + offset < g_CardListSize)
                {
                    return index + offset;
                }
            }
        }

        return -1;
    },

    handleHintAttackAction:function()
    {
        this.cardLayer.initNonActionCards(this.curSelectCardIndex);

        this.cardLayer.hintAttackAction(this.curSelectCardIndex,
            this.getAttackRangePosition(this.curSelectCardIndex));
    },

    handleAttackAction:function(targetIdx)
    {
        var res = this.checkAttackResult(targetIdx);
        this.startBattleAction(BattleActionType.BAT_Attack,
            this.curSelectCardIndex,
            [targetIdx],
            [res]
        );
    },

    checkAttackResult:function(targetIdx)
    {
        var card = this.cardList[this.curSelectCardIndex];
        var target = this.cardList[targetIdx];

        if(card != null && target != null)
        {
            var ratio = card.getHitRatio(target.getDexterity());

            //return Math.random() <= ratio;
        }

        return false;
    },

    handleHintMoveAction:function(card)
    {
        this.cardLayer.initNonActionCards(this.curSelectCardIndex);

        this.cardLayer.hintMoveAction(this.curSelectCardIndex,
            this.getMoveablePosition(this.curSelectCardIndex));
    },

    handleMoveAction:function(targetIdx)
    {
        this.startBattleAction(BattleActionType.BAT_Move,
            this.curSelectCardIndex,
            [targetIdx],
            [true]
        );
    },

    handleDefenceAction:function(card)
    {
        this.cardLayer.initNonActionCards(this.curSelectCardIndex);
        this.startBattleAction(BattleActionType.BAT_Defence,
            this.curSelectCardIndex,
            [],
            [true]
        );
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
