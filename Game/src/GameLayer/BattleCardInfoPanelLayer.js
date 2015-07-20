/**
 * Created by Administrator on 2015/7/18.
 */
var BattleCardInfoPanelLayer = BaseLayer.extend({
    hplabel:null,
    menlabel:null,
    stalabel:null,

    levellabel:null,
    strlabel:null,
    deflabel:null,

    apslabel:null,
    adflabel:null,
    dexlabel:null,

    hpvalue:null,
    maxhpvalue:null,
    menvalue:null,
    maxmenvalue:null,
    stavalue:null,
    maxstavalue:null,

    levelvalue:null,
    strvalue:null,
    defvalue:null,

    apsvalue:null,
    adfvalue:null,
    dexvalue:null,

    cachehp:0,
    cachemaxhp:0,
    cachemen:0,
    cachemaxmen:100,
    cachesta:0,
    cachemaxsta:100,
    cachelvl:0,
    cachestr:0,
    cachedef:0,
    cacheaps:0,
    cacheadf:0,
    cachedex:0,

    ctor:function()
    {
        this._super();

        var labelcolor = cc.color(255, 255, 0);
        this.hplabel = new cc.LabelBMFont("HP", s_font);
        this.hplabel.setColor(labelcolor);
        this.hplabel.setPosition(10, 50);
        this.hplabel.setAnchorPoint(0, 0);
        this.addChild(this.hplabel, g_GameZOrder.label);

        this.menlabel = new cc.LabelBMFont("MEN", s_font);
        this.menlabel.setColor(labelcolor);
        this.menlabel.setPosition(10, 25);
        this.menlabel.setAnchorPoint(0, 0);
        this.addChild(this.menlabel, g_GameZOrder.label);

        this.stalabel = new cc.LabelBMFont("STA", s_font);
        this.stalabel.setColor(labelcolor);
        this.stalabel.setPosition(10, 0);
        this.stalabel.setAnchorPoint(0, 0);
        this.addChild(this.stalabel, g_GameZOrder.label);

        this.levellabel = new cc.LabelBMFont("LVL", s_font);
        this.levellabel.setColor(labelcolor);
        this.levellabel.setPosition(160, 50);
        this.levellabel.setAnchorPoint(0, 0);
        this.addChild(this.levellabel, g_GameZOrder.label);

        this.strlabel = new cc.LabelBMFont("STR", s_font);
        this.strlabel.setColor(labelcolor);
        this.strlabel.setPosition(160, 25);
        this.strlabel.setAnchorPoint(0, 0);
        this.addChild(this.strlabel, g_GameZOrder.label);

        this.deflabel = new cc.LabelBMFont("DEF", s_font);
        this.deflabel.setColor(labelcolor);
        this.deflabel.setPosition(160, 0);
        this.deflabel.setAnchorPoint(0, 0);
        this.addChild(this.deflabel, g_GameZOrder.label);

        this.apslabel = new cc.LabelBMFont("APS", s_font);
        this.apslabel.setColor(labelcolor);
        this.apslabel.setPosition(260, 50);
        this.apslabel.setAnchorPoint(0, 0);
        this.addChild(this.apslabel, g_GameZOrder.label);

        this.adflabel = new cc.LabelBMFont("ADF", s_font);
        this.adflabel.setColor(labelcolor);
        this.adflabel.setPosition(260, 25);
        this.adflabel.setAnchorPoint(0, 0);
        this.addChild(this.adflabel, g_GameZOrder.label);

        this.dexlabel = new cc.LabelBMFont("DEX", s_font);
        this.dexlabel.setColor(labelcolor);
        this.dexlabel.setPosition(260, 0);
        this.dexlabel.setAnchorPoint(0, 0);
        this.addChild(this.dexlabel, g_GameZOrder.label);

        this.hpvalue = new cc.LabelBMFont("000", s_font);
        this.hpvalue.setColor(cc.color(0, 255, 0));
        this.hpvalue.setPosition(100, 50);
        this.hpvalue.setAnchorPoint(1, 0);
        this.addChild(this.hpvalue, g_GameZOrder.label);

        this.maxhpvalue = new cc.LabelBMFont("/000", s_font);
        this.maxhpvalue.setPosition(100, 50);
        this.maxhpvalue.setAnchorPoint(0, 0);
        this.addChild(this.maxhpvalue, g_GameZOrder.label);

        this.menvalue = new cc.LabelBMFont("000", s_font);
        this.menvalue.setColor(cc.color(255, 128, 0));
        this.menvalue.setPosition(100, 25);
        this.menvalue.setAnchorPoint(1, 0);
        this.addChild(this.menvalue, g_GameZOrder.label);

        this.maxmenvalue = new cc.LabelBMFont("/100", s_font);
        this.maxmenvalue.setPosition(100, 25);
        this.maxmenvalue.setAnchorPoint(0, 0);
        this.addChild(this.maxmenvalue, g_GameZOrder.label);

        this.stavalue = new cc.LabelBMFont("000", s_font);
        this.stavalue.setColor(cc.color(0, 255, 255));
        this.stavalue.setPosition(100, 0);
        this.stavalue.setAnchorPoint(1, 0);
        this.addChild(this.stavalue, g_GameZOrder.label);

        this.maxstavalue = new cc.LabelBMFont("/100", s_font);
        this.maxstavalue.setPosition(100, 0);
        this.maxstavalue.setAnchorPoint(0, 0);
        this.addChild(this.maxstavalue, g_GameZOrder.label);

        this.levelvalue = new cc.LabelBMFont("00", s_font);
        this.levelvalue.setPosition(250, 50);
        this.levelvalue.setAnchorPoint(1, 0);
        this.addChild(this.levelvalue, g_GameZOrder.label);

        this.strvalue = new cc.LabelBMFont("00", s_font);
        this.strvalue.setPosition(250, 25);
        this.strvalue.setAnchorPoint(1, 0);
        this.addChild(this.strvalue, g_GameZOrder.label);

        this.defvalue = new cc.LabelBMFont("00", s_font);
        this.defvalue.setPosition(250, 0);
        this.defvalue.setAnchorPoint(1, 0);
        this.addChild(this.defvalue, g_GameZOrder.label);

        this.apsvalue = new cc.LabelBMFont("00", s_font);
        this.apsvalue.setPosition(350, 50);
        this.apsvalue.setAnchorPoint(1, 0);
        this.addChild(this.apsvalue, g_GameZOrder.label);

        this.adfvalue = new cc.LabelBMFont("00", s_font);
        this.adfvalue.setPosition(350, 25);
        this.adfvalue.setAnchorPoint(1, 0);
        this.addChild(this.adfvalue, g_GameZOrder.label);

        this.dexvalue = new cc.LabelBMFont("00", s_font);
        this.dexvalue.setPosition(350, 0);
        this.dexvalue.setAnchorPoint(1, 0);
        this.addChild(this.dexvalue, g_GameZOrder.label);
    },


    init:function()
    {
        this.setMaxHP(10);
    },

    setHP:function(value)
    {
        if(value != this.cachehp)
        {
            this.cachehp = value;
            this.hpvalue.setString(value);

            this.updateHPColor();
        }
    },

    setMaxHP:function(value)
    {
        if(value != this.cachemaxhp)
        {
            this.cachemaxhp = value;
            this.maxhpvalue.setString("/" + value);

            this.updateHPColor();
        }
    },

    updateHPColor:function()
    {
        if(this.cachemaxhp > 0)
        {
            if(this.cachehp <= this.cachemaxhp * 0.3)
            {
                if(this.hpvalue.getColor() != cc.color(255, 0, 0))
                {
                    this.hpvalue.setColor(cc.color(255, 0, 0));
                }
            }
            else
            {
                if(this.hpvalue.getColor() != cc.color(0, 255, 0))
                {
                    this.hpvalue.setColor(cc.color(0, 255, 0));
                }
            }
        }
    },

    setMEN:function(value)
    {
        if(value != this.cachemen)
        {
            this.cachemen = value;
            this.menvalue.setString(value);
        }
    },

    setMaxMEN:function(value)
    {
        if(value != this.cachemaxmen)
        {
            this.cachemaxmen = value;
            this.maxmenvalue.setString("/" + value);
        }
    },

    setSTA:function(value)
    {
        if(value != this.cachesta)
        {
            this.cachesta = value;
            this.stavalue.setString(value);
        }
    },

    setMaxSTA:function(value)
    {
        if(value != this.cachemaxsta)
        {
            this.cachemaxsta = value;
            this.maxstavalue.setString("/" + value);
        }
    },

    setLVL:function(value)
    {
        if(value != this.cachelvl)
        {
            this.cachelvl = value;
            this.levelvalue.setString(value);
        }
    },

    setSTR:function(value)
    {
        if(value != this.cachestr)
        {
            this.cachestr = value;
            this.strvalue.setString(value);
        }
    },

    setDEF:function(value)
    {
        if(value != this.cachedef)
        {
            this.cachedef = value;
            this.defvalue.setString(value);
        }
    },

    setAPS:function(value)
    {
        if(value != this.cacheaps)
        {
            this.cacheaps = value;
            this.apsvalue.setString(value);
        }
    },

    setADF:function(value)
    {
        if(value != this.cacheadf)
        {
            this.cacheadf = value;
            this.adfvalue.setString(value);
        }
    },

    setDEX:function(value)
    {
        if(value != this.cachedex)
        {
            this.cachedex = value;
            this.dexvalue.setString(value);
        }
    },

    updateFromCardData:function(data)
    {
        if(data.cardID > 0)
        {
            this.setHP(data.hitpoint);
            this.setMaxHP(data.maxHitpoint);
            this.setMEN(data.mental);
            this.setSTA(data.stamina);
            this.setLVL(data.cardLevel);
            this.setSTR(data.strong);
            this.setDEF(data.defence);
            this.setAPS(data.abilitypower);
            this.setADF(data.abilitydefence);
            this.setDEX(data.dexterity);
        }
    }
})
