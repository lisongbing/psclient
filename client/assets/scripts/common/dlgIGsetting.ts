// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let uping = false;

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property([cc.SpriteFrame])
    bg: cc.SpriteFrame[] = [];

    togbg:any = [];
    togCfg:any = {};
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let r = this.node;

        // 配置项
        let togn = ['sound','music','sfx','jietu','zhendong','daoju',];
        togn.forEach(e => {
            this.togCfg[e] = cc.find('Toggle_'+e, r).getComponent(cc.Toggle);
        });

        // 桌布
        let p = cc.find('Node_bgtogs', r);
        for (let i = 0; i < 6; i++) {
            let tog = cc.find('Toggle'+i, p).getComponent(cc.Toggle);
            tog.node.active = false;
            this.togbg.push(tog);
        }
    }

    start () {

    }

    // update (dt) {}

    // ---------------------------------------------------------------------------------------------------

    up(data) {
        cc.log('up', data);

        uping = true;

        this.node.active = true;

        let ison = cc.sys.localStorage.getItem('isBGMOn');
        (ison==1) ? this.togCfg['music'].check() : this.togCfg['music'].uncheck();
        ison = cc.sys.localStorage.getItem('isSFXOn');
        (ison==1) ? this.togCfg['sfx'].check() : this.togCfg['sfx'].uncheck();
        ison = cc.sys.localStorage.getItem('isGVoiceOn');
        (ison==1) ? this.togCfg['sound'].check() : this.togCfg['sound'].uncheck();
 
        ison = cc.sys.localStorage.getItem('isJietu');
        (ison==1) ? this.togCfg['jietu'].check() : this.togCfg['jietu'].uncheck();
        ison = cc.sys.localStorage.getItem('isZhendong');
        (ison==1) ? this.togCfg['zhendong'].check() : this.togCfg['zhendong'].uncheck();
        ison = cc.sys.localStorage.getItem('isDaoju');
        (ison==1) ? this.togCfg['daoju'].check() : this.togCfg['daoju'].uncheck();


        this.togbg.forEach(e => e.node.active = false);

        // @ts-ignore
        let gmbg = cc.sys.localStorage.getItem(`${cc.g.hallMgr.curGameType}_deskbg`);
        for (let i = 0; i < GMGrp.mahjong.length; i++) {
            if (GMGrp.mahjong[i] == cc.g.hallMgr.curGameType) {
                gmbg = gmbg || '3';
                this.togbg[3].node.active = true;
                this.togbg[4].node.active = true;
                this.togbg[5].node.active = true;
                break;
            }
        }
        for (let i = 0; i < GMGrp.poker.length; i++) {
            if (GMGrp.poker[i] == cc.g.hallMgr.curGameType) {
                gmbg = gmbg || '0';
                this.togbg[0].node.active = true;
                this.togbg[1].node.active = true;
                this.togbg[2].node.active = true;
                break;
            }
        }
        for (let i = 0; i < GMGrp.zipai.length; i++) {
            if (GMGrp.zipai[i] == cc.g.hallMgr.curGameType) {
                gmbg = gmbg || '0';
                this.togbg[0].node.active = true;
                this.togbg[1].node.active = true;
                this.togbg[2].node.active = true;
                break;
            }
        }

        gmbg = gmbg || 0;
        
        this.togbg[gmbg].check();

        uping = false;
        return;

        {/*
            //@api:1021,@type:req
            message GetPlayerScoreReq{}

            //@api:1021,@type:resp
            message GetPlayerScoreResp{
                repeated ScoreInfo list = 1;
                int64 data = 2;
            }

            message ScoreInfo {
                repeated int32 values = 1;
                int32 total = 2;
                int64 uid = 3;
                string name = 4;
                string icon = 5;
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.GET_PLAYERS_SCORE);
        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.GET_PLAYERS_SCORE, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                //cc.log('创建俱乐部包间 成功');

                //this.lsData.data = resp.data;
                //this.lsData.list=[];
                resp.list.forEach(e => {
                    let o = {
                        total:e.total,
                        uid:e.uid,
                        name:e.name,
                        icon:e.icon,
                        sco:[],
                    };
                    e.values.forEach(v =>o.sco.push(v));
                    //this.lsData.list.push(o);
                });

                //cc.log('lsData', this.lsData);
            } else {
                //cc.log('创建俱乐部包间 失败');
            }
        });
    }

    onTogCfg(evt, data) {
        cc.log('onTogCfg', data);

        if (uping) return;

        let ison = evt.isChecked;

        let togn = [,'music','sfx','jietu','zhendong','daoju',];
        if (data == 'sound') {
            this.onVoice(ison);
        } else if (data == 'music') {
            this.onMusic(ison);
        } else if (data == 'sfx') {
            this.onSfx(ison);
        } else if (data == 'jietu') {
            this.onJietu(ison);
        } else if (data == 'zhendong') {
            this.onZhendong(ison);
        } else if (data == 'daoju') {
            this.onDaoju(ison);
        }
    }

    onVoice (ison) {
        // @ts-ignore
        cc.g.audioMgr.setGVoiceOn(ison);

        // @ts-ignore
        if (cc.g.hallMgr.inGameMenu) {
            // @ts-ignore
            cc.g.hallMgr.inGameMenu.onGVoiceSwitch();
        }
    }

    onMusic (ison) {
        // @ts-ignore
        cc.g.audioMgr.setBGMOn(ison);

        // @ts-ignore
        if (cc.g.hallMgr.curGameMgr) {
            // @ts-ignore
            if (cc.g.hallMgr.curGameMgr.onBGMSwitch) {
                // @ts-ignore
                cc.g.hallMgr.curGameMgr.onBGMSwitch(cc.g.audioMgr.isBGMOn);
            }
        }
    }

    onSfx (ison) {
        // @ts-ignore
        cc.g.audioMgr.setSFXOn(ison);
    }

    onJietu (ison) {
        // @ts-ignore
        cc.sys.localStorage.setItem('isJietu', ison ? 1 : 0);
        // @ts-ignore
        GameConfig.isJietu = ison;
    }
    onZhendong (ison) {
        // @ts-ignore
        cc.sys.localStorage.setItem('isZhendong', ison ? 1 : 0);
        // @ts-ignore
        GameConfig.isZhendong = ison;
    }
    onDaoju (ison) {
        // @ts-ignore
        cc.sys.localStorage.setItem('isDaoju', ison ? 1 : 0);
        // @ts-ignore
        GameConfig.isDaoju = ison;
    }
    



    onTogBg(evt, data) {
        cc.log('onTogBg', data);

        if (uping) return;

        // @ts-ignore
        let gmbg = `${cc.g.hallMgr.curGameType}_deskbg`;

        cc.sys.localStorage.setItem(gmbg, data);

        // @ts-ignore
        cc.g.hallMgr.curGameMgr.gameScript.upDeskbg();
    }


    onBtnClose(evt, data) {
        cc.log('onBtnClose');
        
        this.node.active = false;
    }
}
