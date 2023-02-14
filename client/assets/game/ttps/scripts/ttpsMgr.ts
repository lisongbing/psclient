// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { gameBaseMgrlib } from "../../../scripts/managers/Mgr";
import PlayerInfo from "./playerInfo";
import RoomInfo from "./roomInfo";
import TTPS from "./ttps";
import TTPSAudio from "./ttpsAudio";
import TTPSDef from "./ttpsDef";
import TTpsMsgQueue from "./ttpsMsgQueue";
import TTPSSettlement from "./ttpsSettlement";

class DMode {
    isDrive:boolean;
}

const {ccclass, property,executeInEditMode} = cc._decorator;

@ccclass
export default class TTPSMgr extends gameBaseMgrlib.gameBaseMgr {

    ttpsDef:TTPSDef = new(TTPSDef);

    backPlay:any = null;

    isGameEndFinal:boolean = null;

    DMode:DMode = null;

    isGameEnding:any = null;

    msgQue:TTpsMsgQueue = null;

    gameScript:TTPS = null;
    
    uidPlayers:Map<string, PlayerInfo> = new Map();

    selfPlayer:PlayerInfo = null;

    ttpsRoomInfo:RoomInfo = null;

    audio: TTPSAudio = null;

    rulesConctrl:Map<string,string> = null;
   
    onLoad(){
       
    }

    start () {
       
    }

    dbgstr(info:string):string {
        let s = '天天拼十';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    }

    setSelfPlayer(p){
        this.selfPlayer = this.setPlayerInfo(p);
    }

    setPlayerInfo(p):PlayerInfo{
        let player =  new PlayerInfo(p.isWatch,p.lastWinValue,p.lastTZNum,p.money,p.reward,p.start,p.end,p.power,p.status,p.uid,p.deskId,p.name,p.icon);
        if (p.cards && p.cards.length > 0){
            player.setCards(p.cards);
        }
        return player;
    }

    setUidPlayers(p:any){
        this.uidPlayers.set("" + p.uid,this.setPlayerInfo(p));
    }

    initRulesConctrl(){
        this.rulesConctrl = new Map();
        let rulesInfo = cc.g.utils.getJson('BigTwoRule');
        let ttpsRules = rulesInfo["1"];             //游戏1 写死
        ttpsRules.ruleInfo.forEach(element => {
            let ss = element.split(',');
            if (ss.length == 2){
                this.rulesConctrl.set(ss[0],ss[1]);
            }
        });
        cc.log(rulesInfo);
    }
    // update (dt) {}
       /* =================================================================================================================== */
    // 初始化房间、玩家信息
    init(roomInfo:any, player:any, otherPlayers:any) {
        cc.log(this.dbgstr('init'));
        this.initRulesConctrl();
        //初始化
        this.ttpsDef.initRMSTAStr();
        this.ttpsDef.initPlayerOptStr();

        if (this.isGameEndFinal) {
            cc.log(this.dbgstr('已经处于最终总结算 不在处理断线重连'));
            return;
        }

        if (roomInfo.backPlayData) {
            cc.log(this.dbgstr('回放')); 

            roomInfo.status = this.ttpsDef.RMSTA.Free.v;

            //this.backPlay = new ddz5BackPlay();
        } else {
            this.backPlay = null;

            if (roomInfo.clubId) {
                let o = {}
                o.clubId = roomInfo.clubId;
                o.bjID = roomInfo.clubdesk.roomUid;
                o.deskIndex = roomInfo.clubdesk.deskIndex;

                cc.g.hallMgr.backToClubIfo = o;
            }
        }

        // 数据模式 true驱动 false刷新
        if (!this.DMode) {
            this.DMode = new DMode();
        }
        this.DMode.isDrive = true;

        this.isGameEndFinal = null;
        this.isGameEnding = null;

        //消息队列
        if (! this.msgQue) {
            this.msgQue = new TTpsMsgQueue();
            this.msgQue.init();
        }
        this.msgQue.begin();
        this.msgQue.pause();

        super.init(roomInfo, player, otherPlayers);

        if (this.backPlay) {
            this.backPlay.init(this);
        }
        let s:string = "    " + "游戏状态 " + this.roomInfo.status + ' ' + this.ttpsDef.RMSTAStr[this.roomInfo.status];
        cc.log(s);
        cc.log("    " + "自己椅子号", this.selfDeskId);

        // // 逻辑模块
        // if (! this.logic) {
        //     this.logic = new ddz5Logic();
        //     this.logic.init(this);
        // }

        // // 音乐模块
        if (! this.audio) {
            this.audio = new TTPSAudio();
            this.audio.init(this);
        }
        this.audio.curBGM = '';
        
        // //UID玩家 位置玩家
        // if (! this.uidPlayers) {
        //     this.uidPlayers = {};   
        //     this.posPlayers = {};
        // }

        
        // if (!this.isBackPlayMode()) {
        //     this.upExpand();
        // }

        // 更新玩家
        // this.DMode.isDrive = false;

        // this.upPlayers();

        // for (const key in this.uidPlayers) {
        //     this.uidPlayers[key].d.bigtwoInfo_last = this.uidPlayers[key].d.bigtwoInfo; //缓存以供日志查看
        //     this.uidPlayers[key].d.bigtwoInfo = null;
        // }

        // 刷新游戏
        if (this.gameScript != null) {
            this.gameScript.resetGame();
            this.msgQue.resume();
        }

        this.DMode.isDrive = true;
    }

