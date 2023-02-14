  
var DEF = require('njmjDef');

let LG_Sta = DEF.PlayerSta;
let LG_opt = DEF.PlayerOpt;
let LG_optStr = DEF.PlayerOptStr;

cc.Class({

    dbgstr: function (info) {
        let s = '玩家'; //majhPlayer

        if (this.d) {
            s += ' ' + this.d.name + '('+this.d.uid+')';

            if (eq64(this.gm.selfUID, this.d.uid)) {
                s += ' 自己';
            }
        }

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    //初始化
    init: function (data, game) {
        // 游戏主模块（Mgr）
        this.gm = game;

        // 弃牌
        this.qiCards = []

        // 碰牌
        this.pongCards = []

        // // 碰牌
        // this.gangCards = []

        // 默认缺的牌
        this.queIndex = -1;

        // this.isAutoHu = false;

        // 初始化操作函数
        this.initOptFun();

        // 核心数据 data 存放玩家数据
        this.upCore(data);
        
        // 关联视图 找到玩家视图
        this.linkView();
    },
    // 初始化操作函数
    initOptFun: function () {
        let kf = {};
        //准备
        kf[LG_opt.Ready.v] = this.ready.bind(this);
        // 局数
        kf[LG_opt.CurJushu.v] = this.curJushu.bind(this);
        // 庄家
        kf[LG_opt.Zhuang.v] = this.zhuang.bind(this);
        // CAN飘
        kf[LG_opt.CanPiao.v] = this.canPiao.bind(this);
        // 飘
        kf[LG_opt.Piao.v] = this.doPiao.bind(this);
        //掷骰子
        kf[LG_opt.SaiZi.v] = this.doSaiZi.bind(this);
        // 发牌
        kf[LG_opt.SendCard.v] = this.sendCard.bind(this);
        //CAN报叫
        kf[LG_opt.CanBaoJiao.v] = this.canBaoJiao.bind(this);
        //报叫
        kf[LG_opt.BaoJiao.v] = this.baoJiao.bind(this);
        //CAN打牌
        kf[LG_opt.CanDaPai.v] = this.canDaPai.bind(this);
        //打牌
        kf[LG_opt.DaPai.v] = this.doDaPai.bind(this);
        //CAN碰
        kf[LG_opt.CanPeng.v] = this.canPeng.bind(this);
        //碰
        kf[LG_opt.Peng.v] = this.doPeng.bind(this);
        //CAN胡
        kf[LG_opt.CanHu.v] = this.canHu.bind(this);
        //胡
        kf[LG_opt.Hu.v] = this.doHu.bind(this);
        //CAN杠
        kf[LG_opt.CanGang.v] = this.canGang.bind(this);
        //杠
        kf[LG_opt.Gang.v] = this.doGang.bind(this);
        //摸牌
        kf[LG_opt.MoPai.v] = this.doMoPai.bind(this); 
        //申请解散
        kf[LG_opt.AskJiesan.v]  = this.askJiesan.bind(this);
        kf[LG_opt.JiesanVote.v]  = this.jiesanVote.bind(this);

        kf[LG_opt.AutoHu.v]  = this.autoHu.bind(this);


        // 存放函数数组
        this.optFun = kf;
    },

    // 更新内核 data 存放player 数据
    upCore: function (data) {
        if (! data) {
            return;
        }

        if (this.d) {
            let str = '';
            // cc.dlog(this.dbgstr('upCore ' + str));
        } else {
            // cc.dlog(this.dbgstr('upCore 新数据 ' + data.uid));
        }

        // 存放player 数据
        this.d = data;

        if (! this.curDeskID) {
            this.curDeskID = this.d.deskId;
        }

        this.dataPrepare();
    },

    // 数据准备
    dataPrepare: function () {
        if (! this.d) {
            return;
        }
        // 是否自己
        this.isSelf = eq64(this.gm.selfUID, this.d.uid);
        // 准备
        this.isReady = this.d.status > LG_Sta.Free.v;
        // 庄
        this.isZhuang = eq64(this.gm.roomInfo.dealer, this.d.uid);
        // 手牌
        this.d.cards = [];
        // 弃牌
        this.qiCards = []

        // 碰牌
        this.pongCards = []

        // 默认缺的牌
        this.queIndex = -1;

       // 当前是否票
       this.piao = -1;

        this.baoJiaoStatus = false;
        this.duZiMoStatus = false;
        this.baoGangStatus = false;
        this.isCanBaoJiao = false;

        let exclude = this.d.exclude;
        if (exclude >= 0 && this.d.status > 3) {
            this.queIndex = exclude;
        }

        // 牌
        let bti = this.d.bigtwoInfo;
        if (bti) {
            const self = this

            if (this.isSelf) {
                let handCards = bti.hand
                if (!cc.g.utils.judgeArrayEmpty(handCards)) {
                    handCards.forEach(code => {
                        self.d.cards.push(code);
                    });
                }
            }

            // 碰 杠
            let putout = bti.putout
            if (!cc.g.utils.judgeArrayEmpty(putout)) {
                putout.forEach(elm => {
                    let cards = elm.cards
                    if (cards.length == 5) {
                        let cardType = 'mkang'
                        let cardTypeNum = cards[0]
                        if (cardTypeNum == 0) { // 0 明杠 1 暗杠
                            cardType = 'mkang'
                        } else if (cardTypeNum == 1) {
                            cardType = 'akang'
                        }
                        let cardVaule = cards[1]

                        let peng = {}
                        // 输入存入玩家
                        peng.type = cardType
                        peng.code = cardVaule
                        self.pongCards.push(peng)
                    } else if (cards.length == 3) {
                        let cardType = 'peng'
                        let cardVaule = -100
                        let feiIndex = -1;
                        for (let i = 0; i < cards.length; i++) {
                            let cardVaule = cards[i]
                            if (cardVaule == 50) { // fei
                                cardType = 'fei'
                                feiIndex = i
                                break;
                            }
                        }

                        if (feiIndex == -1 || feiIndex == 1 || feiIndex == 2) {
                            cardVaule = cards[0]
                        } else if (feiIndex == 0) {
                            cardVaule = cards[1]
                        }

                        let pengtwo = {}
                        // 输入存入玩家
                        pengtwo.type = cardType
                        pengtwo.code = cardVaule
                        self.pongCards.push(pengtwo)
                    }
                });
            }

            // 弃牌
            let nouse = bti.nouse
            if (!cc.g.utils.judgeArrayEmpty(nouse)) {
                nouse.forEach(code => {
                    self.qiCards.push(code);
                });
            }
        }

        // 房间信息 空闲 (ri.status == DEF.RMSTA.Free.v)
        let ri = this.gm.roomInfo;

        // 堂出或者打出的牌
        this.waitCode = null;
        if ((ri.opcard) && (ri.opcard.value>0) && (ri.opcard.uid.toNumber() == this.d.uid.toNumber())) {
            this.waitCode = ri.opcard.value;
            // this.istang = !ri.opcard.play;
        }

        // if (this.waitCode != null) {

        //     this.gm.gameScript.codeLight = this.waitCode;
        // }

        // 胡的牌
        this.hu = this.d.hu;

        // 胡的类型 10 1自摸 20 2自摸 30 3自摸
        // 11 1 点炮 21 2点炮 31 3点炮
        this.huType = this.d.huType;

        // if (this.isSelf) {
        //     // 自动胡牌
        //     this.isAutoHu = this.d.isAutoHu
        // }

        // 可以的操作
        this.obks = null;
        if (this.isSelf && bti && bti.op > 0) {
            let opt = {};
            opt.k = bti.op;
            opt.v = [];
            if ((ri.opcard) && (ri.opcard.value>0)) {
                opt.v.push(ri.opcard.value);
            }
            if (bti.op == 128) {
                this.isCanBaoJiao = true;
            }
            this.opt(opt);
        }

        // 判断解散
        this.votetime = this.voteSta = null;
        if(ri.applyStatus && ri.applyStatus.length > 0) {
            for (let i = 1; i < ri.applyStatus.length; i++) {
                if (ri.applyStatus[i].eq(this.d.uid)) {
                    this.voteSta = 1;

                    if (i==1) {
                        this.votetime = ri.applyStatus[0];
                        this.gm.askJiesanUid = this.d.uid;
                    }

                    break;
                }
            }
        }

        // //cc.log("dataPrepare------------->", this.d);
        // if (this.d.piao >= 0) {
        //     // 票
        //     this.piao = this.d.piao
        // }

        this.piao = this.d.piao

        // if (this.huType > 0) {
        //     return;
        // }
        // 报叫
        let expandArr = this.d.expand
        if (!cc.g.utils.judgeArrayEmpty(expandArr) && (expandArr.length ==2)) {
            let expand0 = parseInt(expandArr[0]);
            // //cc.log(expand0)
            this.baoJiaoStatus  = ((expand0 == 1) ? true : false);
            this.duZiMoStatus  = ((expand0 == 2) ? true : false);

            let expand1 = parseInt(expandArr[1]);
            // //cc.log(expand1)
            this.baoGangStatus  = ((expand1 == 0) ? false : true);
        }
    },

    showNextMsg: function() {
        let ri = this.gm.roomInfo;
        let roomstatus = ri.status
        let playerstatus = this.d.status
        // 报叫
        let expandArr = this.d.expand

        //cc.log("this.piao------------->", this.piao);

        // //cc.log("DEF.RMSTA.Piao1.v------------->", DEF.RMSTA.Piao1.v);
        // //cc.log("DEF.RMSTA.Piao2.v------------->", DEF.RMSTA.Piao2.v);

        // cc.log('roomstatus--->'+roomstatus)
        // cc.log('playerstatus--->'+playerstatus)

        if (roomstatus == DEF.RMSTA.Piao1.v) { // piao 2
            let opttwo = {};
            // if (playerstatus == DEF.RMSTA.Piao2.v) { // 已经票了
            //     opttwo.k = DEF.PlayerOpt.Piao.v//16;
            //     let arr = []
            //     arr.push(this.d.piao)
            //     opttwo.v = arr;
            // } else if (playerstatus == DEF.RMSTA.Piao1.v) { // 已经票了
            //     opttwo.k = DEF.PlayerOpt.CanPiao.v//8;
            //     opttwo.v = new Array(1);
            // }

            if (playerstatus == DEF.RMSTA.Piao1.v) { // 已经票了
                // 发送可以换3张命令
                opttwo.k = DEF.PlayerOpt.Piao.v//8;
                let arr = []
                arr.push(this.d.piao)
                opttwo.v = arr;
            } else { // 还没有扣下三张
                // 发送可以换3张命令
                opttwo.k = DEF.PlayerOpt.CanPiao.v//4;
                opttwo.v = new Array(1);
            }

            this.opt(opttwo);
        }
        // else if (roomstatus > DEF.RMSTA.Piao2.v) { // 可以打牌
        //     this.gm.gameScript.doReConHiddenQueAndAnmi();
        // }

        // 更新货币
        if (this.gm != null) {
            this.gm.playerMoneyUpdated(this.d, this.d.money);
        }

        if (this.waitCode != null) {
            this.gm.gameScript.codeLight = this.waitCode;
        }

        // // 显示piao图标
        // if ((this.gm != null) && (this.gm.gameScript != null) && (roomstatus < DEF.RMSTA.Piao2.v) && (this.piao > 0)) {
        //     this.gm.gameScript.doReciveReConnectPiao(this.view, this.piao);
        // } else if ((this.gm != null) && (this.gm.gameScript != null)) {
        //     this.gm.gameScript.doReciveReConnectPiao(this.view, 0);
        // }

        // 显示piao图标
        if ((this.gm != null) && (this.gm.gameScript != null) && (roomstatus > DEF.RMSTA.Piao2.v)) {
            this.gm.gameScript.doReciveReConnectPiao(this.view, this.piao);
        }

        if (this.isCanBaoJiao) {
            if ((this.gm != null) && (this.gm.gameScript != null)) {
                this.gm.gameScript.doReciveCanBaoJiao(this.view, 0);
                this.isCanBaoJiao = false;
            }
        }


        // if ((this.gm != null) && (this.gm.gameScript != null)) {
        //     let index = this.view.index
        //     if (index == 0) {
        //         this.gm.gameScript.doReconAutoHu(this.isAutoHu);
        //     }
        // }

        if (this.baoJiaoStatus) {
            if ((this.gm != null) && (this.gm.gameScript != null)) {
                let index = this.view.index
                if (index == 0) {
                    // this.gm.gameScript.isBaoJiao = this.baoJiaoStatus;
                    this.gm.gameScript.isAutoPlay = this.baoJiaoStatus;
                    this.gm.gameScript.doReconnectShowBaoJiaoStatus(this.view, this.baoJiaoStatus);
                }
            }
        }
    },

    // 关联视图
    linkView: function () {
        // 游戏主page
        this.pg = this.gm.gameScript;

        if (! this.d) {
            // cc.dlog(this.dbgstr('linkView 没有玩家数据 无法关联视图'));
            return;
        }

        if (! this.pg) {
            // cc.dlog(this.dbgstr('linkView 没有主视图 无法关联视图'));
            return;
        }

        // 玩家对应的视图
        let v = null;
        v = this.pg.playerView[this.gm.getViewPos(this.curDeskID)];
        //v = this.pg.playerView[1];

        if (!this.view) {
            // 玩家进入
            this.view = v;
            v.playerJoin(this);
        }
    },

    // 退出
    quite: function () {
        if (! this.view) {
            return;
        }

        // cc.dlog(this.dbgstr('quite'));

        this.d = null;
        this.resetPlay();
        this.view.quite();
        this.view = null;
    },
    
    // 更新
    up: function () {
        if (! this.view) {
            return;
        }

        this.view.upView();
    },

    /************** 操作 **************/
    // 操作
    opt: function (opt) {
        {
            /*
            message OP {
                int32 k = 1;
                repeated int64 v = 2;
            }
            */
        }
        // //cc.log(opt)

        let k = opt.k;
        let v = opt.v;
        if (cc.g.utils.judgeArrayEmpty(v)) {
            v = []
        }

        let ds = this.dbgstr();
        
        if (k == LG_opt.AskJiesan.v){
            ds += LG_opt.AskJiesan.s + '-' + LG_opt.AskJiesan.v + ' ' + v.join(',');
        } else if (k == LG_opt.JiesanVote.v){
            ds += LG_opt.JiesanVote.s + '-' + LG_opt.JiesanVote.v + ' ' + v.join(',');
        } else if (k == LG_opt.BackHall.v){
            ds += LG_opt.BackHall.s + '-' + LG_opt.BackHall.v + ' ' + v.join(',');
        } else if (k == LG_opt.AutoHu.v){
            ds += LG_opt.AutoHu.s + '-' + LG_opt.AutoHu.v + ' ' + v.join(',');
        } else {
            ds += '操作位';

            let ol = [];
            for (let i = 0; i < 32; i++) {
                let o = (1 << i);
                if ((k & o) != 0) {
                    ds += ' ' + (i+1) + '-' +LG_optStr[o].s;
                    ol.push(o);
                }
            }
            ds += ' ' + v.join(',');

            // 优先处理 待处理操作
            this.obks = null;
            let t = this.doCan(ol, ds, v);
            if (t >= 0) {
                return t;
            }
        }


        // 然后是单一操作
        if (! LG_optStr[k]) {
            ds += ' 没有被分析的操作 ' + k;
        }

        // //cc.log(ds);

        // 做对应的操作, 函数数组 optFun
        if (this.optFun[k]) {
            this.optFun[k](v);
        } else {
            cc.error('没有被分配的操作', k)
            return 0;
        }

        return (LG_optStr[k] && LG_optStr[k].t) ? LG_optStr[k].t : 0;
    },
    // 可以的操作
    doCan: function (opts, ds, va) {
        let v = [];
        va.forEach(e => {
            if (e.toNumber) {
                v.push(e.toNumber());
                return;
            }

            v.push(e);
        });

        // //cc.log(v)

        let canOpt = {};
        canOpt[LG_opt.CanHu.v] = DEF.OBK.hu;
        canOpt[LG_opt.CanGang.v] = DEF.OBK.gang;
        canOpt[LG_opt.CanPeng.v] = DEF.OBK.peng;
        canOpt[LG_opt.Guo.v] = DEF.OBK.guo;
        canOpt[LG_opt.CanDaPai.v] = DEF.OBK.candp;

        let allcan = true;
        let obks = [];
        let optkv = {};
        for (let i = 0; i < opts.length; i++) {
            const e = opts[i];

            if (canOpt[e]==null || canOpt[e]==undefined) {
                allcan = false;
                break;
            } else {
                obks.push(canOpt[e]);
                optkv[e] = true;
            }
        }

        // //cc.log(allcan)

        if (! allcan) {
            return -1;
        }

        // //cc.log(optkv[LG_opt.CanDaPai.v])
        // 可以打牌，修改状态位打牌
        if (optkv[LG_opt.CanDaPai.v]) {
            this.optFun[LG_opt.CanDaPai.v](va);
        }

        // if (optkv[LG_opt.CanPeng.v]) {
        //     if (this.pg) this.pg.textHint('显示碰牌');
        //     return 1.3;
        // } else if (optkv[LG_opt.CanGang.v]) {
        //     if (this.pg) this.pg.textHint('显示杠牌');
        //     return 1.3;
        // } else if (optkv[LG_opt.CanDaPai.v]) {
        //     if (this.pg) this.pg.textHint('显示打牌');
        //     this.optFun[LG_opt.CanDaPai.v](va);
        //     return 1.3;
        // }

        // if (optkv[LG_opt.CanBao.v]) {
        //     let chc = this.getCurCanHuInfo();
        //     if (chc && chc.length > 0) {
        //         let a=[];
        //         chc.forEach(e => {
        //             a.push(e.code);
        //         });
        //         this.canhuCode = a;
        //         this.curchcInfo = chc;
        //     }
        // }

        this.time = DEF.OptTime;
        this.canOptVal = v;
        this.obks = obks;
        if (this.pg) {
            // 显示按钮
            this.pg.upOperate();
            // this.view.upHuTip();
        } else {
            // cc.dlog(this.dbgstr('doCan') + '可能遇到重新登录的重连情况');
        }

        return 0;
    },
    // 可以的操作
    // doCan: function (opts, ds, va) {
    //     let v = [];
    //     va.forEach(e => {
    //         if (e.toNumber) {
    //             v.push(e.toNumber());
    //             return;
    //         }
    //
    //         v.push(e);
    //     });
    //
    //     let canOpt = {};
    //
    //     let allcan = true;
    //     let obks = [];
    //     let optkv = {};
    //     for (let i = 0; i < opts.length; i++) {
    //         const e = opts[i];
    //
    //         if (canOpt[e]==null || canOpt[e]==undefined) {
    //             allcan = false;
    //             break;
    //         } else {
    //             obks.push(canOpt[e]);
    //             optkv[e] = true;
    //         }
    //     }
    //
    //     if (! allcan) {
    //         return -1;
    //     }
    //
    //     return 0;
    // },

    // 其他人的操作
    otherOpt: function (deskId, uid, opt) {
        let v = opt.v;
        // k 是是动作
        let k = opt.k;
        // // // 如果是飞牌动作, 移除牌
        // if (k == DEF.PlayerOpt.Fei.v) {
        //    // this.pg.doRemoveOtherPai(this.view, uid, parseInt(v));
        //     // this.pg.doReciveFei(deskId, parseInt(v));
        // } else if (k == DEF.PlayerOpt.Peng.v) {
        //    // this.pg.doRemoveOtherPai(this.view, uid, parseInt(v));
        //     // this.pg.doRecivePong(deskId, parseInt(v));
        // } else if (k == DEF.PlayerOpt.Gang.v) {
        //     this.pg.doRemoveOtherPai(this.view, uid, parseInt(v[1]));
        //     // this.pg.doReciveGang(deskId, v);
        // }
        if (k == DEF.PlayerOpt.Gang.v) {
            this.pg.doRemoveOtherPai(this.view, uid, parseInt(v[1]));
        }
    },
    // 局数
    curJushu: function (v) {
        this.gm.roomInfo.curGameNum = v[0].toNumber();
        this.pg.upTurn();

        if (this.gm.roomInfo.curGameNum == 1) {
            this.d.outLineTime = 0;
            this.view.upOnline();
        }
    },
    // 庄家
    zhuang: function (v) {
        this.isZhuang = true;
        this.gm.roomInfo.dealer = this.d.uid;
        this.view.upZhuang();
    },
    // 发牌
    sendCard: function (va) {
        //va = [1,2,3,3,6,6,6,6,8,8,11,12,13];
        // 条：1-9  
        // 筒：11-19 
        // 万：21-29
        // 红中：50

        if (this.gm.isBackPlayMode()) {
            for (const k in this.gm.uidPlayers) {
                let e = this.gm.uidPlayers[k];
                e.d.cards = cc.g.clone(e.d.hand_cards);
                e.d.cardNum = e.d.cards.length;
                e.view.upHandCard();
            }

            this.pg.doReciveSendCard(this.saiZiArr);

            return;
        }

        let v = [];
        va.forEach(e => {
            v.push(e.toNumber());
        });

        this.d.cards = v;
        this.d.cardNum = this.d.cards.length;
        this.view.upHandCard();

        // add by panbin
        this.pg.doReciveSendCard(this.saiZiArr);
    },
    // 准备
    ready: function (v) {
        this.d.status = i64v(v[0]);
        this.isReady = (this.d.status == LG_Sta.Ready.v);
        this.view.upReady();
        this.gm.onPlayerReady(this);
    },
    // 申请解散
    askJiesan: function (v) {
        this.voteSta = 1;
        if (this.pg) {
            this.pg.playerAskJiesan(this.d.uid.toNumber(), this.voteSta);
        }
    },
    // 解散投票
    jiesanVote: function (va) {
        let v = [];
        va.forEach(e => {
            if (e.toNumber) {
                v.push(e.toNumber());
                return;
            }

            v.push(e);
        });

        if (v[0] > 0) {
            this.voteSta = 1;
        } else if (v[0] == 0){
            this.voteSta = -1;
        }

        if (this.pg) {
            this.pg.playerAskJiesan(this.d.uid.toNumber(), this.voteSta);
        }

    },
    // 可以换三张
    canHuanSanZhang: function (v) {
        this.d.status = LG_Sta.CanHuan3.v;

        if (v.length == 1) { // 重连使用
            if (this.pg) {
                this.pg.doChangeReConnectUi(this.view);
            }
        } else {
            if (this.pg) {
                this.pg.showCanHuanSanZhang(this.view);
            }
        }
    },
    // 做换三张
    huanSanZhang: function (v) {
        if (v.length == 3) { // 自己换的牌收到消息
            if (this.pg) {
                this.pg.doChangeHanPaiUi(v, this.view);
            }
        } else if (v.length == 4) { // 服务器回的牌
            // if (this.pg) {
            //     this.pg.doGetServerCards(v, this.view)
            // }
            if (this.pg) {
                if (this.gm.isBackPlayMode()) {
                    this.pg.doGetServerCardsBmp(v, this.view)
                } else {
                    this.pg.doGetServerCards(v, this.view)
                }
            }
        } else if (v.length == 2) { // 重连使用
            // ..... 已经换3张完成,断线不用处理
            if (this.pg) {
                this.pg.doChangeReConnectHuanSanUi(this.view);
            }
        }
    },
    // 可以定缺了
    canDingQue: function (v) {
        if (v.length == 2) { // 断线重连后执行
            if (this.pg) {
                this.pg.doShowDingReConnectQue(this.view);
            }
        } else {
            if (this.pg) {
                this.pg.doShowDingQue(this.view);
            }
        }
    },
    // 已经定缺
    dingQue: function (v) {
        // 条 同 万 0  1 2
        if (v.length == 1) { // 收到自己的定缺消息
            this.queIndex = parseInt(v)
            if (this.pg) {
                // 碰牌 v 是数组
                this.pg.doShowMyQueImg(this.view);
            }
        } else if (v.length > 1) { // 全部都已经定缺完毕
            if (this.pg) {
                this.pg.doShowQueAnimation(this.view, v);
            }
        }
    },
    // 可以打牌
    canDaPai: function (v) {
        // 可以打牌
        // //cc.log("可以打牌--------------->", v)
        this.d.status = LG_Sta.Play.v;
        if (this.pg) {
            this.pg.doShowCountDown(this.view, parseInt(v));
        }
    },
    // 打牌
    doDaPai: function (v) {
        //doStartTime
        this.d.status = LG_Sta.WaitPlay.v;
        // 打牌传入桌号
        if (this.pg) {
            this.pg.doCancelTimer();
            if (this.pg.isbpm) {
                this.pg.doPlayMj(this.view, parseInt(v[0]));
            } else {
                let index = this.view.index
                if (index == 0) {
                    if (v[1] == 100) {
                        if (this.pg.checkCanPlayMj()) {
                            this.pg.doPlayMj(this.view, parseInt(v[0]));
                        }
                    } else {
                        // 修改自动胡牌，该自己打牌时候第一张可以打
                        if (this.pg.needCallBack) {
                            this.pg.checkDaPaiStatus();
                        }

                        // if (this.pg.isAutoPlay|| this.pg.isAutoHu) {
                        //     if (this.pg.checkCanPlayMj()) {
                        //         this.pg.doPlayMj(this.view, parseInt(v[0]));
                        //     }
                        // }

                        if (this.pg.checkCanPlayMj()) {
                            this.pg.doPlayMj(this.view, parseInt(v[0]));
                        }
                    }
                } else {
                    this.pg.doPlayMj(this.view, parseInt(v[0]));
                }
            }
        }
    },
    // 摸牌
    doMoPai: function(v) {
        // 摸牌起来就可以在打，就不能在打了
        // //cc.log("摸牌-------------->", v)
        this.d.status = LG_Sta.Play.v;
        if (this.pg) {
            // 插入自己的手牌
            this.pg.getServerMoPai(parseInt(v), this.view);
        }
    },
    // CAN飞
    canFei: function (v) {
    },
    // 飞
    doFei: function (v) {
        if (this.pg) {
            // 飞牌
            // this.pg.doReciveFei(this.view, parseInt(v));
            this.pg.doReciveFei(this.view, parseInt(v[0]), v[1]);
        }
    },
    //CAN提
    canTi: function (v) {
    },
    //提
    doTi: function (v) {
        if (this.pg) {
            this.pg.doReciveTi(this.view, parseInt(v));
        }
    },
    //CAN碰
    canPeng: function (v) {
    },
    //碰doReciveFei
    doPeng: function (v) {
        if (this.pg) {
            // 碰牌
            this.pg.doRecivePong(this.view, parseInt(v[0]), v[1]);
        }
    },
    //CAN胡
    canHu: function (v) {
        if (this.pg) {
            // 碰牌
            this.pg.doReciveCanHu(this.view);
        }
    },
    //胡
    doHu: function (v) {
        this.d.status = LG_Sta.WaitPlay.v;
        if (this.pg) {
            // 收到胡的消息
            this.pg.doReciveHu(this.view, v);
        }
    },
    //CAN杠
    canGang: function (v) {
    },
    //杠
    doGang: function (v) {
        // //cc.log("杠牌------------>")
        if (this.pg) {
            // 碰牌 v 是数组
            this.pg.doReciveGang(this.view, v);
        }
    },
    // CAN飘
    canPiao: function (v) {
        // //cc.log("*****************************CAN飘");
        if (this.pg) {
            this.pg.doReciveCanPiao(this.view);
        }
    },
    // 飘
    doPiao: function (v) {
        // //cc.log("*****************************飘");
        if (this.pg) {
            if (v.length == 1) {
                this.pg.doRecivePiao(this.view, parseInt(v[0]));
            } else {
                // [{"low":1012262,"high":0,"unsigned":false},{"low":1,"high":0,"unsigned":false},{"low":1063078,"high":0,"unsigned":false},{"low":0,"high":0,"unsigned":false}]
                this.pg.doReciveAllPiao(this.view, v);
            }
        }
    },

    // 掷骰子
    doSaiZi: function (v) {
        // //cc.log("*****************************掷骰子");
        if (this.pg) {
            // this.pg.starGame(v);
            this.saiZiArr = v;
        }
    },

    // CAN报叫
    canBaoJiao: function (v) {
        // //cc.log("*****************************CAN报叫", v)
        if (this.pg) {
            this.pg.doReciveCanBaoJiao(this.view, v);
        }
    },

    // 报叫
    baoJiao: function (v) {
        // //cc.log("*****************************报叫", v)
        this.d.status = LG_Sta.Play.v;
        if (this.pg) {
            this.pg.doRealReciveBaoJiao(this.view, v, true);
        }
    },
    autoHu: function(v) {
        console.log('自动胡牌', v)
        if (this.pg) {
            this.pg.doRealReciveAutoHu(this.view, parseInt(v));
        }
    },
    // 重置游戏
    resetPlay: function () {
        // 手牌
        if (this.d) {
            this.d.cards = [];
            this.d.cardNum = 0;
        }

        // 弃牌
        this.qiCards = []

        // 碰牌
        this.pongCards = []

        // 默认缺的牌
        this.queIndex = -1;

        // 手牌组
        this.hcGroups = [];

        // 庄
        this.isZhuang = false;

        // 准备
        this.isReady = false;

        this.obks = null;

        this.voteSta = null;

        this.votetime = null;

        // 报叫状态
        this.baoJiaoStatus = false;
        this.duZiMoStatus = false;
        this.baoGangStatus = false;
        // 是否报叫
        this.isCanBaoJiao = false;
        
    },

    // 在线情况
    upOnline: function (va) {
        let v = [];
        va.forEach(e => {
            if (e.toNumber) {
                v.push(e.toNumber());
                return;
            }
            
            v.push(e);
        });

        this.d.online = v[0]==1;
        this.view.upOnline();
    },
});