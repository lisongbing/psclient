let MajhDef = {};

// 操作时间
MajhDef.OptTime = 20;

// 2 人的适合
MajhDef.colTwoMax = 18;
MajhDef.rowTwoMax = 2;

MajhDef.colMax = 8;
MajhDef.rowMax = 2;

// 第一行 6 8 10 12
MajhDef.colLeftAndRightMax = 6;
// 最多4行
MajhDef.rowLeftAndRightMax = 4;

// 第一行 10 12 18
MajhDef.colTopAndBottomMax = 10;
//
// 不飘    = 1
// 随飘    = 2
// 定飘    = 3
// 无封顶   = 4
// 四番封顶  = 5
// 五番封顶  = 6
// 六番封顶  = 7
// 七番封顶  = 8
// 点炮可胡  = 10
// 自摸胡   = 11
// 无红中   = 12
// 四红中   = 13
// 八红中   = 14
// 十一红中  = 15
// 十二红中  = 16
// 开局定缺  = 18
// 胡牌缺一门 = 19
// 两方麻将  = 20
// 换三张   = 21
// 自摸加番  = 22
// 开启定位  = 36
// 冠军房费  = 32
// 均摊房费  = 33
// 房主房费  = 34
// 俱乐部房费 = 35

MajhDef.SendCardPos = [
    {
        moveBy: {
            x: 0,
            y: 0//40
        },
        moveTo: {
            x: 75,
            y: 0
        }
    },
    {
        moveBy: {
            x: 0,//10
            y: 0,
        },
        moveTo: {
            x: 5,
            y: 24,
            z: 30, // 动画移动最后位置, 步长
        }
    },
    {
        moveBy: {
            x: 400,
            y: 20
        },
        moveTo: {
            x: 25,//27,
            y: 0
        }
    },
    {
        moveBy: {
            x: 110, // 剪去
            y: 470,
        },
        moveTo: {
            x: 5, //- 7
            y: 24, //- 30
            z: 30, // 动画移动最后位置, 步长
        }
    }
]

// 2 个玩家时 用
MajhDef.twoQiCardPos = [
    {
        moveBy: {
            x: 0,
            y: 80
        },
        moveTo: {
            x: 38,
            y: 40 // -
        }
    },
    {
        moveBy: {
            x: 0,
            y: 0,
        },
        moveTo: {
            x: 0,
            y: 0
        }
    },
    {
        moveBy: {
            x: 522,
            y: 16,
        },
        moveTo: {
            x: 30,
            y: 30 //32
        }
    },
    {
        moveBy: {
            x: 0,
            y: 0,
        },
        moveTo: {
            x: 0,
            y: 0
        }
    }
]

// 3  4 玩家
MajhDef.QiCardPos = [
    {
        moveBy: {
            x: 0,
            y: 80
        },
        moveTo: {
            x: 38,
            y: 40 // -
        }
    },
    {
        moveBy: {
            x: 38,
            y: 15,
        },
        moveTo: {
            x: 3, // -
            y: 25,
            z: 52
        }
    },
    {
        moveBy: {
            x: 522,
            y: 16,
        },
        moveTo: {
            x: 30,
            y: 30
        }
    },
    {
        moveBy: {
            x: 166,
            y: 280,
        },
        moveTo: {
            x: 3, // -
            y: 25, // -
            z: 52 // -
        }
    }
]



