cc.game.onStart = function()
{
    cc.log("Game Start!!!!");
    if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));

    var designSize = cc.size(800, 480);
    var screenSize = cc.view.getFrameSize();
    g_Policy = new cc.ResolutionPolicy(cc.ContainerStrategy.ORIGINAL_CONTAINER, cc.ContentStrategy.SHOW_ALL);

    cc.loader.resPath = "res/";

    cc.LoaderScene.preload(g_resources, function ()
    {
        cc.spriteFrameCache.addSpriteFrames(s_uiplist);
        GameManager.GetInstance().gotoState(GameStartState.GetInstance());
    }, this);

    GameInstance.getInstance().AdjustSizeForWindow();
    window.addEventListener("resize", function(event){
        GameInstance.getInstance().AdjustSizeForWindow();
    })
};
cc.game.run();