/**
 * Created by flame on 2015/10/2.
 */

if(typeof CardEffectType == "undefined")
{
    var CardEffectType =
    {
        CET_Default:0,
        CET_Buff:1,
        CET_Debuff:2,
    }
}

if(typeof SkillAttributeType == "undefined")
{
    var SkillAttributeType =
    {
        SAT_Level:0,
        SAT_HP:1,
        SAT_STA:2,
        SAT_STR:3,
        SAT_DEF:4,
        SAT_APS:5,
        SAT_ADF:6,
        SAT_DEX:7,
        SAT_MEN:8,
    }
}

if(typeof SkillValueType == "undefined")
{
    var SkillValueType =
    {
        EVT_Default:0,
        EVT_Percentage:1,
    }
}

var CardSkillEffect = cc.Class.extend({
    effectID:0,
    effectType:0, //CardEffectType
    effectAttrType:0, //SkillAttributeType
    effectValueType:0, //SkillValueType
    selfEffect:false,

    copy:function(data)
    {
        this.effectID = data.id;
        this.effectType = data.type;
        this.effectAttrType = data.attrtype;
        this.effectValueType = data.valuetype;
        this.selfEffect = data.isself;
    }
})

if(typeof SkillConditionMode == "undefined")
{
    var SkillConditionMode =
    {
        SCM_Equal:0,
        SCM_LessThan:1,
        SCM_MoreThan:2,
        SCM_NotLessThan:3,
        SCM_NotMoreThan:4,
    }
}

var SkillCondition = cc.Class.extend({
    condID:0,
    condAttrType:0, //SkillAttributeType
    condValueType:0, //SkillValueType
    condMode:0, //SkillConditionMode

    init:function(data)
    {
        this.condID = data.id;
        this.condAttrType = data.attrtype;
        this.condValueType = data.valuetype;
        this.condMode = data.mode;
    }
})

var CardSkillValue = cc.Class.extend({
    baseValue:0,
    selfAttrType:0,
    selfAttrMod:0,
    targetAttrType:0,
    targetAttrMod:0,

    init:function(data)
    {
        this.baseValue = data.value;
        this.selfAttrType = data.selftype;
        this.selfAttrMod = data.selfmod;
        this.targetAttrType = data.targettype;
        this.targetAttrMod = data.targetmod;
    },

    getValue:function(self, target)
    {
        var value = this.baseValue;
        if(self != null)
        {
            value += this.getModValue(self, this.selfAttrType, this.selfAttrMod);
        }

        if(target != null)
        {
            value -= this.getModValue(self, this.targetAttrType, this.targetAttrMod);
        }

        return value;
    },

    getModValue:function(data, attr, mod)
    {
        switch(attr)
        {
            case SkillAttributeType.SAT_Level:
                return data.getLevel() * mod;

            case SkillAttributeType.SAT_HP:
                return data.getHitPoint() * mod;

            case SkillAttributeType.SAT_STA:
                return data.getStamina() * mod;

            case SkillAttributeType.SAT_STR:
                return data.getAttackDamage() * mod;

            case SkillAttributeType.SAT_DEF:
                return data.getDefence() * mod;

            case SkillAttributeType.SAT_APS:
                return data.getAbilityPower() * mod;

            case SkillAttributeType.SAT_ADF:
                return data.getAbilityDefence() * mod;

            case SkillAttributeType.SAT_DEX:
                return data.getDexterity() * mod;

            case SkillAttributeType.SAT_MEN:
                return data.getMental() * mod;
        }
    }
})