MajhDef.PongCardPos = [
    {
        moveBy: {
            x: 0,
            y: 0
        },
        moveTo: {
            x: 190,
            y: 0
        }
    },
    {
        moveBy: {
            x: 0,
            y: 0,
        },
        moveTo: {
            x: 22,
            y: 0
        }
    },
    {
        moveBy: {
            x: 440,
            y: 0
        },
        moveTo: {
            x: 105,
            y: 0
        }
    },
    {
        moveBy: {
            x: 110,
            y: 470,
        },
        moveTo: {
            x: 23,
            y: 0
        }
    }
]
//
//
// MajhDef.GangCardPos = [
//     {
//         moveBy: {
//             x: 0,
//             y: 0
//         },
//         moveTo: {
//             x: 250,
//             y: 0
//         }
//     },
//     {
//         moveBy: {
//             x: 0,
//             y: 0,
//         },
//         moveTo: {
//             x: 25, // -
//             y: 0
//         }
//     },
//     {
//         moveBy: {
//             x: 460,
//             y: 0
//         },
//         moveTo: {
//             x: 130,
//             y: 0
//         }
//     },
//     {
//         moveBy: {
//             x: 44,
//             y: 380,
//         },
//         moveTo: {
//             x: 20, // -
//             y: 0
//         }
//     }
// ]
//
//
// MajhDef.AnGangCardPos = [
//     {
//         moveBy: {
//             x: 0,
//             y: 0
//         },
//         moveTo: {
//             x: 255,
//             y: 0
//         }
//     },
//     {
//         moveBy: {
//             x: 0,
//             y: 0,
//         },
//         moveTo: {
//             x: 25, // -
//             y: 0
//         }
//     },
//     {
//         moveBy: {
//             x: 460,
//             y: 0
//         },
//         moveTo: {
//             x: 124,
//             y: 0
//         }
//     },
//     {
//         moveBy: {
//             x: 44,
//             y: 380,
//         },
//         moveTo: {
//             x: 20, // -
//             y: 0
//         }
//     }
// ]
//

MajhDef.AnQueCardPos = [
    {
        moveTo: {
            x: -472,
            y: -119
        },
    },
    {
        moveTo: {
            x: 475,
            y: 94,
        },
    },
    {
        moveTo: {
            x: 376,
            y: 265
        },
    },
    {
        moveTo: {
            x: -487,
            y: 94,
        },
    }
]


MajhDef.AnQueCardStartPos = [
    {
        moveTo: {
            x: 0,
            y: -89,
        },
    },
    {
        moveTo: {
            x: 188,
            y: 51,
        },
    },
    {
        moveTo: {
            x: 0,
            y: 173
        },
    },
    {
        moveTo: {
            x: -188,
            y: 50,
        },
    }
]

MajhDef.hcZhuangPos = [
    {
        moveBy: {
            x: 75,
            y: 0,
        },
    }
]


MajhDef.hcMultHuTiPos = [
    {
        moveBy: {
            x: 70,
            y: 60,
            z: 90,
            w: 80,
            space: 15,
        },
    }

]


MajhDef.hcJieSuanPos = [
    {
        moveBy: {
            x: 38,
            y: 0,
        },
        moveTo: {
            x: 20,
            y: 0
        }
    },
]

// 房间状态
MajhDef.RMSTA = {
  Free: {
      v: 0,
      s: "准备",
  },

  SendCard: {
      v: 1,
      s: "发牌",
  },

  PreDo: {
      v: 2,
      s: "预处理",
  },

  Play: {
      v: 3,
      s: "打牌",
  },
};
// 玩家状态
MajhDef.PlayerSta = {
    Free: {
        v: 0,
        s: "空闲",
    },
    Ready: {
        v: 1 << 0,
        s: "准备",
    },
    CanHuan3: {
        v: 1 << 1,
        s: "换三张",
    },
    WaitPlay: {
        v: 1 << 3,
        s: "等待他人打牌",
    },
    Play: {
        v: 1 << 4,
        s: "玩牌",
    },
    BtnPaly: { // 胡 飞 杠 碰...
        v: 1 << 5,
        s: "按钮操作",
    },
};
// 消息 C2S
MajhDef.C2S = {
    READY: 1 << 0,  //准备
};

// 规则枚举
// 不飘    = 1
// 随飘    = 2
// 定飘    = 3
// 无封顶  = 4
// 四番封顶 = 5
// 五番封顶  = 6
// 六番封顶  = 7
// 七番封顶  = 8
// 点炮可胡  = 10
// 自摸胡   = 11
// 四听用   = 12
// 八听用   = 13
// 十一听用  = 14
// 两番起胡  = 15
// 无听用加3番 = 16
// 天胡满贯  = 17
// 开局定缺  = 18
// 开启定位  = 19
// 冠军房费  = 20
// 均摊房费  = 21
// 房主房费  = 22
// 俱乐部房费 = 36


// status 状态值
// 等待 = iota 0
// 准备 1
// 发牌 2
// 换三张1 3
// 换三张2
// 定缺1
// 定缺2
// 过渡自由
// 自由 8