    initRoomInfo(){
        this.ttpsRoomInfo = null;
        let roomInfo = this.roomInfo;
        this.ttpsRoomInfo = new RoomInfo(roomInfo.watchDeskId,roomInfo.randomZjs,roomInfo.roomId,roomInfo.status,roomInfo.NewRlue,roomInfo.total,roomInfo.clubId,roomInfo.Type,
            roomInfo.base,roomInfo.limit,roomInfo.curGameNum,roomInfo.GameNum,roomInfo.dealer);
    }

    initUidPlayers(){
        this.selfPlayer = null;
        this.uidPlayers.clear();
        if (this.players){
            for (let i = 0;i < this.players.length;i++){
                let p = this.players[i];
                if (i == 0){
                    this.setSelfPlayer(p);
                }else{
                    this.setUidPlayers(p);
                }
            }
        }

    }

    
    isBackPlayMode() {
        return this.backPlay ? true : false;    
    }

    // 注册消息监听
    setNetworkMessageCallback() {
        super.setNetworkMessageCallback();

        // 总结算
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_TTPS_END_RESULT_LIST, (resp) => {
            let settleFinalNode = cc.instantiate(this.gameScript.settleFinal);
            let scene = cc.director.getScene();
            //scene.getChildByName('ingame_menu')
            //let node = (this.gameScript as cc.Component).node;
            scene.addChild(settleFinalNode);
            let finalScript = (<TTPSSettlement>settleFinalNode.getComponent('ttpsSettlement'));
            finalScript.init('' + resp.roomType,resp.roomId,resp.round,resp.time,resp.list,this.selfPlayer,this.uidPlayers);
            this.isGameEndFinal = true;
        });

        cc.g.networkMgr.addHandler(PB.PROTO.GET_ROOM_IFON, (resp) => {
            this.init(resp.room,resp.one,resp.others);
            this.gameScript.startLoadAllView();
        });

        //坐下
        cc.g.networkMgr.addHandler(PB.PROTO.SITDOWN_ROOM, (resp) => {
            this.init(resp.room,resp.one,resp.others);
            this.gameScript.startLoadAllView();
        });

        //旁观者离开房间
        cc.g.networkMgr.addHandler(PB.PROTO.WATCHER_QUIT_ROOM, (resp) => {
            cc.log("旁观自己玩家离开房间");
            cc.g.hallMgr.backToHall();
        });

