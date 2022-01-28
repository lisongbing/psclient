// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { gameBaselib } from "../../../scripts/components/componets";
import Player from "./player";
import TTPSDef from "./ttpsDef";
import TTPSMgr from "./ttpsMgr";
const {ccclass, property} = cc._decorator;

@ccclass
export default class TTPS extends gameBaselib.gameBase {
    playersScript:Player = null;
    gameMgr:TTPSMgr = null; 
    totalNum:number =  10;
    @property(cc.Prefab)
    settleFinal:cc.Prefab = null;
    @property(cc.SpriteAtlas)
    qzxzAtals:cc.SpriteAtlas = null;

    TickerIndex:number = 0;
    onLoad(){
       this.gameMgr = cc.g.ttpsMgr;
       super.onLoad();
       this.gameMgr.gameScript = this;
       console.log(this.dbgstr("hello world。。。"));
       
    }


    start(){
       this.startLoadAllView();
       //this.goldFly();
       this.gameMgr.sendGetRoomInfo();
    }

    goldFly(){
        let pos0 = this.playersScript.node.children[1].convertToWorldSpaceAR(cc.v2(0,0));
        let pos1 = (this as cc.Component).node.convertToNodeSpaceAR(pos0);
        let goldNode = (this as cc.Component).node.getChildByName('gglod');
        let t = cc.tween;
            t(goldNode)
                // 同时执行两个 cc.tween
                .parallel(
                    t().to(1, { scale: 0.2 }),
                    t().to(1, { position: pos1})
                )
                .call(() => {
                    console.log('All tweens finished.');
                })
                .start()
    }

    startLoadAllView(){
       let playersNode:cc.Node = (this as cc.Component).node.getChildByName("Players");
       this.playersScript = (playersNode.getComponent('player') as Player);
       this.playersScript.gameMgr = this.gameMgr;

       for (let i = 1; i <= this.totalNum;i++){
            this.playersScript.clearView(i)
        }
        this.gameMgr.initRoomInfo();
        this.gameMgr.initUidPlayers();
        for (let i = 1; i <= this.gameMgr.ttpsRoomInfo.getTotalNum();i++){
            this.playersScript.createPlayerView(i);
            this.playersScript.startView(i);
        }   
       this.initView();
       this.gameMgr.audio.bgmGame();
        // 
        cc.g.hallMgr.inGameMenu.upBtnShow();

       // cc.g.hallMgr.inGameMenu.upteagold();
    }

    onSettleFinal(e:cc.Event.EventTouch, customEventData:string){
        //退出游戏
        this.dbgstr('onSettleFinal');
        this.gameMgr.playerQuited(this.gameMgr.getSelfPlayer());
        this.gameMgr.isGameEndFinal = false;
        cc.g.hallMgr.backToHall();
    }

    initView(): void {
        this.playersScript.initStartView();
        this.setQZXZBtn();
        this.setJs();
    }

    setJs():void{
        let jsNode = (this as cc.Component).node.getChildByName('JS');
        jsNode.getChildByName('Num').getComponent(cc.Label).string = this.gameMgr.ttpsRoomInfo.getCurGameNum() + '/' + this.gameMgr.ttpsRoomInfo.getGameNum() + '局';
    }

    setQZXZBtn():void{
        let xzRule:number = 0;
        this.gameMgr.ttpsRoomInfo.getRules().forEach(r =>{
            if (r < 8){  //下注
                xzRule = r
            }
        });
        
        let xzBtnString:string = this.gameMgr.rulesConctrl.get('' + xzRule);
        this.setQZView();
        this.setXzView(xzBtnString);
    }