// 宜宾麻将
// OP_准备 = 1 << 0
// OP_退出 1 << 1
// OP_CAN飘 1 << 2
// OP_飘 1 << 3
// OP_发牌 1 << 4
// OP_庄家 1 << 5
// OP_本金 1 << 6
// OP_CAN换三张 1 << 7
// OP_换三张 1 << 8
// OP_CAN定缺 1 << 9
// OP_定缺 1 << 10
// OP_CAN打牌 1 << 11
// OP_打牌 1 << 12
// OP_CAN飞 1 << 13
// OP_飞 1 << 14
// OP_CAN提 1 << 15
// OP_提 1 << 16
// OP_CAN碰 1 << 17
// OP_碰 1 << 18
// OP_CAN胡 1 << 19
// OP_胡 1 << 20
// OP_CAN杠 1 << 21
// OP_杠 1 << 22
// OP_过 1 << 23
// OP_摸牌 1 << 24
// OP_开始 1 << 25
// OP_局数 1 << 26
// OP_销毁 1 << 27
// 玩家操作
MajhDef.PlayerOpt = {
    Ready:{
        v: 1 << 0,
        s: '准备',
    },

    Exit:{
        v: 1 << 1,
        s: '退出',
    },

    CanPiao:{
        v: 1 << 2,
        s: 'CAN飘',
    },

    Piao:{
        v: 1 << 3,
        s: '飘',
    },

    SendCard:{
        v: 1 << 4,
        s: '发牌',
        t: 2.0,
    },

    Zhuang:{
        v: 1 << 5,
        s: '庄家',
    },

    BenJin:{
        v: 1 << 6,
        s: '本金',
    },

    CanHuan3: {
        v: 1 << 7,
        s: 'CAN换三张',
    },

    Huan3: {
        v: 1 << 8,
        s: '换三张',
    },

    CanDingQue: {
        v: 1 << 9,
        s: 'CAN定缺',
    },

    DingQue: {
        v: 1 << 10,
        s: '定缺',
    },

    CanDaPai: {
        v: 1 << 11,
        s: 'CAN打牌',
    },

    DaPai: {
        v: 1 << 12,
        s: '打牌',
    },

    CanFei: {
        v: 1 << 13,
        s: 'CAN飞',
    },

    Fei: {
        v: 1 << 14,
        s: '飞',
    },

    CanTi: {
        v: 1 << 15,
        s: 'CAN提',
    },

    Ti: {
        v: 1 << 16,
        s: '提',
    },

    CanPeng: {
        v: 1 << 17,
        s: 'CAN碰',
    },

    Peng: {
        v: 1 << 18,
        s: '碰',
    },

    CanHu: {
        v: 1 << 19,
        s: 'CAN胡',
    },

    Hu: {
        v: 1 << 20,
        s: '胡',
    },

    CanGang: {
        v: 1 << 21,
        s: 'CAN杠',
    },

    Gang: {
        v: 1 << 22,
        s: '杠',
    },

    Guo: {
        v: 1 << 23,
        s: '过',
    },
    MoPai: {
        v: 1 << 24,
        s: '摸牌',
    },
    KaiShi: {
        v: 1 << 25,
        s: '开始',
    },

    CurJushu:{
        v: 1 << 26,
        s: '局数',
    },

    XiaoHui:{
        v: 1 << 27,
        s: '销毁',
    },

    AutoHu:{
        v: ((1 << 30) - 1),
        s: '自动胡牌',
    },


    JiesanVote:{
        v: 996,
        s: '解散投票',
    },
    AskJiesan:{
        v: 997,
        s: '申请解散',
    },
    BackHall:{
        v: 995,
        s: '返回大厅',
    },
};
MajhDef.PlayerOptStr={};
{
    for (const k in MajhDef.PlayerOpt) {
        const e = MajhDef.PlayerOpt[k];
        MajhDef.PlayerOptStr[e.v] = e;
    };
}

// 操作按钮KEY
MajhDef.OBK = {
    hu: 0,
    ti: 1,
    gang: 2,
    fei: 3,
    peng: 4,
    guo: 5,
    candp: 100, // 可以打牌
}

module.exports = MajhDef;