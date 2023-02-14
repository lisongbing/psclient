// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Cards from "./cards";
import PlayerInfo from "./playerInfo";
import TTPSDef from "./ttpsDef";
import TTPSMgr from "./ttpsMgr";
import TTpsMsgQueue from "./ttpsMsgQueue";
import Logic from "./logic";

const {ccclass, property,executeInEditMode} = cc._decorator;
const flyGoldNum:number = 8;
const moneyPow:number = 0.01;
@ccclass
//@executeInEditMode
export default class Player extends cc.Component {

    @property(cc.SpriteAtlas)
    cardAtlas:cc.SpriteAtlas = null;
    @property([cc.Vec2])
    goldPositions:cc.Vec2[] = [];

    //起始发牌位置
    @property([cc.Vec2])
    startCardsPositions:cc.Vec2[] = [];

    @property([cc.Vec2])
    cardsPositions:cc.Vec2[] = [];

    //第五张发牌位置
    @property([cc.Vec2])
    fifthstartCardPositions:cc.Vec2[] = [];

    @property([cc.Vec2])
    fifthCardPositions:cc.Vec2[] = [];

    @property(cc.Prefab)
    card1: cc.Prefab = null;
    @property(cc.Prefab)
    card2to10: cc.Prefab = null;

    @property(cc.Prefab)
    head1: cc.Prefab = null;

    @property(cc.Prefab)
    head3to8: cc.Prefab = null;

    @property(cc.Prefab)
    head2and9and10: cc.Prefab = null;

    @property(cc.Prefab)
    bei: cc.Prefab = null;

    @property(cc.SpriteAtlas)
    niuAtlas:cc.SpriteAtlas = null;

    @property(cc.BitmapFont)
    winHeadFont:cc.BitmapFont = null;

    @property(cc.BitmapFont)
    loseHeadFont:cc.BitmapFont = null;

    ttpsDef:TTPSDef = new(TTPSDef);

    gameMgr:TTPSMgr = null;

    @property(cc.Prefab)
    flyGoldPrefab:cc.Prefab = null;

    flyGoldPool:cc.NodePool = null;

