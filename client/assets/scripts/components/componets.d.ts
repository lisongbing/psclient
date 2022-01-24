// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const {ccclass, property} = cc._decorator;
export declare module gameBaselib { // 这个hellolib就是zz.js中导出的Object

    declare class gameBase{ // 这个 World 就是 zz.js 中导出的名字，并且在xx.js中是个Object就可以了

        dbgstr(info:string):string;
        @property(cc.SpriteFrame) // 这个sayHello方法，就是 js 中真正有的方法，名字对得上就可以了
        moneyIconSpriteFrame = gameBase.moneyIconSpriteFrame;
        public onLoad():void;
        initBackPlayView():void;
        getDeskbgNode():any;
        upDeskbg():void;
        OnInGMTip(player):void;
        getPlayerNode(player):any; 
        getPlayerTalkPos(player):any;
        getInviteNode(pos):any;
        getSelfPlayerNode ():any;
        setPlayerBaseInfo(player):void;
        resetGame():void;
        getHitNode():any;
        onSomeTip():void;
        resetDialog(player):void;
        showDialog(player, id):void;
        // 创建一个简易的骨骼动画对象
        crtAnmObj(node):any;
        // 显示动画表情
        showAnmEmoji(player, id):void;


        // 显示互动表情界面
        showInteractDlg(player, pos):void;
        // 显示互动表情
        showInteractEmo(from, to, id):void;
        getInteractEmoPos(from, to):void;

        // 亲友圈邀请
        showDlgQyqyq():void;

        showGameHint(text, startPos, endPos, moveTime, startWaitTime, endWaitTime):void;
        setGameTextHint(text, b):void;

        gameEndCheck():void;

        updateGVoiceStatus(memberId, status, duration):void;

        updateGVoiceStatus_old(memberId, status):void;

        update(dt):void;
    }

}

