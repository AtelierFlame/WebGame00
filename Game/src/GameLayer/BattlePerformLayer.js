/**
 * Created by Administrator on 2015/7/22.
 */
var BattlePerformLayer = BaseLayer.extend({
    showBg:true,
    canTouch:true,

    cardPosList:[],
    performSprite:[],

    ctor:function()
    {
        this._super();

        this.initCardPostionList();

        this.performSprite.push(new CardPerformSprite());
        this.addChild(this.performSprite[0], g_GameZOrder.card);
    },

    initCardPostionList:function()
    {
        this.cardPosList.push(cc.p(180, 100));
        this.cardPosList.push(cc.p(150, 100));
        this.cardPosList.push(cc.p(120, 100));
        this.cardPosList.push(cc.p(90, 100));
        this.cardPosList.push(cc.p(620, 100));
        this.cardPosList.push(cc.p(650, 100));
        this.cardPosList.push(cc.p(680, 100));
        this.cardPosList.push(cc.p(710, 100));
    },

    setCardSprite:function(index)
    {
        var cardid = BattleManager.GetInstance().getCardData(index).cardID;

        this.performSprite[0].initWithFile(g_CardList[cardid].image);
        this.performSprite[0].setAnchorPoint(0, 0);
        this.performSprite[0].setPosition(this.cardPosList[index]);
        this.performSprite[0].cardIndex = index;
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
            if(targets[i + 1] >= g_CardListSideSize)
            {
                this.performSprite[i + 1].setAnchorPoint(1, 0);
            }
            else
            {
                this.performSprite[i + 1].setAnchorPoint(0, 0);
            }
            this.performSprite[i + 1].setPosition(this.cardPosList[targets[i]]);
            this.performSprite[i + 1].cardIndex = targets[i];
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
            self.runAction(new cc.MoveTo(0.5, target.getPosition()));
            target.runAction(new cc.MoveTo(0.5, self.getPosition()));
            return 500;
        }

        return 1;
    }
})