    qzxzLogic:Logic = new Logic();
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.flyGoldPool = new cc.NodePool();
        let initCount = flyGoldNum * 9;
        for (let i = 0; i < initCount; ++i) {
            let flyGold = cc.instantiate(this.flyGoldPrefab); // 创建节点
            this.flyGoldPool.put(flyGold); // 通过 put 接口放入对象池
        }
    
    }

    start () {
       
    }

    flyGoldDealerToWiners(dealerIndex:number,winerIndexs:number[]){
        let fromGoldNode = this.getHeadNodeByIndex(dealerIndex);
        for (let i = 0;i < winerIndexs.length;i++){
            this.flyGoldPlayerToPlayer(fromGoldNode,this.getHeadNodeByIndex(winerIndexs[i]),flyGoldNum);
        }
    }

    flyGoldLosersToDealer(dealerIndex:number,loserIndexs:number[]){
        let toGoldNode = this.getHeadNodeByIndex(dealerIndex);
        for (let i = 0;i < loserIndexs.length;i++){
            this.flyGoldPlayerToPlayer(this.getHeadNodeByIndex(loserIndexs[i]),toGoldNode,flyGoldNum);
        }
    }

    //num 金币个数
    flyGoldPlayerToPlayer(pHead1:cc.Node,pHead2:cc.Node,num:number){
        for (let k = 0; k < num; k++){
            let flyNode = this.createFlyGold(this.node,pHead1);
            let Icon = pHead2.getChildByName('Icon');
            let pos0 = pHead2.convertToWorldSpaceAR(Icon.position);
            let pos1 = this.node.convertToNodeSpaceAR(pos0);
            this.flyGoldAction(flyNode,k,pos1);
        }
    }

    flyGoldAction(goldNode:cc.Node,index:number,pos:cc.Vec3){
        let t = cc.tween;
        t(goldNode)
            // 同时执行两个 cc.tween
            .parallel(
                t().to(0.5 + 0.1 * index, { scale: 0.2 }),
                t().to(0.5 + 0.1 * index, { position: pos})
            )
            .delay(0.5)
            .call(() => {
                console.log('All tweens finished.');
                this.flyGoldPool.put(goldNode);
            })
            .start()
    }

    createFlyGold(parentNode:cc.Node,startNode:cc.Node):cc.Node {
        let goldFlyNode:cc.Node = null;
        if (this.flyGoldPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            goldFlyNode = this.flyGoldPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            goldFlyNode = cc.instantiate(this.flyGoldPrefab);
        }
        //goldFlyNode.parent = parentNode; 
        parentNode.addChild(goldFlyNode,1,"node");
        let pos0 = startNode.getChildByName('Icon').convertToWorldSpaceAR(cc.v2(0,0));
        let pos1 = parentNode.convertToNodeSpaceAR(pos0);
        goldFlyNode.setPosition(pos1);
        return goldFlyNode;
        //goldFlyNode.getComponent('flyGold').init(); //接下来就可以调用  身上的脚本进行初始化
    }

    //更新或者添加玩家视图
    updateOrSetPlayerView(self:PlayerInfo,other:PlayerInfo,totalNum:number){
        let viewIndex:number = this.getViewIndex(self,other,totalNum);
        let playerNode = this.getPlayerViewByIndex(viewIndex);
        let area1:cc.Node = playerNode.getChildByName("Area1");
        let area2:cc.Node = playerNode.getChildByName("Area2");

        this.setHeaderView(area1,other);
        this.setCardsView(area2,other);
       // this.setPlayerView(viewIndex,other);
    }

    //删除玩家视图
    deletePlayerView(self:PlayerInfo,other:PlayerInfo,totalNum:number){
        let viewIndex:number = this.getViewIndex(self,other,totalNum);
        this.startView(viewIndex);
    }

    setHeaderView(area1:cc.Node,playerInfo:PlayerInfo){
        let headNode:cc.Node = area1.getChildByName('Head');
        if (headNode){
            let iconNode = headNode.getChildByName('Icon');
            let sprite = iconNode.getComponent(cc.Sprite);
            let nickNode = headNode.getChildByName('Nick');
            let scoreNode = headNode.getChildByName('Score');
            if (sprite.spriteFrame){
                let spriteFrame = this.setIconSprite(sprite,playerInfo.getIcon());
                playerInfo.setIconSpriteFrame(spriteFrame);
                iconNode.active = true;
            }
            this.setLableNodeString(nickNode,playerInfo.getName());
            this.setLableNodeString(scoreNode,'' + (playerInfo.getScore() * moneyPow).toFixed(2));
        }
    }

    setCardsView(area2:cc.Node,playerInfo:PlayerInfo){
        let headNode:cc.Node = area2.getChildByName('Cards');
    }

    getPlayerViewByIndex(index:number):cc.Node{
        return this.node.getChildByName("Player" + index);
    }

    clearView(index:number){
        let player:cc.Node = this.node.getChildByName("Player" + index);
        let area1:cc.Node = player.getChildByName("Area1");
        let area2:cc.Node = player.getChildByName("Area2");
        area1.removeAllChildren();
        area2.removeAllChildren();        
    }

    startView(index:number){
        let player:cc.Node = this.node.getChildByName("Player" + index);
        let area1:cc.Node = player.getChildByName("Area1");
        let area2:cc.Node = player.getChildByName("Area2");
        this.hideHeadAndGold(area1);
        this.hideCards(area2);     
        this.setReadyView(index,false);   
    }

    hideHeadAndGold(area1:cc.Node){
        let head = area1.getChildByName("Head");
        let bei  = area1.getChildByName("Bei")
        head.getChildByName("Icon").active = false;
        head.getChildByName("Nick").active = false;
        head.getChildByName("Score").active = false;
        bei.active = false;
    }

    hideCards(area2:cc.Node){
        area2.getChildByName("Cards").active = false;
    }

    createPlayerView(index:number){
        if (index < 1 || index > 10){
            return;
        }
        let headPrefab:cc.Prefab = this.head1;
        let cardsPrefab:cc.Prefab = this.card1;
        //头像
        if (index == 2 || index == 9 || index == 10){
            headPrefab = this.head2and9and10;
        }else if (index >= 3 && index <= 8){
            headPrefab = this.head3to8;
        }

        if (index > 1){
            cardsPrefab = this.card2to10;
        }

        let player:cc.Node = this.node.getChildByName("Player" + index);
        let area1:cc.Node = player.getChildByName("Area1");
        let area2:cc.Node = player.getChildByName("Area2");
        let head:cc.Node = cc.instantiate(headPrefab);
       
        let bei:cc.Node = cc.instantiate(this.bei);
        let cards:cc.Node = cc.instantiate(cardsPrefab);
        area1.removeAllChildren();
        area2.removeAllChildren();
        area1.addChild(head,0,"Head");
        area1.addChild(bei);
        area2.addChild(cards);
        bei.setPosition(this.goldPositions[index - 1]);
        cards.setPosition(this.startCardsPositions[index - 1]);

        let fifthNode:cc.Node = cards.children[4];
        fifthNode.active = false;
        fifthNode.setPosition(this.fifthstartCardPositions[index - 1]);

        if (index == 1){  //自己
            for (let i = 0;i < 5;i++){
                cards.children[i].getComponent(cc.Sprite).spriteFrame = this.cardAtlas.getSpriteFrame('pdk_card_back');
            }
        }
        cards.active = false;
    }

    initStartView(){
        this.gameMgr.uidPlayers.forEach(player =>{
            
            let index = this.getViewIndex(this.gameMgr.selfPlayer,player,this.gameMgr.ttpsRoomInfo.getTotalNum());
            this.setPlayerView(index,player);
            if (!player.getIsWatch()){
                this.showCanTZ(player);
            }
            
        })
        
            this.setPlayerView(1,this.gameMgr.selfPlayer);
            if (!this.gameMgr.selfPlayer.getIsWatch()){
                this.showCanTZ(this.gameMgr.selfPlayer);
            }

    }

    //根据uid 获得 视图index 
    getViewIndex(self:PlayerInfo,other:PlayerInfo,totalNum:number):number{
        if (self.getUid() == other.getUid()){
            return 1;
        }else{
            let v = other.getDeskId() - self.getDeskId();
            if (v < 0){
                v += totalNum;
            }
            return v + 1;
        }
    
    }

    //设置玩家视图
    setPlayerView(index:number,playerInfo:PlayerInfo){
        playerInfo.setIconSpriteFrame(this.setIconSpriteByIndex(index,playerInfo.getIcon()));
        this.setNameByIndex(index,playerInfo.getName());
        this.setScoreByIndex(index,playerInfo.getScore());
        //准备手势
        this.setReadyView(index,playerInfo.getStatus() == TTPSDef.PlayerSta.Ready.v);
        //庄家view
        this.showDealerView(index,eq64(this.gameMgr.ttpsRoomInfo.getDealer(),playerInfo.getUid()));
        
        if (!playerInfo.getIsWatch()){
            //QZbtn
            this.showQZBT(index.valueOf() == 1 && this.gameMgr.ttpsRoomInfo.getStatus() == this.ttpsDef.RMSTA.QZ.v && this.gameMgr.selfPlayer.getStatus() == TTPSDef.PlayerSta.FP.v);
            //XZbtn
            this.showXZBT(index.valueOf() == 1 && this.gameMgr.ttpsRoomInfo.getStatus() == this.ttpsDef.RMSTA.XZ.v && this.gameMgr.selfPlayer.getStatus() >= TTPSDef.PlayerSta.FP.v &&
            !eq64(this.gameMgr.selfPlayer.getUid(),this.gameMgr.ttpsRoomInfo.getDealer());
            //Cards
            this.showCardsView(index,playerInfo);   
        }

        
    }

    setScoreByIndex(index:number,score:number){
        let player:cc.Node = this.node.getChildByName("Player" + index);
        if (player){
            let area1:cc.Node = player.getChildByName("Area1");
            let scoreNode = area1.getChildByName('Head').getChildByName('Score');
            this.setLableNodeString(scoreNode,'' + (score * moneyPow).toFixed(2));
            scoreNode.active = true;
        
        }
    }

    setNameByIndex(index:number,name:string){
        let player:cc.Node = this.node.getChildByName("Player" + index);
        if (player){
            let area1:cc.Node = player.getChildByName("Area1");
            let nickNode = area1.getChildByName('Head').getChildByName('Nick');
            this.setLableNodeString(nickNode,name);
            nickNode.active = true;
        }
    }

    setLableNodeString(lableNode:cc.Node,s:string){
        lableNode.getComponent(cc.Label).string = s; 
        lableNode.active = true;   
    }
    

    //通过索引设置头像
    setIconSpriteByIndex(index:number,iconUrl:string):cc.SpriteFrame{
        let spriteFrame:cc.SpriteFrame = null;
        let player:cc.Node = this.node.getChildByName("Player" + index);
        if (player){
            let area1:cc.Node = player.getChildByName("Area1");
            let iconNode = area1.getChildByName('Head').getChildByName('Icon');
            let sprite = iconNode.getComponent(cc.Sprite);
            iconNode.active = true;
            spriteFrame = this.setIconSprite(sprite,iconUrl);
        }
        return spriteFrame;
    }

    setIconSprite(sprite:cc.Sprite,iconUrl:string):cc.SpriteFrame{
        let spriteFrame = null;
        if (iconUrl.length > 4) {
            cc.g.utils.setUrlTexture(sprite, iconUrl);
            spriteFrame = sprite.spriteFrame;
        }else{
            if(iconUrl === '') {
                spriteFrame = cc.loader.getRes('textures/head/head_animal_0', cc.SpriteFrame);
            } else {
                spriteFrame = cc.loader.getRes('textures/head/head_animal_' + iconUrl, cc.SpriteFrame);
            }
            sprite.spriteFrame = spriteFrame;
        }
        return spriteFrame;
    }

    getHeadNodeByIndex(index:number):cc.Node{
        let playerNode = this.getPlayerViewByIndex(index);
        return playerNode.getChildByName('Area1').getChildByName('Head');
    }

    onClickFaPai(e,p){
        cc.log(e,p);
       

        for (let i = 0;i <this.node.children.length;i++){
            
            let node1 = this.node.children[i];
            let cardsNode = node1.getChildByName("Area2").getChildByName('Cards');
            cardsNode.active = true;
            if (i == 0){  //自己
                cardsNode.setScale(1.0,1.0);
                for (let i = 0;i < cardsNode.children.length;i++){
                    cardsNode.children[i].getComponent(cc.Sprite).spriteFrame = this.cardAtlas.getSpriteFrame('pdk_card_5');
                }
            }
            let spawn = cc.spawn(cc.moveTo(0.5, this.cardsPositions[i]), cc.scaleTo(0.5, 1.0, 1.0));
            cardsNode.runAction(spawn);
        }
    }

    faiPai1(cards:number[],selfPlayerInfo:PlayerInfo,uidToPlayerInfo:Map<string,PlayerInfo>,totalNum:number){
    
        if (cards.length > 0 && eq64(selfPlayerInfo.getStatus(),TTPSDef.PlayerSta.Ready.v)){
            let node1 = this.node.children[0]; //自己
            let cardsNode = node1.getChildByName("Area2").getChildByName('Cards');
            //托管手势
            this.setReadyView(1,false);
            cardsNode.active = true;
            let cardsScript = (<Cards>cardsNode.getComponent('cards'));
            for (let i = 0;i < cards.length;i++){
                cardsScript.setCardSpriteFrame(i,this.cardAtlas.getSpriteFrame('pdk_card_' + cards[i]));
                cardsScript.setCardValue(i,cards[i]);
                //cardsNode.children[i].getComponent(cc.Sprite).spriteFrame = this.cardAtlas.getSpriteFrame('pdk_card_' + cards[i]);
            }
            // let spawn = cc.spawn(cc.moveTo(0.5, this.cardsPositions[0]), cc.scaleTo(0.5, 1.0, 1.0));
            // cardsNode.runAction(spawn);

            let t = cc.tween;
            t(cardsNode)
                // 同时执行两个 cc.tween
                .parallel(
                    t().to(0.2, { scale: 1 }),
                    t().to(0.2, { position: this.cardsPositions[0] })
                )
                // .call(() => {
                //     console.log('All tweens finished.');
                   

                // })
                .start()
        }

        uidToPlayerInfo.forEach((player) =>{
            if (eq64(player.getStatus(),TTPSDef.PlayerSta.Ready.v) && !player.getIsWatch()){
                let indexView = this.getViewIndex(selfPlayerInfo,player,totalNum);
                //托管手势
                this.setReadyView(indexView,false);
                let node1 = this.node.children[indexView - 1];
                let cardsNode = node1.getChildByName("Area2").getChildByName('Cards');
                cardsNode.active = true;
                let spawn = cc.spawn(cc.moveTo(0.5, this.cardsPositions[indexView - 1]), cc.scaleTo(0.5, 1.0, 1.0));
                cardsNode.runAction(spawn);
            }

        })

        this.gameMgr.audio.faPai();
    }


    
    faiPai2(cards:number[],selfPlayerInfo:PlayerInfo,uidToPlayerInfo:Map<string,PlayerInfo>,totalNum:number){
        
        if (cards.length > 0){
            let node1 = this.node.children[0]; //自己
            let cardsNode = node1.getChildByName("Area2").getChildByName('Cards');
            let cardsScript = (<Cards>cardsNode.getComponent('cards'));        
            cardsScript.setCardSpriteFrame(4,this.cardAtlas.getSpriteFrame('pdk_card_back'));
            cardsScript.setCardValue(4,cards[0]);
            this.showXZBT(false);
            let fifthCardNode:cc.Node = cardsNode.children[4];
            fifthCardNode.active = true;
            let t = cc.tween;
            t(fifthCardNode)
                // 同时执行两个 cc.tween
                .parallel(
                    t().to(0.2, { scale: 1 }),
                    t().to(0.2, { position: this.fifthCardPositions[0]})
                )
                .call(() => {
                    console.log('All tweens finished.');
                    if (eq64(this.gameMgr.ttpsRoomInfo.watchDeskId,-1)){
                        cardsScript.setKanPai();
                    }else{
                        cardsScript.hideKLPNode();
                    }
                    
                })
                .start()
        }

        uidToPlayerInfo.forEach((player) =>{
            if (player.getStatus() >= TTPSDef.PlayerSta.Ready.v && !player.getIsWatch()){
                let indexView = this.getViewIndex(selfPlayerInfo,player,totalNum);
                let node1 = this.node.children[indexView - 1];
                let cardsNode = node1.getChildByName("Area2").getChildByName('Cards');
                let fifthCardNode:cc.Node = cardsNode.children[4];
                fifthCardNode.getComponent(cc.Sprite).spriteFrame = this.cardAtlas.getSpriteFrame('pdk_card_back');
                fifthCardNode.active = true;
                let spawn = cc.spawn(cc.moveTo(0.5, this.fifthCardPositions[indexView - 1]),cc.scaleTo(0.5, 0.32, 0.32));
                fifthCardNode.runAction(spawn);
            }

        })

        this.gameMgr.audio.faPai();
    }

    qiangZhuan(index:number,para:number[]){
        this.setQZBeiView(index,para[0]);
        if (index == 1){
            this.node.parent.getChildByName('QZBT').active = false;
        }
    }

    dingZhuan(index:number,para:number[],self:PlayerInfo,uidToPlayerInfo:Map<string,PlayerInfo>,totalNum:number){
        this.schedule(this.gameMgr.audio.randomDealer,1,para[1] - 1);
        let randomZjs:number[] = [];
        for (let i = 2; i < para.length;i++){
            let uid:number = para[i];
            randomZjs.push(uid);
            if (eq64(uid,self.getUid())){
                if (index == 1){
                    let headNode:cc.Node = this.getHeadNodeByIndex(index);
                    let xzNode = headNode.getChildByName('XuanZhong');
                    xzNode.active = true;
                    let t = cc.tween;
                    t(xzNode)
                        .blink(para[1], 6)
                        .call(() => {
                            this.afterDingZAction(para[0],index,self,uidToPlayerInfo,totalNum);  
                            //this.gameMgr.audio.stopRandomDealer(this.gameMgr.audio.effid);  
                            this.gameMgr.audio.dingzhuan();                     
                        })
                        .start()
                }else{
                    let headNode:cc.Node = this.getHeadNodeByIndex(1);
                    let xzNode = headNode.getChildByName('XuanZhong');
                    xzNode.active = true;
                    let t = cc.tween;
                    t(xzNode)
                        .blink(para[1], 6)
                        .call(() => {
                            xzNode.active = false;                       
                        })
                        .start()
                }
            }else{
                let player:PlayerInfo = uidToPlayerInfo.get(uid + '');
                if (eq64(uid,player.getUid())){
                    let playerIndexView = this.getViewIndex(self,player,totalNum);
                    if (playerIndexView == index){//庄家
                        let headNode:cc.Node = this.getHeadNodeByIndex(index);
                        let xzNode = headNode.getChildByName('XuanZhong');
                        xzNode.active = true;
                        let t = cc.tween;
                        t(xzNode)
                            .blink(para[1], 6)
                            .call(() => {
                                this.afterDingZAction(para[0],index,self,uidToPlayerInfo,totalNum); 
                               // this.gameMgr.audio.stopRandomDealer(this.gameMgr.audio.effid); 
                                this.gameMgr.audio.dingzhuan();                      
                            })
                            .start()
                    }else{
                        let headNode:cc.Node = this.getHeadNodeByIndex(playerIndexView);
                        let xzNode = headNode.getChildByName('XuanZhong');
                        xzNode.active = true;
                        let t = cc.tween;
                        t(xzNode)
                            .blink(para[1], 6)
                            .call(() => {
                                xzNode.active = false;                       
                            })
                            .start()
                    }
                }
            }
        }
        this.gameMgr.ttpsRoomInfo.setRandomZjs(randomZjs);
    }

    //定庄后的动作
    afterDingZAction(power:number,index:number,self:PlayerInfo,uidToPlayerInfo:Map<string,PlayerInfo>,totalNum:number){
        let playerNode = this.getPlayerViewByIndex(index);
        let zhuanNode:cc.Node = cc.find('Area1/Head/Zhuan',playerNode);
        zhuanNode.active = true;
        //其他人的倍数 或者不清要去掉
        if (index != 1){
            let selfPlayerNode = this.getPlayerViewByIndex(1);
            this.hideBeiNode(selfPlayerNode);
        }

        uidToPlayerInfo.forEach( (player) =>{
            let pIndex = this.getViewIndex(self,player,totalNum);
            if (pIndex != index){
                let playerViewNode:cc.Node = this.getPlayerViewByIndex(pIndex);
                this.hideBeiNode(playerViewNode);
            }
        })

        //庄家的倍数不能是0
        if (power.valueOf() == 0){
            let beiNode = cc.find('Area1/Bei',playerNode);
            this.showBeiGoldNode(beiNode,1);
            
        }
    }

    showBeiGoldNode(beiNode:cc.Node,beiNum:number){
        let numNode = beiNode.getChildByName('Num');
        beiNode.getChildByName('Gold').active = true;
        numNode.getComponent(cc.Label).string = 'X' + beiNum;
        let rbeiNum = this.getTuiZhuBeiNum();
        let tzNode =  beiNode.getChildByName('TZ');
        if (rbeiNum == beiNum){
           tzNode.active = true;
        }else{
            tzNode.active = false;
        }
        numNode.active = true;
        beiNode.getChildByName('BuQiang').active = false;
    }

    showBeiBuQiang(beiNode:cc.Node){
        let numNode = beiNode.getChildByName('Num');
        beiNode.getChildByName('Gold').active = false;
        numNode.active = false;
        beiNode.getChildByName('BuQiang').active = true;
    }

    xiazhu(index:number,para:number[]){
        let playerNode = this.getPlayerViewByIndex(index);
        let beiNode:cc.Node = cc.find('Area1/Bei',playerNode);
        this.showBeiGoldNode(beiNode,para[0]);
        beiNode.active = true;
        if (index == 1){
            this.showXZBT(false);
        }
        
    }

    showXZBT(show:boolean){
        let node = this.node.parent.getChildByName('XZBT');
        if (!eq64(this.gameMgr.ttpsRoomInfo.watchDeskId,-1)){
            node.active = false;
            return;
        }
        node.active = show;
        if (show){
            let maxPower = this.qzxzLogic.XZMaxBei(this.gameMgr.selfPlayer,this.gameMgr.uidPlayers,this.gameMgr.ttpsRoomInfo);
            for (let i = 0;i < node.childrenCount - 1;i++){ //正常按钮
                if (parseInt(node.children[i].getComponent(cc.Button).clickEvents[0].customEventData) <= maxPower){
                    node.children[i].active = true;
                }else{
                    node.children[i].active = false;
                }
            }
            //推注
            let self = this.gameMgr.selfPlayer;
            let v1= parseInt(self.getLastTuiZhuNum() + '') + 1;
            let v2 = this.gameMgr.ttpsRoomInfo.getCurGameNum()
            if (this.getTuiZhuBeiNum() > 0 && v1 < v2 && self.getLastWinValue() > 0 && this.uidInUids(self.getUid(),this.gameMgr.ttpsRoomInfo.getRandomZjs())){
                node.children[node.childrenCount - 1].active = true;
            }else{
                node.children[node.childrenCount - 1].active = false;
            }
        }
    }

    uidInUids(uid:number,uids:number[]):boolean{
        for (let i = 0;i < uids.length;i++){
            if (eq64(uid,uids[i])){
                return true;
            }
        }

        return false;
    }

    hideBeiNode(playerNode:cc.Node){
        let beiNode:cc.Node = cc.find('Area1/Bei',playerNode);
        beiNode.active = false;
    }

    hideZhuanNode(index:number){
        let zhuanNode:cc.Node = this.getHeadNodeByIndex(index).getChildByName('Zhuan');
        zhuanNode.active = false;
    }

    hideWinLableNode(index:number){
        let WinLableNode:cc.Node = this.getHeadNodeByIndex(index).getChildByName('Win');
        WinLableNode.active = false;
    }

    hideXuanZhong(index:number){
        let xuanZhongNode:cc.Node = this.getHeadNodeByIndex(index).getChildByName('XuanZhong');
        xuanZhongNode.active = false;
    }

    kaiPai(index:number,cards:number[]){
        let cardsNode:cc.Node = this.getCardsNode(index);
        if (index == 1) { //自己
            let cardsScript = (<Cards>cardsNode.getComponent('cards'));
            cardsScript.showAllCards();
            //消失看牌按钮
            cardsScript.hideKLPNode();
        }else{
            for (let i = 0;i < 5;i++){
                cardsNode.children[i].getComponent(cc.Sprite).spriteFrame = this.cardAtlas.getSpriteFrame('pdk_card_' + cards[i]);
            }
        }
        //第六个是 牛几
        cardsNode.getChildByName('Niu').getComponent(cc.Sprite).spriteFrame = this.niuAtlas.getSpriteFrame('niu_' + cards[5]);
        this.gameMgr.audio.niu(cards[5]);
    }

    xiaojuResult(self:PlayerInfo,uidToPlayerInfo:Map<string,PlayerInfo>,totalNum:number,vs:number[]){
        let winers:number[] = [];
        let losers:number[] = [];
        let dealerViewIndex:number = null;
        for(let i = 0;i < vs[0];i++){
            let player:PlayerInfo = null;
            if (eq64(self.getUid(),vs[2*i + 1])){
                player = self;
                this.showPersonWin(1,vs[2*i + 2]);
            }else{
                player = uidToPlayerInfo.get(vs[2*i + 1] + '');
                if (player){
                    let viewIndex = this.getViewIndex(self,player,totalNum);
                    this.showPersonWin(viewIndex,vs[2*i + 2]);
                }
            }

            //推注逻辑
            if (!eq64(player.getUid(),this.gameMgr.ttpsRoomInfo.getDealer())){
                player.setLastWinValue(vs[2*i + 2]);
            }else{
                player.setLastWinValue(0);
            }
            
            
            //除了庄家的
            let viewIndex = this.getViewIndexByUid(vs[2*i + 1]);
            if (eq64(this.gameMgr.ttpsRoomInfo.getDealer(),vs[2*i + 1])){
                dealerViewIndex = viewIndex;
            }else{
                if (vs[2*i + 2].valueOf() > 0){
                    winers.push(viewIndex);
                } else{
                    losers.push(viewIndex);
                }
            }
        }
        this.gameMgr.audio.flyGold();
        this.flyGoldDealerToWiners(dealerViewIndex,winers);
        this.flyGoldLosersToDealer(dealerViewIndex,losers);
    }

    getViewIndexByUid(uid:number):number{
        if (eq64(this.gameMgr.selfPlayer.getUid(),uid)){
            return 1;
        }else{
            let player = this.gameMgr.uidPlayers.get('' + uid);
            return this.getViewIndex(this.gameMgr.selfPlayer,player,this.gameMgr.ttpsRoomInfo.getTotalNum())
        }
    }

    showPersonWin(indexView:number,value:number){
        let header = this.getHeadNodeByIndex(indexView);
        let winNode = header.getChildByName('Win');
        if (indexView == 2){
            winNode.setPosition(-80,25);
        }
        let labelCommpent = winNode.getChildByName('Num').getComponent(cc.Label);
        if (value >= 0){
            labelCommpent.font = this.winHeadFont;
        }else{
            labelCommpent.font = this.loseHeadFont;
        }
        
        labelCommpent.string = '' + (value * moneyPow).toFixed(2);
        winNode.active = true;
    }

    showHeadShadow(indexView:number,show:boolean){
        let header = this.getHeadNodeByIndex(indexView);
        header.getChildByName('Icon').getChildByName('Shadow').active = show;
    }

    getCardsNode(index:number):cc.Node{
        let playerNode = this.node.getChildByName('Player'+ index);
        return playerNode.getChildByName('Area2').getChildByName('Cards');
    }

    //玩家OP更新视图
    handlerOpPlayerView(self:PlayerInfo,other:PlayerInfo,uidToPlayerInfo:Map<string,PlayerInfo>,totalNum:number,op:any){
        let viewIndex:number = this.getViewIndex(self,other,totalNum);
        switch (op.k){
            case TTPSDef.PlayerOpt.Ready.v:  //准备
                this.setReadyView(viewIndex,true);
                if (viewIndex == 1 || self.getIsWatch()){   
                    this.resetPlayersCards(self,uidToPlayerInfo,totalNum);
                    this.resetPlayersBei(self,uidToPlayerInfo,totalNum);
                    this.resetZhuan(self,uidToPlayerInfo,totalNum);
                    this.resetXuanZhong(self,uidToPlayerInfo,totalNum);
                    this.resetWinLable(self,uidToPlayerInfo,totalNum);
                }
                
            break;

            case TTPSDef.PlayerOpt.OP_FP1.v:   //发牌1
                this.faiPai1(op.v,self,uidToPlayerInfo,totalNum);
            break;

            case TTPSDef.PlayerOpt.OP_QZ.v:
                this.qiangZhuan(viewIndex,op.v);
                if (viewIndex == 1){
                    this.gameMgr.selfPlayer.setPower(op.v[0]);
                }else{
                    this.gameMgr.uidPlayers.get(other.getUid() + '').setPower(op.v[0]);
                }
            break;

            case TTPSDef.PlayerOpt.OP_ZJ.v:
                this.gameMgr.ttpsRoomInfo.setDealer(other.getUid());
                this.dingZhuan(viewIndex,op.v,self,uidToPlayerInfo,totalNum);
            break;

            case TTPSDef.PlayerOpt.OP_XZ.v:
                this.xiazhu(viewIndex,op.v);
                //设置倍数
                let tuiZhuPlayer :PlayerInfo = null;
                if (viewIndex == 1){
                    tuiZhuPlayer = this.gameMgr.selfPlayer;
                }else{
                    tuiZhuPlayer = this.gameMgr.uidPlayers.get(other.getUid() + '');    
                }
                tuiZhuPlayer.setPower(op.v[0]);
                this.showCanTZ(tuiZhuPlayer);
                if (op.v.length > 1){  //推注
                    this.gameMgr.audio.tz();
                    tuiZhuPlayer.setLastTuiZhuNum(this.gameMgr.ttpsRoomInfo.getCurGameNum());
                }

            break;

            case TTPSDef.PlayerOpt.OP_FP2.v:
                this.faiPai2(op.v,self,uidToPlayerInfo,totalNum);
            break;

            case TTPSDef.PlayerOpt.OP_KP.v:
                this.kaiPai(viewIndex,op.v);
            break;

            case TTPSDef.PlayerOpt.OP_XJJS.v:
                this.xiaojuResult(self,uidToPlayerInfo,totalNum,op.v)
            break;

            case TTPSDef.PlayerOpt.OP_KS.v:

            break;

            case TTPSDef.PlayerOpt.OP_JS.v:
                this.gameMgr.ttpsRoomInfo.setCurGameName(op.v[0]);
                this.gameMgr.gameScript.setJs();
                cc.g.hallMgr.curGameMgr.roomInfo.curGameNum = op.v[0];
                cc.g.hallMgr.inGameMenu.upBtnShow();
            break;

            case TTPSDef.PlayerOpt.OP_TG.v:

            break;
            case TTPSDef.PlayerOpt.OP_RS.v:
                if (viewIndex == 1){
                    this.gameMgr.selfPlayer.setStatus(TTPSDef.PlayerSta.RSHu.v)
                    this.gameMgr.selfPlayer.setIsWatch(true);
                }
            break;
        }
    }

    //upCoin
        
    upPlayerViewCoin(self:PlayerInfo,other:PlayerInfo,uidToPlayerInfo:Map<string,PlayerInfo>,totalNum:number,money:number){
        let viewIndex:number = this.getViewIndex(self,other,totalNum);
        let headNode = this.getHeadNodeByIndex(viewIndex);
        if (viewIndex == 1){
            this.gameMgr.selfPlayer.setScore(money);
        }else{
            this.gameMgr.uidPlayers.get('' + other.getUid()).setScore(money);
        }
        headNode.getChildByName('Score').getComponent(cc.Label).string = (money * moneyPow).toFixed(2) + '';
    }

    setReadyView(viewIndex:number,show:boolean){
        let player:cc.Node = this.node.getChildByName("Player" + viewIndex);
        if (player){
            let area1:cc.Node = player.getChildByName("Area3");
            area1.getChildByName('Ready').active = show;
            //自己的视图
            if (viewIndex.valueOf() == 1){
                if (show){  
                    this.hideArea4();  
                }else{
                    if (this.gameMgr.ttpsRoomInfo.getStatus() == this.ttpsDef.RMSTA.Free.v){
                        this.showStartBtn(eq64(this.gameMgr.ttpsRoomInfo.watchDeskId,-1));
                    }else{
                        this.hideArea4();  
                    }
                }
            } 
        }
    }

    showDealerView(viewIndex:number,show:boolean){
        let player:cc.Node = this.node.getChildByName("Player" + viewIndex);
        if (player){
            let area1:cc.Node = player.getChildByName("Area1");
            area1.getChildByName('Head').getChildByName('Zhuan').active = show;
        }
    }

    
    setQZBeiView(viewIndex:number,v:number){
        let player:cc.Node = this.node.getChildByName("Player" + viewIndex);
        if (player){
            let area1:cc.Node = player.getChildByName("Area1");
            let beiNode:cc.Node = area1.getChildByName('Bei');
            beiNode.getChildByName('TZ').active = false;
            if (v.valueOf() == 0){
                beiNode.getChildByName('Gold').active = false;
                beiNode.getChildByName('BuQiang').active = true;
                beiNode.getChildByName('Num').active =false;
                this.gameMgr.audio.bqz();
            }else{
                this.gameMgr.audio.qz();
                beiNode.getChildByName('Gold').active = true;
                beiNode.getChildByName('BuQiang').active = false;
                let numNode = beiNode.getChildByName('Num');
                numNode.active = true;
                beiNode.getChildByName('Num').getComponent(cc.Label).string = 'X' + v;    
            }
            beiNode.active = true;
            
        }
    }

    hideArea4(){
        let area4:cc.Node = this.node.getChildByName("Player1").getChildByName('Area4');
        for (let i = 0; i < area4.childrenCount;i++){
            area4.children[i].active = false;
        }
    }

    showStartBtn(show:boolean){
        let area4:cc.Node = this.node.getChildByName("Player1").getChildByName('Area4'); 
        area4.getChildByName('Button_ready').active = show && !this.gameMgr.ttpsRoomInfo.getCurGameNum();    
    }

    handlerRoomStatus(){
        this.gameMgr.gameScript.hideTicker();
        switch (this.gameMgr.ttpsRoomInfo.getStatus()){
            case this.ttpsDef.RMSTA.Free.v:
                if (this.gameMgr.ttpsRoomInfo.getGameNum() != this.gameMgr.ttpsRoomInfo.getCurGameNum()){
                    //this.showStartBtn(); 
                    this.gameMgr.gameScript.setTicker('等待开局',this.gameMgr.ttpsRoomInfo.getStart(),this.gameMgr.ttpsRoomInfo.getEnd());
                }
            break;
            case this.ttpsDef.RMSTA.QZ.v:
                this.gameMgr.gameScript.setTicker('抢庄中',this.gameMgr.ttpsRoomInfo.getStart(),this.gameMgr.ttpsRoomInfo.getEnd());
                if (!this.gameMgr.selfPlayer.getIsWatch()){
                    this.showQZBT(this.gameMgr.selfPlayer.getStatus().valueOf() == TTPSDef.PlayerSta.FP.v);
                }
            break;
            case this.ttpsDef.RMSTA.XZ.v:
                this.gameMgr.gameScript.setTicker('下注中',this.gameMgr.ttpsRoomInfo.getStart(),this.gameMgr.ttpsRoomInfo.getEnd());
                if (!this.gameMgr.selfPlayer.getIsWatch()){
                    this.showXZBT(!eq64(this.gameMgr.selfPlayer.getUid(),this.gameMgr.ttpsRoomInfo.getDealer()) && this.gameMgr.selfPlayer.getStatus().valueOf() >= TTPSDef.PlayerSta.FP.v);
                    this.gameMgr.uidPlayers.forEach(value =>{
                        this.showCanTZ(value);
                    })
                    this.showCanTZ(this.gameMgr.selfPlayer);
                }

            break;
            case this.ttpsDef.RMSTA.KP.v:
                this.hideCanTZ(this.gameMgr.selfPlayer);
                this.gameMgr.uidPlayers.forEach(p =>{
                    this.hideCanTZ(p);
                })
                this.gameMgr.gameScript.setTicker('开牌中',this.gameMgr.ttpsRoomInfo.getStart(),this.gameMgr.ttpsRoomInfo.getEnd());
            break;

            case this.ttpsDef.RMSTA.RS.v:
                this.gameMgr.gameScript.setTicker('结算中',this.gameMgr.ttpsRoomInfo.getStart(),this.gameMgr.ttpsRoomInfo.getEnd());
            break;
        }
    }

    showQZBT(show:boolean){
        let qz:cc.Node = this.node.parent.getChildByName('QZBT');
        if (!eq64(this.gameMgr.ttpsRoomInfo.watchDeskId,-1)){
            qz.active = false;
            return;
        }
        let maxPower:number = this.qzxzLogic.QZMaxBei(this.gameMgr.selfPlayer,this.gameMgr.uidPlayers,this.gameMgr.ttpsRoomInfo);
        let ruleMaxPower:number = 1;
        this.gameMgr.ttpsRoomInfo.getRules().forEach(r =>{
            if (r > 12 && r < 17){
                ruleMaxPower = r - 12;
            }
        });
        for (let i = 0;i < qz.childrenCount;i++){
           let v:number = parseInt(qz.children[i].getComponent(cc.Button).clickEvents[0].customEventData);
           if (v <= maxPower && v <= ruleMaxPower){
               qz.children[i].active = true;
           }else{
               qz.children[i].active = false;
           }
        }
        qz.active = show;
    }

    showCanTZ(player:PlayerInfo){
        let viewIndex = this.getViewIndex(this.gameMgr.selfPlayer,player,this.gameMgr.ttpsRoomInfo.getTotalNum());
        if (this.gameMgr.ttpsRoomInfo.getStatus() == this.ttpsDef.RMSTA.XZ.v && player.getStatus().valueOf() >= TTPSDef.PlayerSta.FP.v){
            if (eq64(player.getUid(),this.gameMgr.ttpsRoomInfo.getDealer())){
                this.getHeadNodeByIndex(viewIndex).getChildByName('KTZ').active = false;
            }else if (this.getTuiZhuBeiNum() > 0 && ((parseInt(player.getLastTuiZhuNum() + '') + 1) < this.gameMgr.ttpsRoomInfo.getCurGameNum()) && player.getLastWinValue() > 0 && this.uidInUids(player.getUid(),this.gameMgr.ttpsRoomInfo.getRandomZjs())){
                this.getHeadNodeByIndex(viewIndex).getChildByName('KTZ').active = true;
            }else{
                this.getHeadNodeByIndex(viewIndex).getChildByName('KTZ').active = false;
            }
        }else{
            this.getHeadNodeByIndex(viewIndex).getChildByName('KTZ').active = false;
        }

    }

    hideCanTZ(player:PlayerInfo){
        let viewIndex = this.getViewIndex(this.gameMgr.selfPlayer,player,this.gameMgr.ttpsRoomInfo.getTotalNum());
        this.getHeadNodeByIndex(viewIndex).getChildByName('KTZ').active = false;
    }

    showCardsView(index:number,player:PlayerInfo){
        let cardsNode:cc.Node = this.getCardsNode(index);
        let cardsValue:number[] = player.getCards();
        if (index == 1){ //自己
            if (cardsValue && cardsValue.length > 0){
                cardsNode.active = true;
                cardsNode.setPosition(this.cardsPositions[0]);  //位置
                for (let i = 0;i < cardsValue.length;i++){
                    let cardNode = cardsNode.children[i];
                    cardNode.getChildByName('value').getComponent(cc.Label).string = '' + cardsValue[i];
                    cardNode.getComponent(cc.Sprite).spriteFrame = this.cardAtlas.getSpriteFrame('pdk_card_' + cardsValue[i]);
                }
                if (cardsValue.length == 4){
                    cardsNode.children[4].setPosition(this.fifthstartCardPositions[0]);
                    cardsNode.children[4].active = false;
                }else{  //5个
                    cardsNode.children[4].setPosition(this.fifthCardPositions[0]);
                    cardsNode.children[4].active = true;
                }
                //开牌阶段
                if (this.gameMgr.ttpsRoomInfo.getStatus() == this.ttpsDef.RMSTA.KP.v && this.gameMgr.selfPlayer.getStatus() < TTPSDef.PlayerSta.KP.v){
                    (<Cards>cardsNode.getComponent('cards')).setLianPai();
                }
            }else{
                cardsNode.active = false;
                cardsNode.setPosition(this.startCardsPositions[0]);
                for (let i = 0;i < 5;i++){
                    let cardNode = cardsNode.children[i];
                    cardNode.getChildByName('value').getComponent(cc.Label).string = '';
                    cardNode.getComponent(cc.Sprite).spriteFrame = this.cardAtlas.getSpriteFrame('pdk_card_back');
                }
                cardsNode.children[4].setPosition(this.fifthstartCardPositions[0]);
                cardsNode.children[4].active = false;
            }
        }else{
            let roomStatus = this.gameMgr.ttpsRoomInfo.getStatus().valueOf();
            if ( roomStatus < this.ttpsDef.RMSTA.FP.v){
                for (let i = 0;i < 5;i++){
                    let cardNode = cardsNode.children[i];
                    cardNode.getComponent(cc.Sprite).spriteFrame = this.cardAtlas.getSpriteFrame('pdk_card_back');
                }
                cardsNode.setPosition(this.startCardsPositions[index - 1]);
                cardsNode.children[4].setPosition(this.fifthstartCardPositions[index - 1]);
                cardsNode.children[4].active = false;
                cardsNode.active = false;
            }else if (roomStatus < this.ttpsDef.RMSTA.FP2.v){
                for (let i = 0;i < 4;i++){
                    let cardNode = cardsNode.children[i];
                    cardNode.getComponent(cc.Sprite).spriteFrame = this.cardAtlas.getSpriteFrame('pdk_card_back');
                }
                cardsNode.setPosition(this.cardsPositions[index - 1]);
                cardsNode.children[4].setPosition(this.fifthstartCardPositions[index - 1]);
                cardsNode.children[4].active = false;
                cardsNode.active = true;
            }else if (roomStatus == this.ttpsDef.RMSTA.FP2.v){
                for (let i = 0;i < 5;i++){
                    let cardNode = cardsNode.children[i];
                    cardNode.getComponent(cc.Sprite).spriteFrame = this.cardAtlas.getSpriteFrame('pdk_card_back');
                }
                cardsNode.setPosition(this.cardsPositions[index - 1]);
                cardsNode.children[4].setPosition(this.fifthCardPositions[index - 1]);
                cardsNode.children[4].active = true;
                cardsNode.active = true;
            }else{  //开牌后
                for (let i = 0;i < 5;i++){
                    let cardNode = cardsNode.children[i];
                    cardNode.getComponent(cc.Sprite).spriteFrame = this.cardAtlas.getSpriteFrame('pdk_card_' + cardsValue[i]);
                }
                cardsNode.setPosition(this.cardsPositions[index - 1]);
                cardsNode.children[4].setPosition(this.fifthCardPositions[index - 1]);
                cardsNode.children[4].active = true;
                cardsNode.active = true;
            }
        }
    }

    resetPlayersBei(self:PlayerInfo,uidToPlayerInfo:Map<string,PlayerInfo>,totalNum:number){
        if (self){
            this.hideBeiNode(this.getPlayerViewByIndex(1));
        }
        uidToPlayerInfo.forEach(player =>{
            let viewIndex:number = this.getViewIndex(self,player,totalNum);
            this.hideBeiNode(this.getPlayerViewByIndex(viewIndex));
        })
    }

    resetWinLable(self:PlayerInfo,uidToPlayerInfo:Map<string,PlayerInfo>,totalNum:number){
        if (self){
            this.hideWinLableNode(1);
        }
        uidToPlayerInfo.forEach(player =>{
            let viewIndex:number = this.getViewIndex(self,player,totalNum);
            this.hideWinLableNode(viewIndex);
        })
    }

    resetZhuan(self:PlayerInfo,uidToPlayerInfo:Map<string,PlayerInfo>,totalNum:number){
        if (self){
            this.hideZhuanNode(1);
        }
        uidToPlayerInfo.forEach(player =>{
            let viewIndex:number = this.getViewIndex(self,player,totalNum);
            this.hideZhuanNode(viewIndex);
        })
    }

    resetXuanZhong(self:PlayerInfo,uidToPlayerInfo:Map<string,PlayerInfo>,totalNum:number){
        if (self){
            this.hideXuanZhong(1);
        }
        uidToPlayerInfo.forEach(player =>{
            let viewIndex:number = this.getViewIndex(self,player,totalNum);
            this.hideXuanZhong(viewIndex);
        })
    }

    resetPlayersCards(self:PlayerInfo,uidToPlayerInfo:Map<string,PlayerInfo>,totalNum:number){
        //自己
        this.resetOnePlayerCards(1);

        uidToPlayerInfo.forEach(player =>{
            this.resetOnePlayerCards(this.getViewIndex(self,player,totalNum));
        })
    }

    resetOnePlayerCards(index:number){
        //自己
        let myCardsNode:cc.Node = this.getCardsNode(index);
        myCardsNode.setPosition(this.startCardsPositions[index - 1]);
        let fifthNode:cc.Node = myCardsNode.children[4];
        fifthNode.active = false;
        fifthNode.setPosition(this.fifthstartCardPositions[index - 1]);
        for (let i = 0;i < 5;i++){
            myCardsNode.children[i].getComponent(cc.Sprite).spriteFrame = this.cardAtlas.getSpriteFrame('pdk_card_back');
        }    
        myCardsNode.active = false;
        myCardsNode.getChildByName('Niu').getComponent(cc.Sprite).spriteFrame = null;
    }

     // 动画表情
     onAnmEmoji(player:PlayerInfo,id:number) {
        let viewIndex = this.getViewIndex(this.gameMgr.selfPlayer,player,this.gameMgr.ttpsRoomInfo.getTotalNum());
        let emo = cc.instantiate(cc.g.pf.chatAnmEmojiPf);
        let anm = emo.getComponent(cc.Animation);
        anm.on('stop', (a1, a2, a3)=>{
            cc.log('stop');

            // 表情没播放完就退出房间
            if (!this.gameMgr.gameScript){
                cc.log('emo.destroy() !gameScript');
                emo.destroy();
                return;
            }

            //emo.removeFromParent();
            let seq = cc.sequence(
                cc.fadeTo(0.5, 0),
                cc.callFunc(function () {
                    cc.log('emo.destroy()');
                    emo.destroy();
                }, 
                this)
            );

            emo.runAction(seq);
        });

        let clips = anm.getClips();
        let sta = anm.play(clips[id-1]._name);
        sta.repeatCount = 1;

        this.getHeadNodeByIndex(viewIndex).getChildByName('Node_txtEmoji').addChild(emo);
    }

    onClickHead(e:cc.Event.EventTouch, customEventData:string) {
        // if (customEventData == '1'){
        //     return;
        // }

        // this.headPos = this.Sprite_headbg.convertToWorldSpaceAR(cc.Vec2(0,0));
        
        // let pos = this.pPage.node.convertToNodeSpaceAR(this.headPos);
        // if (this.index == 0) {
        //     pos.x += 200;
        //     pos.y += 100;
        // } else if (this.index == 1) {
        //     pos.x -= 200;
        //     pos.y -= 100;
        // } else if (this.index == 2) {
        //     pos.x += 200;
        //     pos.y -= 100;
        // } else if (this.index == 3) {
        //     let idx = 0;

        //     if (this.pPage.___dbg) {
        //         if (!this.ididx) {
        //             this.ididx = 1;
        //         } else {
        //             ++this.ididx;
        //         }
        //         idx = (this.ididx-1)%3;
        //     } else {
        //         let zuid = this.pGame.roomInfo.dealer;
        //         if (this.pGame.uidPlayers[zuid]) {
        //             idx = this.pGame.uidPlayers[zuid].view.index;
        //         }
        //     }

        //     if (idx == 0) {
        //         pos.x += 200;
        //         pos.y += 50;
        //     } else if (idx == 1) {
        //         pos.x -= 200;
        //         pos.y -= 100;
        //     } else if (idx == 2) {
        //         pos.x += 200;
        //         pos.y -= 100;
        //     }
        // }


        // this.pPage.showInteractDlg(this.player ? this.player.d : null, pos);
    }

    getTuiZhuBeiNum():number{
        let rules = this.gameMgr.ttpsRoomInfo.getRules();
        let rbeiNum :number = 0;
        rules.forEach(r =>{
            if (r == 21){
                rbeiNum = 10;
            }else if (r == 22){
                rbeiNum = 15;
            }else if (r == 23){
                rbeiNum = 20;
            }
        })
        return rbeiNum;
    }

    // update (dt) {}
}
