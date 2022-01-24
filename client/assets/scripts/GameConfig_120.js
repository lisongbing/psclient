var cfg_dbg = {
    appName: '同乡游戏',
    checkRemoteConfig: true,
	gameVersion: '1.101.0',
    gameConfigUrl:'http://120.77.173.104:10100', //120-app
    //gameConfigUrl:'https://xyx.qqqpgame.com',   //120-小程序
    //gameConfigUrl:'http://119.23.235.127:10100',  //119-app
    playBackIDUrl:'http://120.77.173.104:11111/getrecord',
    playBackDataUrl:'http://120.77.173.104:8090/',
    subGameUrl:'http://119.23.235.127:80/',
    miniGameUrl:'https://down.qqqpgame.com/',
    useGameConfigBak:false,
    gameConfigBakUrl: 'https://www.0838.cn.com/greedland/',
    hotUpdateEnable: false,
    hotUpdateUrl: '"http://119.23.235.127:80/"',
    //wsAddress: ["wss://qqqpgame.com/ws"],
    //wsAddress: ["ws://119.23.235.127:8082/ws"],
    //wsAddress: ["ws://120.77.173.104:8082/ws"],
    //wsAddress: ["ws://47.108.87.45:8082/ws"],
    //wsAddress: ["ws://192.168.0.11:8082/ws"],
    //wsAddress: ["ws://192.168.0.2:8082/ws"],
    //wsAddress: ["ws://192.168.0.70:8082/ws"],
    //wsAddress: ["ws://192.168.0.96:8082/ws"], //糖饼
    wsAddress: ["ws://192.168.0.102:8082/ws"],
    // wsAddress: ["ws://120.77.173.104:8082/ws"],
    //wsAddress: ["wss://zhouwei520.picp.vip/ws"],
    //wsAddress: ["ws://tianxingyun.cn:8082/ws"],
    //wsAddress: ["ws://www.lisongbing.net/ws"],
    loginMode: 1<<1,
    gamesSeq: [1,9,10,11,4,12,13,14,15,16,18,19,20,21,22,23],//,21
    //"9,2,0,0|10,2,1,1;10,3,1,1;麻将|11,2,2,0" 第四个参数1表示可以出现在添加列表里面
    hallGames: [['9,2,0,0'],['10,2,1,1','10,3,1,1','麻将'],['11,2,2,0'],['18,2,1,0'],['16,2,2,0'],['22,11,2,0'],['21,11,0,0'],['4,6,1,0']],
    downloadUrl: 'http://xz.njrtxxzxa.cn',
    rechargeMode: 29,
    applyUrl: 'http://xz.njrtxxzxa.cn',
    complainWX: 'wlz51320xa|txyxgzh',
    storeWX: 'txyxgzh',
    officialWebsite: 'http://xz.njrtxxzxa.cn',
    shareUrl: 'http://120.77.173.104/download.html',
    shareTitle: '无需出门，快速组局，在家轻松扯大贰！',//'《同乡游戏》',
    shareDesc: '已经两周没出门的美女，居然在家干这事...',//'【好友推荐】手机上的棋牌室，好玩到停不下来',
    shareGet:2,
    maintenance: false,
    maintenanceNotice: '服务器正在维护，预计1个小时完成。',
    gCloudVoiceAppId: '1602046271',
    gCloudVoiceAppKey: '3f81e4fbeed7dd8c5b17bfad86d2edc1',
    exchangeRate:1,//100,
    whiteList:'1060144', //白名单
};
module.exports = cfg_dbg;
