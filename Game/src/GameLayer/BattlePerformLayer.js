/**
 * Created by Administrator on 2015/7/22.
 */
var BattlePerformLayer = BaseLayer.extend({
    showBg:true,
    canTouch:true,

    performSprite:[],

    ctor:function()
    {
        this._super();

        this.performSprite.push(new CardPerformSprite());
        this.performSprite[0].setPosition(150, 100);
        this.addChild(this.performSprite[0], g_GameZOrder.card);
    },

    setCardSprite:function(index)
    {
        var cardid = BattleManager.GetInstance().getCardData(index).cardID;

        this.performSprite[0].initWithFile(g_CardList[cardid].image);
        this.performSprite[0].setAnchorPoint(0, 0);
    }
})