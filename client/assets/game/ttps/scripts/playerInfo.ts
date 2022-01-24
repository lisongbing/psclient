// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * Uid:    p.uid,
		Money:  p.money,
		Status: int32(p.status),
		Icon:   p.icon,
		Name:   p.name,
		DeskId: int32(p.deskId),
		End:    p.end,
		Power:  int32(p.power),
		Start:  p.start,
        Reward
 * 
 */

export default class PlayerInfo{
    // LIFE-CYCLE CALLBACKS:

    private uid:number = 0;
    private deskId:number = 0;
    private cards:number[] =[];
    private name:string = "";
    private icon:string = "";
    private isOnline:boolean = false;
    private status:number = 0;
    private score:number = 0;
    private iconSpriteFrame:cc.SpriteFrame = null;
    private reward:number = 0;//每局的输赢
    private start:number  = 0; //开始时间
    private end:number    = 0;
    private power:number  = 0;//倍率
    private lastTuiZhuNum:number = 0;//上一次推注局数
    private lastWinValue:number = 0;//上一句的输赢情况 用于推注的计算
    private isWatch:boolean = false;
   

    constructor(isWatch:boolean,lastWinValue:number,lastTuiZhuNum:number,money:number,reward:number,start:number,end:number,power:number,status:number,uid:number,deskId:number,name:string,icon:string){
        this.uid = uid;
        this.deskId = deskId;
        this.name = name;
        this.icon = icon;
        this.isOnline = true;
        this.score = money;
        this.status = status;
        this.reward = reward;
        this.lastWinValue = lastWinValue;
        this.lastTuiZhuNum = lastTuiZhuNum;
        this.start = start;
        this.end = end;
        this.isWatch = isWatch;
    }

    public setIsWatch(isWatch:boolean){
        this.isWatch = isWatch;
    }

    public getIsWatch():boolean{
        return this.isWatch;
    }

    public setReward(reward:number){
        this.reward = reward;
    }

    public getReward():number{
        return this.reward;
    }
    
    public setLastWinValue(num:number){
        this.lastWinValue = num;
    }

    public getLastWinValue():number{
        return this.lastWinValue;
    }

    public setLastTuiZhuNum(num:number){
        this.lastTuiZhuNum = num;
    }

    public getLastTuiZhuNum():number{
        return this.lastTuiZhuNum;
    }

    public setStart(start:number){
        this.start = start;
    }

    public getStart():number{
        return this.start;
    }

    public getEnd():number{
        return this.end;
    }

    public setEnd(end:number){
        this.end = end;
    }

    public setPower(power:number){
        if (power < 1){
            power = 1;
        }
        this.power = power;
    }

    public getPower():number{
        return this.power;
    }

    public getUid():number{
        return this.uid;
    }

    public getDeskId():number{
        return this.deskId;
    }

    public setIsOnline(ol:boolean){
        this.isOnline = ol;
    }

    public getIsOnline():boolean{
        return this.isOnline;
    }

    public setStatus(status:number){
        this.status = status;
    }

    public getStatus():number{
        return this.status;
    }

    public getName():string{
        return this.name;
    }

    public getIcon():string{
        return this.icon;
    }

    public setCards(cards:number[]){
        this.cards = [];
        for(let i = 0;i < cards.length;i++){
            this.cards.push(cards[i]);
        }
    }

    public addCard(card:number){
        this.cards.push(card);
    }

    public resetCards(){
        this.cards = [];
    }

    public getCards():number[]{
        return this.cards;
    }

    setScore(score:number){
        this.score = score;
    }

    getScore():number{
        return this.score;
    }

    setIconSpriteFrame(spriteFrame:cc.SpriteFrame){
        this.iconSpriteFrame = spriteFrame;
    }

    getIconSpriteFrame():cc.SpriteFrame{
        return this.iconSpriteFrame;
    }

}
