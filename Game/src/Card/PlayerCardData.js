/**
 * Created by Administrator on 2015/7/18.
 */

var CRITICAL_DEFENCE_VALUE = 35;
var CRITICAL_DAMAGE_REDUCTION = 50;
var DAMAGE_REDUCTION_MODIFIER_OVER = 3;
var DAMAGE_REDUCTION_MODIFIER_LESS = 5;

var BASE_HIT_RATIO = 0.6;

var PlayerCardData = cc.Class.extend({
    cardID:0,

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

    lightskill:[],
    darkskill:[],

    init:function(data)
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

        this.initSkill(data);
    },

    initSkill:function(data)
    {
        for(var i = 0; i < data.lightskill.length; ++i)
        {
            this.lightskill.push(new CardSkillData());
            this.lightskill[i].init(g_SkillList[data.lightskill[i]]);
        }

        for(var i = 0; i < data.darkskill.length; ++i)
        {
            this.darkskill.push(new CardSkillData());
            this.darkskill[i].init(g_SkillList[data.darkskill[i]]);
        }
    },

    getLevel:function()
    {
        return this.cardLevel;
    },

    getHitPoint:function()
    {
        return this.hitpoint;
    },

    getMaxHitPoint:function()
    {
        return this.maxHitpoint;
    },

    getHitPointPercentage:function()
    {
        if(this.maxHitpoint == 0)
        {
            return 0;
        }
        return this.hitpoint / this.maxHitpoint;
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

    getAbilityDefence:function()
    {
        return this.abilitydefence;
    },

    getDexterity:function()
    {
        return this.dexterity;
    },

    getSpeed:function()
    {
        return this.dexterity;
    },

    getMental:function()
    {
        return this.mental;
    },

    getMentalPercentage:function()
    {
        return this.mental / 100.0;
    },

    getMinRange:function()
    {
        return this.minrange;
    },

    getMaxRange:function()
    {
        return this.maxrange;
    },

    getDamageReduction:function()
    {
        var def = this.getDefence();
        var value = 0;
        if(def > CRITICAL_DEFENCE_VALUE)
        {
            value = Math.sqrt(def - CRITICAL_DEFENCE_VALUE) * DAMAGE_REDUCTION_MODIFIER_OVER;
            value += CRITICAL_DAMAGE_REDUCTION;
            value /= 100;
        }
        else if(def == CRITICAL_DEFENCE_VALUE )
        {
            value = CRITICAL_DAMAGE_REDUCTION / 100;
        }
        else
        {
            value = Math.square(CRITICAL_DEFENCE_VALUE - def) / DAMAGE_REDUCTION_MODIFIER_LESS;
            value = CRITICAL_DAMAGE_REDUCTION - value;
            value /= 100;
        }

        return value;
    },

    getAttackFloatingRange:function()
    {
        var value = Math.sqrt(this.getDexterity());

        return 1 / value;
    },

    getAttackValue:function()
    {
        var minvalue = this.getAttackDamage() * (1 - this.getAttackFloatingRange());
        var maxvalue = this.getAttackDamage();

        return minvalue + Math.random() * (maxvalue - minvalue);
    },

    getHitRatio:function(target)
    {
        var value = this.getDexterity();
        var res;
        if(value > target)
        {
            res = ((value - target) / target) * (1 - BASE_HIT_RATIO) + BASE_HIT_RATIO;
        }
        else if(value = target)
        {
            res = BASE_HIT_RATIO;
        }
        else
        {
            res = BASE_HIT_RATIO - (target - value) * 2 / target * BASE_HIT_RATIO;
        }

        if(res < 0)
        {
            res = 0;
        }
        if(res > 1)
        {
            res = 1;
        }
        return res;
    },

    getSkillData:function(index, light)
    {
        if(light)
        {
            if(this.lightskill.length > index)
            {
                return this.lightskill[index];
            }
        }
        else
        {
            if(this.darkskill.length > index)
            {
                return this.darkskill[index];
            }
        }

        return null;
    },

    takeDamage:function(damage)
    {
        this.hitpoint -= Math.round(damage);
    }
})