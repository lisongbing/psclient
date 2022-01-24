// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TTPS from "./ttps";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Cards extends cc.Component {

    @property(cc.SpriteAtlas)
    bgAtlas:cc.SpriteAtlas = null;

    @property(cc.SpriteFrame)
    kanPai:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    lianPai:cc.SpriteFrame = null;

    @property(cc.SpriteAtlas)
    pkAtlas: cc.SpriteAtlas = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start () {

    // }
    setKanPai(){
        let klpNode:cc.Node = this.node.getChildByName('KLP');
        let btNode:cc.Node = klpNode.getChildByName('BT');
        btNode.getComponent(cc.Sprite).spriteFrame = this.bgAtlas.getSpriteFrame('combtn_21');
        btNode.getComponent(cc.Button).clickEvents[0].customEventData = '1';
        btNode.getChildByName('Name').getComponent(cc.Sprite).spriteFrame = this.kanPai;
        this.showNode(klpNode,true);
    }

    hideKLPNode(){
        let klpNode:cc.Node = this.node.getChildByName('KLP');
        this.showNode(klpNode,false);
    }
    setLianPai(){
        let klpNode:cc.Node = this.node.getChildByName('KLP');
        let btNode:cc.Node = klpNode.getChildByName('BT');
        btNode.getComponent(cc.Sprite).spriteFrame = this.bgAtlas.getSpriteFrame('combtn_19');
        btNode.getComponent(cc.Button).clickEvents[0].customEventData = '2';
        btNode.getChildByName('Name').getComponent(cc.Sprite).spriteFrame = this.lianPai;
        this.showNode(klpNode,true);
    }

    setCardValue(index:number,value:number){
        this.node.children[index].getChildByName('value').getComponent(cc.Label).string = '' + value;
    }

    setCardSpriteFrame(index:number,spriteFrame:cc.SpriteFrame){
        this.node.children[index].getComponent(cc.Sprite).spriteFrame = spriteFrame;
    }

    showNode(node:cc.Node,show:boolean){
        node.active = show;
    }

    showKLPNode(show:boolean){
        this.showNode(this.node.getChildByName('KLP'),show);
    }

    showAllCards(){
        for (let i = 0;i < 5;i++){
            let cardNode = this.node.children[i];
            let cardValue:string = cardNode.getChildByName('value').getComponent(cc.Label).string;
            cardNode.getComponent(cc.Sprite).spriteFrame = this.pkAtlas.getSpriteFrame('pdk_card_' + cardValue);
        }
    }




    onKLButton(e:cc.Event.EventTouch,para:string){
        cc.log("onKLButton para:",para);
        if (para == '1'){
            //看牌
            let fifthNode:cc.Node = this.node.children[4];
            let cardValue:string = fifthNode.getChildByName('value').getComponent(cc.Label).string;
            fifthNode.getComponent(cc.Sprite).spriteFrame = this.pkAtlas.getSpriteFrame('pdk_card_' + cardValue);
            this.showNode(fifthNode,true);
            //显示亮牌
            this.setLianPai();
        }else if (para == '2'){
           let scene:cc.Scene = cc.director.getScene();
           let cardsValue:number[] = [];
           for (let i = 0;i < 5; i++){
               cardsValue.push(parseInt(this.node.children[i].getChildByName('value').getComponent(cc.Label).string));
           }
           (<TTPS>(scene.getChildByName('Canvas').getComponent('ttps'))).gameMgr.kaiPaiOp(cardsValue);
        }
    }

    // update (dt) {}
}
