// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PlayerInfo from "./playerInfo";
import RoomInfo from "./roomInfo";
//

const ttpsRuleMaxNiuPower = {
    "24":{
        "40":5,
        "41":5,
        "42":6,
        "43":7,
        "44":8,
        "45":9,
        "46":10,
    },
    "25":{
        "40":6,
        "41":6,
        "42":7,
        "43":8,
        "44":9,
        "45":10,
        "46":10,
    },
    "26":{
        "40":10,
        "41":10,
        "42":10,
        "43":10,
        "44":10,
        "45":10,
        "46":10,
    },
    "27":{
        "40":11,
        "41":11,
        "42":12,
        "43":13,
        "44":14,
        "45":15,
        "46":15,
    },
}

const ttpsRuleXZPower = {
    "1":"2/4/8",
    "2":"4/8/16",
    "3":"5/10/20",
    "4":"10/20/40",
    "5":"20/40/80",
    "6":"50/100/200",
    "7":"100/200/400"
}


export default class Logic {
    public QZMaxBei(self:PlayerInfo,uidToPlayerInfo:Map<string,PlayerInfo>,roomInfo:RoomInfo):number{
        let base = roomInfo.getBase();
        let cardTypeMaxPower :number = 0;
        let fixRule:number = 24;
        let rules = roomInfo.getRules();
        let xzRuleNum:number = 0;  //下注的规则
        let maxQZValue = 1;
        rules.forEach((e) =>{
            switch (e){
                case 24:
                    cardTypeMaxPower = 3;
                break;
                case 25:
                    cardTypeMaxPower = 4;
                    fixRule = e;
                break;
                case 26:
                    cardTypeMaxPower = 5;
                    fixRule = e;
                break;
                case 27:
                    cardTypeMaxPower = 10;
                    fixRule = e;
                break;
                case 1:
                    xzRuleNum = e;
                    //xzMaxPower = parseInt(ss[ss.length - 1]);
                break;
                case 2:
                    xzRuleNum = e;
                break;
                case 3:
                    xzRuleNum = e;
                break;
                case 4:
                    xzRuleNum = e;
                break;
                case 5:
                    xzRuleNum = e;
                break;
                case 6:
                    xzRuleNum = e;
                break;
                case 7:
                    xzRuleNum = e;
                break;
                case 13:
                    maxQZValue = 1;
                break;
                case 14:
                    maxQZValue = 2;
                break;
                case 15:
                    maxQZValue = 3;
                break;
                case 16:
                    maxQZValue = 4;
                break;
            }
        });

        rules.forEach((e) =>{
            let powers = ttpsRuleMaxNiuPower['' + fixRule];
            if (powers){
                if (powers[''+ e]){
                    if (cardTypeMaxPower  < powers[''+ e]){
                        cardTypeMaxPower = powers[''+ e];
                    }
                }
            }
        })

        let ss:string[] = (<string>ttpsRuleXZPower[xzRuleNum + '']).split('/');
        let xzpowerArray:number[] = [];
        ss.forEach ((s) =>{
            xzpowerArray.push(parseInt(s));
        })
        //决定自己 最高抢庄倍数
        for (let power:number = maxQZValue; power > 0;power-- ){
            //通赔
            let maxLose:number = 0;
            let oneLose = power * cardTypeMaxPower * base;
            uidToPlayerInfo.forEach( (p) =>{
                for (let i = xzpowerArray.length - 1;i >=0;i--){
                    if (p.getScore() >= oneLose *  xzpowerArray[i]){
                        maxLose += oneLose *  xzpowerArray[i];
                        break;
                    }
                }
                  
            } )
            if (maxLose <= self.getScore()){
                return power;
            }
        }

        return 0;
    }

    public XZMaxBei(self:PlayerInfo,uidToPlayerInfo:Map<string,PlayerInfo>,roomInfo:RoomInfo):number{
        let base = roomInfo.getBase();
        let qzPower:number = 1;
        let cardTypeMaxPower :number = 0;
        let fixRule:number = 24;
        let rules = roomInfo.getRules();
        let xzRuleNum:number = 0;  //下注的规则

        //计算庄家的power
        let dealer = roomInfo.getDealer();
        let player:PlayerInfo = null;
        if (self.getUid() == dealer){
            player = self;
        }else{
            player = uidToPlayerInfo.get(dealer + '');
        }
        
        

        rules.forEach((e) =>{
            switch (e){
                case 24:
                    cardTypeMaxPower = 3;
                break;
                case 25:
                    cardTypeMaxPower = 4;
                    fixRule = e;
                break;
                case 26:
                    cardTypeMaxPower = 5;
                    fixRule = e;
                break;
                case 27:
                    cardTypeMaxPower = 10;
                    fixRule = e;
                break;
                case 1:
                    xzRuleNum = e;
                    //xzMaxPower = parseInt(ss[ss.length - 1]);
                break;
                case 2:
                    xzRuleNum = e;
                break;
                case 3:
                    xzRuleNum = e;
                break;
                case 4:
                    xzRuleNum = e;
                break;
                case 5:
                    xzRuleNum = e;
                break;
                case 6:
                    xzRuleNum = e;
                break;
                case 7:
                    xzRuleNum = e;
                break;
            }
        });

        rules.forEach((e) =>{
            let powers = ttpsRuleMaxNiuPower['' + fixRule];
            if (powers){
                if (powers[''+ e]){
                    if (cardTypeMaxPower  < powers[''+ e]){
                        cardTypeMaxPower = powers[''+ e];
                    }
                }
            }
        })

        let ss:string[] = (<string>ttpsRuleXZPower[xzRuleNum + '']).split('/');
        let xzpowerArray:number[] = [];
        ss.forEach ((s) =>{
            xzpowerArray.push(parseInt(s));
        })
        if (!player){
            return xzpowerArray[0];
        }
        qzPower = player.getPower();

        for (let i = xzpowerArray.length - 1;i >=0;i--){
            if (self.getScore() >= qzPower *  xzpowerArray[i] * base * cardTypeMaxPower){
                return xzpowerArray[i];
            }
        }

        return xzpowerArray[0];
    }
}


