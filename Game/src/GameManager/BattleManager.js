/**
 * Created by flamehaze on 2015/7/21.
 */
var g_CardListSize = 8;
var g_CardListSideSize = 4;

var g_MaxRoundCount = 8;

/**
 * Card Index
 * 3 2 1 0 | 4 5 6 7
 */

if(typeof BattleActionType == "undefined")
{
    var BattleActionType =
    {
        BAT_None:0,
        BAT_Move:1,
        BAT_Defence:2,
        BAT_HintAttack:3,
        BAT_Attack:4,
        BAT_HintSkill:5,
        BAT_Skill:6,
    }
}

if(typeof BattleEffectType == "undefined")
{
    var BattleEffectType =
    {
        BET_None:0,
        BET_Dead:1,
        BET_Revive:2,
    }
}

var BattleEffect = cc.Class.extend({
    type:BattleEffectType.BET_None,
    index:0
})

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
    curEffectCommand:[],

    targetSelectableCards:[],
    targetSelectedCards:[],

    curSkillData:null,

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
            var card = new PlayerCardData();
            this.cardList.push(card);
            this.cardList[i].init(g_CardList[i + 1]);

            this.cardList[i].setIndex(i);
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
            if(this.cardList[i] != null && !this.cardList[i].isDead())
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

    removeFromCardSequence:function(index)
    {
        for(var i = 0; i < this.cardActionSequence.length; ++i)
        {
            if(this.cardActionSequence[i] == index)
            {
                this.cardActionSequence.splice(i, 1);
                return;
            }
        }
    },

    isEnemyCard:function(index)
    {
        return index >= g_CardListSideSize;
    },

    selectNextCard:function()
    {
        this.cardLayer.refreshCardsState();
        this.clearEffectCommand();

        if(this.cardActionSequence.length == 0)
        {
            this.roundOver();
            return;
        }

        var index = this.cardActionSequence.shift();
        if(this.cardList[index] == null || this.cardList[index].isDead())
        {
            this.roundOver();
            return;
        }

        this.curSelectCardIndex = index;
        BattlePreActionState.GetInstance().curCardSprite = this.cardLayer.getCardByIndex(this.curSelectCardIndex);
        this.gotoState(BattlePreActionState.GetInstance());
    },

    roundOver:function()
    {
        cc.log("Round " + this.curRoundCount + " Over");
        if(this.curRoundCount >= g_MaxRoundCount)
        {
            cc.log("BattleOver");
        }
        this.curRoundCount++;
        this.readyForBattle();
    },

    clearEffectCommand:function()
    {
        this.curEffectCommand = [];
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
            this.skillLayer.updateWithCard(target.cardIndex, this.cardList[target.cardIndex]);
        }
        if(this.infoLayer != null)
        {
            this.infoLayer.updateFromCardData(this.cardList[target.cardIndex]);
        }
    },

    startBattleAction:function(type, cardidx, targetidx, res)
    {
        this.skillLayer.disableActionOrder();

        BattleActionState.GetInstance().setAction(type, cardidx, targetidx, res);
        this.gotoState(BattleActionState.GetInstance());
    },

    notifyIndexChange:function(idx, targetidx)
    {
        if(idx == targetidx)
        {
            return;
        }

        var cardData = this.cardList[targetidx];
        this.cardList[targetidx] = this.cardList[idx];
        this.cardList[targetidx].setIndex(targetidx);
        this.cardList[idx] = cardData;
        this.cardList[idx].setIndex(idx);

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
        return this.getRangePosition(index, minrange, maxrange, false, true);
    },

    getSkillRangePosition:function(index, skill)
    {
        if(this.cardList[index] == null)
        {
            return [];
        }

        var minrange = skill.minRange;
        var maxrange = skill.maxRange;
        var side = skill.friendly;

        return this.getRangePosition(index, minrange, maxrange, side, true);
    },

    getRangePosition:function(index, minrange, maxrange, bSameSide, checkDead)
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
                            if(checkDead && !this.cardList[right].isDead())
                            {
                                ar.push(right);
                            }
                        }
                    }

                    if(index + i < g_CardListSideSize)
                    {
                        var left = this.getCardIndexOffset(index, i, true);

                        if(left >= 0 && this.cardList[left] != null)
                        {
                            if(checkDead && !this.cardList[right].isDead())
                            {
                                ar.push(left);
                            }
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
                            if(checkDead && !this.cardList[right].isDead())
                            {
                                ar.push(right);
                            }
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
                            if(checkDead && !this.cardList[right].isDead())
                            {
                                ar.push(right);
                            }
                        }
                    }

                    if(index - i >= g_CardListSideSize)
                    {
                        var left = this.getCardIndexOffset(index, i, true);

                        if(left >= 0 && this.cardList[left] != null)
                        {
                            if(checkDead && !this.cardList[right].isDead())
                            {
                                ar.push(left);
                            }
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

    getCardDistance:function(index1, index2)
    {
        if(index1 < g_CardListSideSize && index2 < g_CardListSideSize)
        {
            return Math.abs(index1 - index2);
        }
        else if(index1 >= g_CardListSideSize && index2 >= g_CardListSideSize)
        {
            return Math.abs(index1 - index2);
        }
        else if(index1 < g_CardListSideSize)
        {
            return Math.abs(index1) + Math.abs(index2 - g_CardListSize) + 1;
        }
        else
        {
            return Math.abs(index2) + Math.abs(index1 - g_CardListSize) + 1;
        }
        return g_CardListSize;
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

    excuteAICommand:function(actiontype, targets)
    {
        switch(actiontype)
        {
            case BattleActionType.BAT_Attack:
                this.handleAttackAction(targets);
                break;
        }
    },

    handleHintAttackAction:function()
    {
        this.cardLayer.initNonActionCards(this.curSelectCardIndex);

        this.targetSelectableCards = this.getAttackRangePosition(this.curSelectCardIndex);
        this.cardLayer.hintAttackAction(this.curSelectCardIndex, this.targetSelectableCards);

        this.curSkillData = null;
    },

    handleAttackAction:function(targetIdx)
    {
        for(var i = 0; i < this.targetSelectedCards.length; ++i)
        {
            if(this.targetSelectedCards[i] == targetIdx)
            {
                return;
            }
        }

        this.targetSelectedCards.push(targetIdx);

        var card = this.cardList[this.curSelectCardIndex];
        if(this.targetSelectableCards.length == this.targetSelectedCards.length ||
            this.targetSelectedCards.length == card.getAttackTargetCount())
        {
            var res = [];
            for(var i = 0; i < this.targetSelectedCards.length; ++i)
            {
                res.push(this.getAttackResult(this.targetSelectedCards[i]));
            }
            this.startBattleAction(BattleActionType.BAT_Attack,
                this.curSelectCardIndex,
                this.targetSelectedCards,
                res
            );

            this.targetSelectableCards = [];
            this.targetSelectedCards = [];
        }
        else
        {
            this.cardLayer.selectAttackAction(targetIdx);
        }
    },

    cancelAttackAction:function(targetIdx)
    {
        for(var i = 0; i < this.targetSelectedCards.length; ++i)
        {
            if(this.targetSelectedCards[i] == targetIdx)
            {
                this.targetSelectedCards.splice(i--, 1);
                this.cardLayer.cancelAttackAction(targetIdx);
            }
        }
    },

    getAttackResult:function(targetIdx)
    {
        var card = this.cardList[this.curSelectCardIndex];
        var target = this.cardList[targetIdx];

        if(card != null && target != null)
        {
            var ratio = card.getHitRatio(target.getDexterity());
            cc.log("Hit Ratio " + ratio);
            if(Math.random() > ratio)
            {
                // miss
                return -1;
            }

            var damage = card.getAttackValue();
            var defmod = target.getDamageReduction();

            var res = Math.round(damage * (1 - defmod));
            this.cardList[targetIdx].takeDamage(res);

            return res;
        }

        return -1;
    },

    handleHintMoveAction:function(card)
    {
        this.cardLayer.initNonActionCards(this.curSelectCardIndex);

        this.cardLayer.hintMoveAction(this.curSelectCardIndex,
            this.getMoveablePosition(this.curSelectCardIndex));

        this.curSkillData = null;
    },

    handleMoveAction:function(targetIdx)
    {
        this.startBattleAction(BattleActionType.BAT_Move,
            this.curSelectCardIndex,
            [targetIdx],
            []
        );
    },

    handleDefenceAction:function(card)
    {
        this.cardLayer.initNonActionCards(this.curSelectCardIndex);
        this.startBattleAction(BattleActionType.BAT_Defence,
            this.curSelectCardIndex,
            [],
            []
        );

        this.curSkillData = null;
    },

    handleHintSkillAction:function(target)
    {
        var card = this.cardList[this.curSelectCardIndex];
        if(card.lightskill.length > target.getIndex())
        {
            this.curSkillData = card.lightskill[target.getIndex()];
            this.cardLayer.initNonActionCards(this.curSelectCardIndex);
            this.targetSelectableCards = this.getSkillRangePosition(this.curSelectCardIndex, this.curSkillData);

            this.cardLayer.hintSkillAction(this.curSelectCardIndex, this.targetSelectableCards);
        }
    },

    cancelSkillAction:function(targetIdx)
    {
        for(var i = 0; i < this.targetSelectedCards.length; ++i)
        {
            if(this.targetSelectedCards[i] == targetIdx)
            {
                this.targetSelectedCards.splice(i--, 1);
                this.cardLayer.cancelSkillAction(targetIdx);
            }
        }
    },

    handleSkillAction:function(targetIdx)
    {
        if(this.curSkillData != null)
        {
            for(var i = 0; i < this.targetSelectedCards.length; ++i)
            {
                if(this.targetSelectedCards[i] == targetIdx)
                {
                    return;
                }
            }

            this.targetSelectedCards.push(targetIdx);

            if(this.targetSelectableCards.length == this.targetSelectedCards.length ||
                this.targetSelectedCards.length == this.curSkillData.targetcount)
            {
                var res = [];
                for(var i = 0; i < this.targetSelectedCards.length; ++i)
                {
                    res.push(0);
                }
                this.startBattleAction(BattleActionType.BAT_Skill,
                    this.curSelectCardIndex,
                    this.targetSelectedCards,
                    res
                );

                this.targetSelectableCards = [];
                this.targetSelectedCards = [];
            }
            else
            {
                this.cardLayer.selectSkillAction(targetIdx);
            }
        }
    },

    addEffectCommand:function(type, index)
    {
        if(this.cardList[index] != null)
        {
            var cmd = new BattleEffect();
            cmd.type = type;
            cmd.index = index;

            this.curEffectCommand.push(cmd);
        }
    },

    notifyEffectCommand:function()
    {
        for(var i = 0; i < this.curEffectCommand.length; ++i)
        {
            var cmd = this.curEffectCommand[i];
            switch(cmd.type)
            {
                case BattleEffectType.BET_None:
                    break;

                case BattleEffectType.BET_Dead:
                    this.cardLayer.notifyCardDead(cmd.index);
                    this.popCard(cmd.index);
                    break;
            }
        }
    },

    notifyCardDead:function(index)
    {
        this.addEffectCommand(BattleEffectType.BET_Dead, index);
        this.removeFromCardSequence(index);
    },

    popCard:function(index)
    {
        if(this.cardList[index] != null)
        {
            if(index < g_CardListSideSize)
            {
                for(var i = index + 1; i < g_CardListSideSize; ++i)
                {
                    if(this.cardList[i] == null)
                    {
                        return;
                    }

                    this.notifyIndexChange(index, i);
                    ++index;
                }
            }
            else
            {
                for(var i = index + 1; i < g_CardListSize; ++i)
                {
                    if(this.cardList[i] == null)
                    {
                        return;
                    }

                    this.notifyIndexChange(index, i);
                    ++index;
                }
            }
        }
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