        //旁观者换位置房间
        cc.g.networkMgr.addHandler(PB.PROTO.WATCHER_CAHNGE_POS, (resp) => {
            cc.log("旁观切换桌子");
            this.init(resp.room,resp.one,resp.others);
            this.gameScript.startLoadAllView();
        });
    }

    // 界面加载完成
    gameScriptLoaded() {
        cc.log(this.dbgstr(' gameScriptLoaded 界面加载完成'));
        this.DMode.isDrive = true;
        
        this.msgQue.resume();
    }



    // 更新玩家情况
    upPlayers(){
        cc.log(this.dbgstr('upPlayer'));

        // 去除已经不再的玩家
        let qt = [];
        for (const key in this.uidPlayers) {
            let p = this.uidPlayers[key];

            let isIn = false;
            for (let j = 0; j < this.players.length; ++j) {
                if (key == this.players[j].uid) {
                    isIn = true;
                    break;
                }
            }

            if (! isIn) {
                cc.log('    玩家不在已经退出 ' + key)
                p.quite();
                qt.push(key);
            }
        }
    }
    // 更新现有玩家和添加新的玩家
    upOrAddPlayer(player) {
        cc.log(this.dbgstr('addPlayer'));

        let p = player;
        
        //是自己
        if (eq64(p.uid,this.selfPlayer.getUid())){
            this.setSelfPlayer(p);
        }else{
            this.setUidPlayers(p);
        }
        this.updateOrSetPlayerView(p);

        cc.log('    uid ' + p.uid);
    }

    updateOrSetPlayerView(p){
        this.gameScript.playersScript.updateOrSetPlayerView(this.selfPlayer,this.uidPlayers.get('' + p.uid),this.ttpsRoomInfo.getTotalNum());
    }

    /* =================================================================================================================== */



    /* =================================================================================================================== */
    // 根据玩家位置获取视图位置 以0开始的视图编号
    getViewPos(deskId) {
        let playNum = this.roomInfo.total; //玩法人数

        let vp = deskId - this.selfDeskId;

        if (vp < 0) {
            vp += playNum;
        }

        return vp;
    }
    // 根据视图位置获取玩家位置 以0开始的位置编号
    getPlayerPos(viewPos) {
        let playNum = this.roomInfo.total; //玩法人数
        
        let pos = viewPos + this.selfDeskId;

        if (pos >= playNum) {
            pos = pos % playNum;
        }

        return pos;
    }

    playerStatusUpdated(player:any) {
        if (eq64(player.uid,this.selfPlayer.getUid())){
            this.selfPlayer.setStatus(player.status);
        }else{
            let other = this.uidPlayers.get(player.uid + '');
            other.setStatus(player.status);
        }    
    }

    // 新玩家加入
    newPlayerJoined(player) {
        
        cc.log(this.dbgstr('newPlayerJoined'));
        this.upOrAddPlayer(player);
       
    }

    // 玩家退出
    playerQuited(player:any):void {
        if (!eq64(this.ttpsRoomInfo.watchDeskId,-1)){
            return;
        }
        super.playerQuited(player);//不能删除

        if (eq64(this.selfPlayer.getUid(), player.uid)) {//如果是自己
            this.selfPlayer = null;

            return;
        }

        this.deletePlayer(player);
        
        
    }

    deletePlayer(player){
        let p = player;
        this.deletePlayerView(player);
        this.uidPlayers.delete('' + p.uid);
    }

    deletePlayerView(p){
        this.gameScript.playersScript.deletePlayerView(this.selfPlayer,this.uidPlayers.get('' + p.uid),this.ttpsRoomInfo.getTotalNum());
    }

    // 更新玩家
    playerInfoUpdated(player) {
        
    }

    // 准备
    ready() {
        this.sendOp(TTPSDef.PlayerOpt.Ready.v, [TTPSDef.PlayerSta.Ready.v]);
    }

    //抢庄
    qianZhuang(bei:number){
        this.sendOp(TTPSDef.PlayerOpt.OP_QZ.v, [bei]);
    }

    //下注
    xiazhu(bei:number){
        this.sendOp(TTPSDef.PlayerOpt.OP_XZ.v, [bei]);
    }

    //开牌
    kaiPaiOp(cards:number[]) {
        this.sendOp(TTPSDef.PlayerOpt.OP_KP.v, cards);
    }

     //坐下
    sitDown(){
        this.sendOp(TTPSDef.PlayerOpt.OP_SitDown.v, []);
    }

    // 更新玩家操作
