/**
 * Created by Administrator on 2015/7/22.
 */
var BattlePerformLayer = BaseLayer.extend({
    showBg:true,
    canTouch:true,

    shield:null,
    attack:[],
    buff:[],
    debuff:[],

    cardPosList:[],
    performSprite:[],

    result0:null,
    result1:null,

    ctor:function()
    {
        this._super();

        this.initCardPostionList();

        this.performSprite.push(new CardPerformSprite());
        this.addChild(this.performSprite[0], g_GameZOrder.card);

        this.shield = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("shield.png"));
        this.shield.setAnchorPoint(0.5, 0.5);
        this.shield.setOpacity(0);
        this.addChild(this.shield, g_GameZOrder.ui);

        this.result0 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("effectbg.png"));
        this.result0.setContentSize(256, 256);
    },

    initAttackEffect:function()
    {
        var eff = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("effectbg.png"));
        eff.setAnchorPoint(0.5, 0.5);
        eff.setOpacity(0);
        this.shaderBlackAlpha(eff);
        eff.setScale(1.5);
        this.addChild(eff, g_GameZOrder.ui);

        this.attack.push(eff);
    },

    initDebuffEffect:function()
    {
        var eff = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("effectbg.png"));
        eff.setAnchorPoint(0.5, 0.5);
        eff.setOpacity(0);
        this.shaderBlackAlpha(eff);
        eff.setScale(1.5);
        this.addChild(eff, g_GameZOrder.ui);

        this.debuff.push(eff);
    },

    initCardPostionList:function()
    {
        this.cardPosList.push(cc.p(200, 120));
        this.cardPosList.push(cc.p(150, 120));
        this.cardPosList.push(cc.p(100, 120));
        this.cardPosList.push(cc.p( 50, 120));
        this.cardPosList.push(cc.p(600, 120));
        this.cardPosList.push(cc.p(650, 120));
        this.cardPosList.push(cc.p(700, 120));
        this.cardPosList.push(cc.p(750, 120));
    },

    setCardSprite:function(index)
    {
        var cardid = BattleManager.GetInstance().getCardData(index).cardID;

        this.performSprite[0].initWithFile(g_CardList[cardid].image);
        if(index < g_CardListSideSize)
        {
            this.performSprite[0].setAnchorPoint(0, 0);
        }
        else
        {
            this.performSprite[0].setAnchorPoint(1, 0);
        }
        this.performSprite[0].setPosition(this.cardPosList[index]);
        this.performSprite[0].cardIndex = index;
        this.performSprite[0].setVisible(true);
    },

    setTargetCardSprites:function(targets)
    {
        for(var i = 0; i < targets.length; ++i)
        {
            if(this.performSprite.length <= i + 1)
            {
                this.performSprite.push(new CardPerformSprite());
                this.addChild(this.performSprite[i + 1], g_GameZOrder.card - 1);
            }

            var cardid = BattleManager.GetInstance().getCardData(targets[i]).cardID;
            this.performSprite[i + 1].initWithFile(g_CardList[cardid].image);
            if(targets[i] >= g_CardListSideSize)
            {
                this.performSprite[i + 1].setAnchorPoint(1, 0);
            }
            else
            {
                this.performSprite[i + 1].setAnchorPoint(0, 0);
            }
            this.performSprite[i + 1].setPosition(this.cardPosList[targets[i]]);
            this.performSprite[i + 1].cardIndex = targets[i];
            this.performSprite[i + 1].setVisible(true);
        }
    },

    getPerformSpriteByCardIndex:function(index)
    {
        for(var i = 0; i < this.performSprite.length; ++i)
        {
            if(this.performSprite[i].cardIndex == index)
            {
                return this.performSprite[i];
            }
        }

        return null;
    },

    changePosition:function(index, targetidx)
    {
        var self = this.getPerformSpriteByCardIndex(index);
        var target = this.getPerformSpriteByCardIndex(targetidx);

        if(self != null && target != null)
        {
            self.runAction(new cc.MoveTo(0.8, target.getPosition()));
            target.runAction(new cc.MoveTo(0.8, self.getPosition()));
            return 800;
        }

        return 1;
    },

    setupDefenceEffect:function(index)
    {
        var self = this.getPerformSpriteByCardIndex(index);
        if(index < g_CardListSideSize)
        {
            this.shield.setPosition(self.getPosition().x + self.getContentSize().width / 2,
                self.getPosition().y + 50);
        }
        else
        {
            this.shield.setPosition(self.getPosition().x - self.getContentSize().width / 2,
                self.getPosition().y + 50);
        }

        var action = new cc.Sequence(
            new cc.Spawn(new cc.FadeIn(0.4), new cc.MoveBy(0.4, 0, 100)),
            new cc.Spawn(new cc.FadeOut(0.4), new cc.MoveBy(0.4, 0, 100))
        );

        this.shield.runAction(action);

        return 800;
    },

    setupMeleeAttackEffect:function(targetArr, resArr)
    {
        for(var i = 0; i < targetArr.length; ++i)
        {
            if(this.attack.length < i + 1)
            {
                this.initAttackEffect();
            }

            this.attack[i].setOpacity(255);
            var target = this.getPerformSpriteByCardIndex(targetArr[i]);
            if(targetArr[i] < g_CardListSideSize)
            {
                this.attack[i].setPosition(target.getPosition().x + target.getContentSize().width / 2,
                    target.getPosition().y + 125);

                this.attack[i].setFlippedX(true);
                target.notifyAttacked(true, resArr[i] >= 0 ? true : false);
            }
            else
            {
                this.attack[i].setPosition(target.getPosition().x - target.getContentSize().width / 2,
                    target.getPosition().y + 125);

                this.attack[i].setFlippedX(false);
                target.notifyAttacked(false, resArr[i] >= 0 ? true : false);
            }

            this.initPerformEffect(this.attack[i], "attackeffect", 7, 0.7, 1);
        }

        return 1200;
    },

    setupSkillAttackEffect:function(targetArr, resArr)
    {
        for(var i = 0; i < targetArr.length; ++i)
        {
            if(this.debuff.length < i + 1)
            {
                this.initDebuffEffect();
            }

            this.debuff[i].setOpacity(255);
            var target = this.getPerformSpriteByCardIndex(targetArr[i]);
            if(targetArr[i] < g_CardListSideSize)
            {
                this.debuff[i].setPosition(target.getPosition().x + target.getContentSize().width / 2,
                    target.getPosition().y + 125);

                //target.notifyAttacked(true, resArr[i]);
            }
            else
            {
                this.debuff[i].setPosition(target.getPosition().x - target.getContentSize().width / 2,
                    target.getPosition().y + 125);

                //target.notifyAttacked(false, resArr[i]);
            }

            this.initPerformEffect(this.debuff[i], "skilleffect", 9, 0.7, 1);
        }

        return 1200;
    },

    initPerformEffect:function(eff, effname, fcount, fduration, loop)
    {
        var animation = new cc.Animation();
        for(var i = 0; i <= fcount; ++i)
        {
            var toi = "";
            if(i < 10)
            {
                toi = "0" + i;
            }
            else
            {
                toi = i;
            }

            var fname = effname + toi + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(fname);

            if(frame != null)
            {
                animation.addSpriteFrame(frame);
            }
        }

        animation.setDelayPerUnit(fduration / fcount);
        animation.setRestoreOriginalFrame(true);
        animation.setLoops(loop);

        var action = new cc.sequence(new cc.Animate(animation), new cc.FadeOut(0.2));
        eff.runAction(action);
    },

    setupMeleeAttackResult:function(targetArr, resArr)
    {
        for(var i = 0; i < targetArr.length; ++i)
        {
            var eff;
            if(resArr[i] >= 0 || resArr.length <= i)
            {
                eff = GameLabelPool.GetInstance().getValidLabelAtlas();
                eff.setString(resArr[i]);
            }
            else
            {
                eff = GameLabelPool.GetInstance().getValidLabelBM();
                eff.setColor(cc.color(40, 40, 40));
                eff.setString("miss");
            }
            eff.setOpacity(255);

            var target = this.getPerformSpriteByCardIndex(targetArr[i]);
            if(targetArr[i] < g_CardListSideSize)
            {
                eff.setPosition(target.getPosition().x + target.getContentSize().width / 2,
                    target.getPosition().y + 125);
            }
            else
            {
                eff.setPosition(target.getPosition().x - target.getContentSize().width / 2,
                    target.getPosition().y + 125);
            }
            this.addChild(eff, g_GameZOrder.ui);
            eff.runEffectAction();
        }

        if(targetArr.length > 0)
        {
            return 800;
        }

        return 500;
    },

    clearTargetCardSprites:function()
    {
        for(var i = 0; i < this.performSprite.length; ++i)
        {
            this.performSprite[i].setVisible(false);
        }
    }
})