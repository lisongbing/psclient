// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
export default class RoomInfo {

    roomId:number = 0;   //房间号
    status:number = 0;   //状态
    rules: number[] =[]; //规则
    totalNum: number = 0; //总共多少人
    gameType: number = 0; //游戏类型
    clubId:  number  = 0;  //茶馆号
    roomType:number = 0;    //房间类型
    base:number  = 0; //底分
    limit:number = 0; //限制
    gameNum:number = 0;
    start:number = 0;
    end: number = 0;
    curGameNum:number = 0;
    dealer:number     = 0;
    private randomZjs:number[] = [];


    constructor(randomZjs:number[],roomId:number,status:number,rules:number[],totalNum: number,
        clubId:number,roomType:number,base:number,limit:number,curGameNum:number,gameNum:number,dealer:number){
        this.roomId = roomId;
        this.status =status;
        this.rules = rules;
        this.totalNum =totalNum;
        this.clubId = clubId;
        this.roomType = roomType;
        this.base = base * 100;
        this.limit = limit;
        this.gameNum = gameNum;
        this.curGameNum = curGameNum;
        this.dealer = dealer;
        this.randomZjs = randomZjs;
    }

    public setRandomZjs(zjs:number[]){
        this.randomZjs = zjs;
    }

    public getRandomZjs():number[]{
        return this.randomZjs;
    }

    getRoomId():number{
        return this.roomId;
    }

    getStatus():number{
        return this.status;
    }

    setStatus(status:number){
        this.status = status;
    }

    getRules():number[]{
        return this.rules;
    }

    getTotalNum():number{
        return this.totalNum;
    }

    getClubId():number{
        return this.clubId;
    }

    getRoomType():number{
        return this.roomType;
    }

    getBase():number{
        return this.base;
    }

    getLimit():number{
        return this.limit;
    }

    getGameNum():number{
        return this.gameNum;
    }


    setEnd(end:number){
        this.end =end;
    }

    getEnd():number{
        return this.end;
    }

    setStart(start:number){
        this.start =start;
    }

    getStart():number{
        return this.start;
    }

    setCurGameName(n:number){
        this.curGameNum = n;
    }

    addCurGameNum(){
        this.curGameNum++;
    }

    getCurGameNum():number{
        return this.curGameNum;
    }

    setDealer(dealer:number){
        this.dealer = dealer;
    }

    getDealer():number{
        return this.dealer;
    }
}