// 更新玩家操作
    updateOp(uid:number, resp:any) {
    
        let data = {};
        data.uid = uid;
        data.resp = resp;

        let p:PlayerInfo = this.playerToPlayerInfo(uid);
        if (!p){
            return;
        }

        this.handlerOP(p,resp.op);
        // let tag = p.getName() + '_' + uid 
        // if (TTPSDef.PlayerOptStr[resp.op.k]) {
        //     tag += '_' + TTPSDef.PlayerOptStr[resp.op.k].s + ' ' + resp.op.v.join(',');
        // } else {
        //     tag += '_' + resp.op.k.toString(2) + ' ' + resp.op.v.join(',');
        // }

        // this.msgQue.createMsg(
        //     'updateOp',
        //     (data)=>{
        //         let uid = data.uid;
        //         let resp = data.resp;

        //         this.handlerOP(p,resp.op);
        //         let t = this.uidPlayers[uid].opt(resp.op);

        //         for (const key in this.uidPlayers) {
        //             const e = this.uidPlayers[key];

        //             if (key != uid) {
        //                 e.otherOpt(uid, resp.op);
        //             }
        //         }

        //         if (!t || t<=0) {
        //             this.msgQue.finishMsg();
        //             return;
        //         }

        //         this.scheduleOnce(() => this.msgQue.finishMsg(), t);
        //     },
        //     data,
        //     tag
        // );
    }

    handlerOP(p:PlayerInfo,op:any){
        this.dbgstr("玩家" + p.getUid() + "op");
        cc.log(op);
        this.gameScript.playersScript.handlerOpPlayerView(this.selfPlayer,p,this.uidPlayers,this.ttpsRoomInfo.getTotalNum(),op);
    }


    hideArea4(){
        this.gameScript.playersScript.hideArea4();
    }


    //更新玩家金币
    playerMoneyUpdated(player:any, coin:number) {
        this.dbgstr("玩家" + player.uid + "playerMoneyUpdated");
        let playerInfo:PlayerInfo = this.playerToPlayerInfo(player.uid);
        this.gameScript.playersScript.upPlayerViewCoin(this.selfPlayer,playerInfo,this.uidPlayers,this.ttpsRoomInfo.getTotalNum(),coin);
    }

    //玩家对象转换
    playerToPlayerInfo(uid:number):PlayerInfo{
        let p:PlayerInfo = null;
        let myUid = this.selfPlayer.getUid();
    
        if (eq64(uid,myUid)){
            p = this.selfPlayer;
        }else{
            p =this.uidPlayers.get('' + uid);
        }
        return p;
    }

    resetPlayers(){
        this.dbgstr("resetPlayers");
    }

    roomStatusUpdated(){
        this.dbgstr("roomStatusUpdated");
        this.ttpsRoomInfo.setStatus(this.roomInfo.status);
        this.ttpsRoomInfo.setStart(this.roomInfo.start);
        this.ttpsRoomInfo.setEnd(this.roomInfo.end);
        this.gameScript.playersScript.handlerRoomStatus();
    }

    showAnmEmoji(player, id){
        let p = this.playerToPlayerInfo(player.uid);
        this.gameScript.playersScript.onAnmEmoji(p,id);
    }

    getPlayerHeadView(player):cc.Node{
        let p = this.playerToPlayerInfo(player.uid);
        let viewIndex = this.gameScript.playersScript.getViewIndex(this.selfPlayer,p,this.ttpsRoomInfo.getTotalNum());
        let node = this.gameScript.playersScript.getHeadNodeByIndex(viewIndex)
        node.Node_txtEmoji = node.getChildByName('Node_txtEmoji');
        return node;
    }
    
}
