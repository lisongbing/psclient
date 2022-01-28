// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
export default class TTPSDef{
    
    // 操作时间
    OptTime:number= 10;

    // 消息 C2S
    C2S = {
        READY: 1 << 0,  //准备
        QZ:    1 << 3,//抢庄
    };

    // 房间状态
    RMSTA = {
        Free: {
            v: 0,
            s: "等待",
        },

        Ready:{
            v: 1,
            s: "准备",
        },        

        FP: {
            v: 2,
            s: "发牌1",
        },

        QZ: {
            v: 3,
            s: "抢庄",
        },

        DZ: {
            v: 4,
            s: "随机庄家",
        },

        XZ: {
            v: 5,
            s: "下注",
        },

        FP2: {
            v: 6,
            s: "发牌2",
        },

        KP: {
            v: 7,
            s: "开牌",
        },

        RS: {
            v: 8,
            s: "结果",
        },
    };

    RMSTAStr = {};
    static PlayerOptStr: any;
    
    initRMSTAStr(){
        for (const k in this.RMSTA) {
            const e = this.RMSTA[k];
            this.RMSTAStr[e.v] = e.s;
        };
    }

    // 玩家状态
    static PlayerSta= {
        Free: {
            v: 0,
            s: "等待",
        },

        Ready:{
            v: 1,
            s: "准备",
        },        

        FP: {
            v: 2,
            s: "发牌1",
        },

        QZ: {
            v: 3,
            s: "抢庄",
        },

        DZ: {
            v: 4,
            s: "随机庄家",
        },

        XZ: {
            v: 5,
            s: "下注",
        },

        FP2: {
            v: 6,
            s: "发牌2",
        },

        KP: {
            v: 7,
            s: "开牌",
        },

        RS: {
            v: 8,
            s: "结果",
        },
        RSHu:{// 100
            v: 1 << 100,
            s: '认输',
        },
    };

    // 玩家操作
    static PlayerOpt  = {
        Ready:{
            v: 1 << 0,
            s: '准备',
        },

        OP_FP1:{
            v: 1 << 2,
            s: '发牌1',
        },

        OP_QZ:{// 3
            v: 1 << 3,
            s: '抢庄',
        },    

        OP_XZ:{// 4
            v: 1 << 4,
            s: '下注',
        }, 

        OP_FP2:{// 5
            v: 1 << 5,
            s: '发牌2',
        },

        OP_KP:{// 6
            v: 1 << 6,
            s: '亮牌',
        },

        OP_KS:{// 7
            v: 1 << 7,
            s: '开始 ',
        },

        OP_ZJ:{// 10
            v: 1 << 10,
            s: '庄家',
        },

        OP_XJJS:{// 13
            v: 1 << 13,
            s: '小局结算',
        },
        
        OP_JS:{// 14
            v: 1 << 14,
            s: '局数',
        },

        OP_TG:{// 15
            v: 1 << 15,
            s: '跳过',
        },
        OP_RS:{// 
            v: 1 << 16,
            s: '认输',
        },

        OP_SitDown:{// 
            v: 1 << 17,
            s: '坐下',
        },
    };
    
    PlayerOptStr={};
    initPlayerOptStr(){
        for (const k in this.PlayerOpt) {
            const e = this.PlayerOpt[k];
            this.PlayerOptStr[e.v] = e;
        };
    }
    
}
