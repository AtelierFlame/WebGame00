/**
 * Created by flame on 2015/10/2.
 */

var g_SkillEffectList=[
    {
        //dummy
        id:0,
    },

    {
        //take damage to 2 targets
        id:1,
        type:2,
        attrtype:1,
        valuetype:0,
        isself:false,
    },
];

var g_SkillCondition=[
    {
        //dummy
        id:0,
    },

    {
        //> level
        id:1,
        attrtype:0,
        valuetype:0,
        mode:3,
    },

    {
        //> % hp
        id:2,
        attrtype:1,
        valuetype:1,
        mode:2,
    },
];

var g_SkillList=[
    {
        //dummy
        skillID:0,
    },

    {
        skillID:1,
        icon:"1.png",
        skillEffect:[1],
        skillEffectValue:[
            {
                value:20,
                selftype:0,
                selfmod:0,
                targettype:0,
                targetmod:0,
            }
        ],
        skillCondSelf:[1],
        skillCondSelfValue:[0],
        skillCondTarget:[],
        skillCondTargetValue:[],
        aoe:false,
        targetcount:2,
        friendly:false,
        targetCount:2,
        minRange:1,
        maxRange:5,
    },
];