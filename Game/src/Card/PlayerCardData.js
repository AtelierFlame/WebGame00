/**
 * Created by Administrator on 2015/7/18.
 */
var PlayerCardData = cc.Class.extend({
    cardID:0,
    playerCardID:0,

    cardLevel:1,

    hitpoint:0,
    maxHitpoint:0,
    stamina:0,
    strong:0,
    defence:0,
    abilitypower:0,
    abilitydefence:0,
    dexterity:0,
    mental:0,
    minrange:1,
    maxrange:1,

    copy:function(data)
    {
        this.cardID = data.id;
        this.hitpoint = data.hitpoint;
        this.maxHitpoint = data.maxHitpoint;
        this.stamina = data.stamina;
        this.strong = data.strong;
        this.defence = data.defence;
        this.abilitypower = data.abilitypower;
        this.abilitydefence = data.abilitydefence;
        this.dexterity = data.dexterity;
        this.mental = data.mental;
        this.minrange = data.minrange;
        this.maxrange = data.maxrange;
    },

    getHitPoint:function()
    {
        return this.hitpoint;
    },

    getMaxHitPoint:function()
    {
        return this.maxHitpoint;
    },

    getStamina:function()
    {
        return this.stamina;
    },

    getAttackDamage:function()
    {
        return this.strong;
    },

    getDefence:function()
    {
        return this.defence;
    },

    getAbilityPower:function()
    {
        return this.abilitypower;
    },

    getSpeed:function()
    {
        return this.dexterity;
    },

    getMental:function()
    {
        return this.mental;
    },

    getMinRange:function()
    {
        return this.minrange;
    },

    getMaxRange:function()
    {
        return this.maxrange;
    },

    isInRange:function(dis)
    {
        return dis >= this.getMinRange() && dis <= this.getMaxRange();
    }
})