    setTicker(des:string,start:number,end:number){
        let tickerNode = (this as cc.Component).node.getChildByName('Ticker')
        tickerNode.active = true;
        tickerNode.getChildByName('RoomStatus').getComponent(cc.Label).string = des;
        let Index = i64v(end) / 1000  - i64v(start) / 1000;
        tickerNode.getChildByName('Time').getComponent(cc.Label).string = '' + Index;

        //this.TickerIndex = 0;
        let funUp = function () {
            //this.TickerIndex ++;
            Index--;
            tickerNode.getChildByName('Time').getComponent(cc.Label).string = '' + Index;
            
            if (Index <= 0) {
                this.unschedule(funUp);
            }
        }
        this.schedule(funUp, 1);

    }

    hideTicker(){
        let tickerNode = (this as cc.Component).node.getChildByName('Ticker')
        tickerNode.active = false;
        this.unscheduleAllCallbacks();
    }

    setQZView(){
        this.playersScript.showQZBT(this.gameMgr.ttpsRoomInfo.getStatus() == this.gameMgr.ttpsDef.RMSTA.QZ.v && this.gameMgr.selfPlayer.getStatus() == TTPSDef.PlayerSta.FP.v);
    }

    setXzView(xzBtnString:string){
        let qzSs:string[] = xzBtnString.split('/');
        if (qzSs.length != 3){
            return;
        }
        let xzNode = (this as cc.Component).node.getChildByName('XZBT');
        for (let i = 0;i < xzNode.childrenCount;i++){
            let beiNode = xzNode.children[i];
            if (i < 3){
                beiNode.getComponent(cc.Button).clickEvents[0].customEventData = qzSs[i];
                let node2 = cc.find('Node1/Node2',beiNode);
                node2.getComponent(cc.Sprite).spriteFrame = this.qzxzAtals.getSpriteFrame('xz_'+qzSs[i]);
            }else{
                let rules = this.gameMgr.ttpsRoomInfo.getRules();
                let beiNum :number = 0;
                rules.forEach(r =>{
                    if (r == 21){
                        beiNum = 10;
                    }else if (r == 22){
                        beiNum = 15;
                    }else if (r == 23){
                        beiNum = 20;
                    }
                })
                if ( beiNum > 0){
                    beiNode.getComponent(cc.Button).clickEvents[0].customEventData = beiNum + '';
                    let node2 = cc.find('Node1/Node2',beiNode);
                    node2.getComponent(cc.Sprite).spriteFrame = this.qzxzAtals.getSpriteFrame('xz_'+ beiNum);
                }           
            }

        }


    }

    resetGame():void{
        super.resetGame.bind(this)();
        this.startLoadAllView();
    }

    // 准备
    onButtonReady(e, customEventData) {
        cc.log(this.dbgstr('准备 onButtonReady'),e,customEventData);

        this.gameMgr.ready();
        this.gameMgr.audio.btnEnter();

        //this.gameMgr.hideArea4();
    }

    onButtonQZ(e:cc.Event.EventTouch, customEventData:string){
        cc.log(this.dbgstr('抢庄 onButtonQZ'),e,customEventData);
        this.gameMgr.audio.btnEnter();
        this.gameMgr.qianZhuang(parseInt(customEventData));
    }


    onButtonXZ(e:cc.Event.EventTouch, customEventData:string){
        cc.log(this.dbgstr('下注 onButtonQZ'),e,customEventData);
        this.gameMgr.audio.btnEnter();
        this.gameMgr.xiazhu(parseInt(customEventData));
    }

    onButtonSitDown(e:cc.Event.EventTouch,customEventData:string){
        cc.log(this.dbgstr('坐下 onButtonSitDown'),e,customEventData);
        this.gameMgr.audio.btnEnter();
        this.gameMgr.sitDown();
    }

    onDestroy(){
        this.gameMgr.gameScript = null;
        this.playersScript = null;
        this.gameMgr.isGameEndFinal = false;
    }

    showAnmEmoji(player:any, id) {
        this.gameMgr.showAnmEmoji(player,id);
    }

    getPlayerNode(player):cc.Node {
        return this.gameMgr.getPlayerHeadView(player);
    }
    
}
