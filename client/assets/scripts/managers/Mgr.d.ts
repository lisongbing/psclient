// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const {ccclass, property} = cc._decorator;
export declare module gameBaseMgrlib { // 这个hellolib就是zz.js中导出的Object

    declare class gameBaseMgr{ // 这个 World 就是 zz.js 中导出的名字，并且在xx.js中是个Object就可以了
        //初始化房间、玩家信息
        init(roomInfo, player, otherPlayers):void;

        JoinVoiceRoom():void;
        QuiteVoiceRoom():void;
        onVoiceState(uid, sta, dur):void;

        getCurServerTime():void;

        getCurServerMSTime():number;

        getPlayer(uid):any;

        getSelfPlayer():any;

        getDealer():any;

        getPlayerByGVoiceId(id):any;
        playerQuited(player):void;

        setPause(pause):void;

        //设置网络回调
        setNetworkMessageCallback():void; 

        mgrOp(uid, resp, isself):void;
        upOnline(uid, v):void;
        ChangeOnline(ison):void;
        onScreenshot():void;

        sendOp(k, v):void;
        sendGetRoomInfo():void;

        // 定位更新
        onLocationUp(loc):void;

        sendTalkToAllReq(id, type, content, target):void;

        bindGVoiceMemberId(memberId):void;

        checkRoomRule(rule):boolen;

        checkAllPlayersReady():boolen;

        isBackPlayMode():boolen;

        isCardRoomType():boolen;

        isGoldRoomType():boolen;

        isCardRoomUnstarted():boolen;

        isCardRoomFirstGame ():boolen;

        isCardRoomGameOver ():boolen;

        resetPlayers():void;

        roomStatusUpdated():void;
    }

}
