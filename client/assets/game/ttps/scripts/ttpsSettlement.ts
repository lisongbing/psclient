// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PlayerInfo from "./playerInfo";
import TTPSSEttlePlayer from "./ttpsSettlePlayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TTPSSettlement extends cc.Component {

    @property(cc.Prefab)
    playerPrefab: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    setRoomInfo(type:string,id:number,num:number){
        let room = this.node.getChildByName('RoomInfo');
        room.getChildByName('Type').getComponent(cc.Label).string = '普通牛';
        room.getChildByName('Id').getComponent(cc.Label).string = '房间号:' + id;
        room.getChildByName('Num').getComponent(cc.Label).string = '第' + num.toString() + '局';
    }

    setTime(time:string){
        this.node.getChildByName('Time').getComponent(cc.Label).string = time;
    }

    setContentPlayer(ms:any[],self:PlayerInfo,uidToPlayerInfo:Map<string,PlayerInfo>){
        let players:cc.Node = this.node.getChildByName('Content_player');
        ms.forEach((m,index) =>{
            let isSelf:boolean = false;
            let name:string = '';
            let icon:string = '';
            if (eq64(self.getUid(),m.uid)){
                name = self.getName();
                isSelf = true;
                icon = self.getIcon();
            }else{
                let player = uidToPlayerInfo.get('' + m.uid);
                if (player){
                    name = player.getName();
                    icon = player.getIcon();
                }
            }
            let playerNode:cc.Node = cc.instantiate(this.playerPrefab);
            let script = (<TTPSSEttlePlayer>playerNode.getComponent('ttpsSettlePlayer'));
            script.init(isSelf,m.winlose,m.uid,m.totalscore,m.qiangNum,m.dangZhuanNum,m.tuiNum,name,icon);
            players.addChild(playerNode,index,"Player" + index);
        })
    }

    addBackhallButtonEvent(){
        let node = this.node.getChildByName('Button_backhall');
        cc.g.utils.addClickEvent(node, this.node.parent.getChildByName('Canvas'), 'ttps', 'onSettleFinal', 1);
    }

    init(type:string,id:number,num:number,time:number,ms:any[],self:PlayerInfo,uidToPlayerInfo:Map<string,PlayerInfo>){
        this.setRoomInfo(type,id,num);
        this.setTime(cc.g.utils.getFormatTimeXXX(i64v(time)*1000, 'Y|.|M|.|D| |h|:|m|:|s|'));
        this.setContentPlayer(ms,self,uidToPlayerInfo);
        this.addBackhallButtonEvent();
    }

    formatDate(time:number,strFormat?:any){
        if (!time) return;

        if(!strFormat) strFormat = 'yyyy-MM-dd';
  
        let strDate = new Date(time);
        if (strDate instanceof Date){
            const dict:any = {
                yyyy: strDate.getFullYear(),
                M: strDate.getMonth() + 1,
                d: strDate.getDate(),
                H: strDate.getHours(),
                m: strDate.getMinutes(),
                s: strDate.getSeconds(),
                MM: ("" + (strDate.getMonth() + 101)).substring(1),
                dd: ("" + (strDate.getDate() + 100)).substring(1),
                HH: ("" + (strDate.getHours() + 100)).substring(1),
                mm: ("" + (strDate.getMinutes() + 100)).substring(1),
                ss: ("" + (strDate.getSeconds() + 100)).substring(1),

            };
            return strFormat.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g,function(){
                return dict[arguments[0]];
            });
        }
    }

    // update (dt) {}
}