var CardSkillData = cc.Class.extend({
    skillID:0,

    skillEffect:[],
    skillEffectValue:[],
    skillCondSelf:[],
    skillCondSelfValue:[],
    skillCondTarget:[],
    skillCondTargetValue:[],

    coolDown:1,
    friendly:true,
    aoe:false,
    targetcount:1,
    minRange:1,
    maxRange:1,

    init:function(data)
    {
        this.skillID = data.skillID;

        this.skillEffect = data.skillEffect;
        for(var i = 0; i < data.skillEffectValue.length; ++i)
        {
            this.skillEffectValue.push(new CardSkillValue());
            this.skillEffectValue[i].init(data.skillEffectValue[i]);
        }

        for(var i = 0; i < data.skillCondSelf.length; ++i)
        {
            this.skillCondSelf.push(new SkillCondition());
            this.skillCondSelf[i].init(g_SkillCondition[data.skillCondSelf[i]]);
        }
        this.skillCondSelfValue = data.skillCondSelfValue;

        for(var i = 0; i < data.skillCondTarget.length; ++i)
        {
            this.skillCondTarget.push(new SkillCondition());
            this.skillCondTarget[i].init(g_SkillCondition[data.skillCondTarget[i]]);
        }
        this.skillCondTargetValue = data.skillCondTargetValue;

        this.coolDown = data.coolDown;
        this.friendly = data.friendly;
        this.aoe = data.aoe;
        this.targetcount = data.targetcount;
        this.minRange = data.minRange;
        this.maxRange = data.maxRange;
    },

    compareValue:function(value, tarvalue, mode)
    {
        switch(type)
        {
            case SkillConditionMode.SCM_Equal:
                return value == tarvalue;

            case SkillConditionMode.SCM_LessThan:
                return value < tarvalue;

            case SkillConditionMode.SCM_MoreThan:
                return value > tarvalue;

            case SkillConditionMode.SCM_NotLessThan:
                return value >= tarvalue;

            case SkillConditionMode.SCM_NotMoreThan:
                return value <= tarvalue;
        }

        return false;
    },

    compareAttribute:function(value, valuetype, card, attr, mode)
    {
        switch(attr)
        {
            case SkillAttributeType.SAT_Level:
                return this.compareValue(card.getLevel(), value, mode);

            case SkillAttributeType.SAT_HP:
                switch(valuetype)
                {
                    case SkillValueType.EVT_Default:
                        return this.compareValue(card.getHitPoint(), value, mode);

                    case SkillValueType.EVT_Percentage:
                        return this.compareValue(card.getHitPointPercentage(), value, mode);
                }
                return false;

            case SkillAttributeType.SAT_STA:
                return this.compareValue(card.getStamina(), value, mode);

            case SkillAttributeType.SAT_STR:
                return this.compareValue(card.getAttackDamage(), value, mode);

            case SkillAttributeType.SAT_DEF:
                return this.compareValue(card.getDefence(), value, mode);

            case SkillAttributeType.SAT_APS:
                return this.compareValue(card.getAbilityPower(), value, mode);

            case SkillAttributeType.SAT_ADF:
                return this.compareValue(card.getAbilityDefence(), value, mode);

            case SkillAttributeType.SAT_DEX:
                return this.compareValue(card.getDexterity(), value, mode);

            case SkillAttributeType.SAT_MEN:
                switch(valuetype)
                {
                    case SkillValueType.EVT_Default:
                        return this.compareValue(card.getHitPoint(), value, mode);

                    case SkillValueType.EVT_Percentage:
                        return this.compareValue(card.getHitPointPercentage(), value, mode);
                }
                return false;
        }

        return false;
    },

    checkCondSelf:function(data)
    {
        for(var i = 0; i < this.skillCondSelf.length; ++i)
        {
            if(this.skillCondSelfValue.length <= i)
            {
                break;
            }

            if(!this.compareAttribute(this.skillCondSelfValue[i],
                    this.skillCondSelf[i].condValueType,
                    data,
                    this.skillCondSelf[i].condAttrType,
                    this.skillCondSelf[i].condMode))
            {
                return false;
            }
        }

        return true;
    },

    checkCondTarget:function(data)
    {
        for(var i = 0; i < this.skillCondTarget.length; ++i)
        {
            if(this.skillCondTargetValue.length <= i)
            {
                break;
            }

            if(!this.compareAttribute(this.skillCondTargetValue[i],
                    this.skillCondTarget[i].condValueType,
                    data,
                    this.skillCondTarget[i].condAttrType,
                    this.skillCondTarget[i].condMode))
            {
                return false;
            }
        }

        return true;
    }
})