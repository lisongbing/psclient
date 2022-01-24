// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class TTPSSEttlePlayer extends cc.Component {

    @property(cc.SpriteFrame)
    winBG: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    loseBG: cc.SpriteFrame = null;

    @property([cc.BitmapFont])
    font:cc.BitmapFont[] = [];

    // LIFE-CYCLE CALLBACKS:

    //onLoad () {}

    start () {

    }

    setBGSpriteFrame(win:number){
    
        if (win.valueOf() >= 0){
            this.node.getChildByName('BG').getComponent(cc.Sprite).spriteFrame = this.winBG;
        }else{
            this.node.getChildByName('BG').getComponent(cc.Sprite).spriteFrame = this.loseBG;
        }
    }

    setIconSpriteFrame(icon:string){
        if (icon){
            let sprite = this.node.getChildByName('Icon').getComponent(cc.Sprite);

            if (icon.length > 4) {
                cc.g.utils.setUrlTexture(sprite, icon);
            }else{
                if(icon === '') {
                    sprite.spriteFrame = cc.loader.getRes('textures/head/head_animal_0', cc.SpriteFrame);
                } else {
                    sprite.spriteFrame = cc.loader.getRes('textures/head/head_animal_' + icon, cc.SpriteFrame);
                }
            }
        }
        
    }

    setNick(name:string){
        this.node.getChildByName('Nick').getComponent(cc.Label).string = name;
    }

    setUid(uid:number){
        this.node.getChildByName('Uid').getComponent(cc.Label).string = uid.toString();
    }

    setScore(score:number){
        this.node.getChildByName('Score').getComponent(cc.Label).string = '积分:' + (score * 0.01).toFixed(2);
    }

    setQZT(qNum:number,zNum:number,tNum:number){
        let qNumNode = cc.find('QZT/Qiang/Num',this.node);
        let zNumNode = cc.find('QZT/Zhuan/Num',this.node);
        let tNumNode = cc.find('QZT/Tui/Num',this.node);

        this.setLableNodeValue(qNumNode,'' + qNum);
        this.setLableNodeValue(zNumNode,'' + zNum);
        this.setLableNodeValue(tNumNode,'' + tNum);

    }

    setLableNodeValue(node:cc.Node,value:string){
        node.getComponent(cc.Label).string = value;
    }

    setWin(value:number){
        let winNode = cc.find('Win/Value',this.node);
        if (value.valueOf() >= 0){
            winNode.getComponent(cc.Label).font = this.font[0];
        }else{
            winNode.getComponent(cc.Label).font = this.font[1];
        }
        
        this.setLableNodeValue(winNode,(value * 0.01).toFixed(2).toString());
    }

    showXZ(show:boolean){
        this.node.getChildByName('XZ').active = show;
    }

    init(isSelf:boolean,win:number,uid:number,score:number,qNum:number,zNum:number,tNum:number,name:string,icon:string){
        this.setBGSpriteFrame(win);
        this.setWin(win);
        this.setIconSpriteFrame(icon);
        this.setNick(name);
        this.setUid(uid);
        this.setScore(score);
        this.setQZT(qNum,zNum,tNum);
        this.showXZ(isSelf);
    }

    // update (dt) {}
}
