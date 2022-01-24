/*
子游戏管理器
*/

let CacheDir = '';

let voiceCB = null;

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    init () {
        //Sub game data
        cc.log('SubGameMgr::init');
        
        let v = 1;
        this.ERR = {
            // NO_SVR:'子游戏服务器查询失败',
            // IFO_ERR, '子游戏类型不匹配';
            // NO_GAME:'没有该子游戏 需要下载',
            // NEED_UP:'子游戏需要更新',
            // PROGRESS:'子游戏下载或更新进度',
            // IN_MAIN, '不是分包子游戏，应该是在主包里';
            // LOAD_OK:'子游戏加载成功',
            // DOWN_OK:'子游戏下载成功',
            // UP_OK:'子游戏更新成功',
            NO_SVR:v++,
            IFO_ERR:v++,
            NO_GAME:v++,
            NEED_UP:v++,
            PROGRESS:v++,
            IN_MAIN:v++,
            LOAD_OK:v++,
            DOWN_OK:v++,
            UP_OK:v++,
        };

        //cc.sys.localStorage.setItem('sub_game_data', '');

        // APP 远程子游戏
        this.sbd = {};
        let sbdstr = cc.sys.localStorage.getItem('sub_game_data');
        if (sbdstr && sbdstr!='') {
            this.sbd = JSON.parse(sbdstr);
        }

        // 小游戏远程包
        this.mgd = {};
        let mgdstr = cc.sys.localStorage.getItem('mini_game_data');
        if (mgdstr && mgdstr!='') {
            this.mgd = JSON.parse(mgdstr);
        }

        cc.log('SubGames Info', this.sbd);
    },

    releaseGame () {
        cc.log('SubGameMgr::releaseGame');

        if (this.lastBundle) {
            this.lastBundle.releaseAll();
            this.lastBundle = null;
        }
    },

    // nimi game 小游戏加载Bundle场景
    mgLoadBundle (name, cb) {
        cc.log('SubGameMgr::mgLoadBundle');

        if (!name || name=='') {
            cc.log('MiniGameName err ', name);
            return
        }

        this.releaseGame();

        this.loadCallBack = cb;

        let bdname = name;
        if (name!='hall' && name!='tea' && name!='tea_quan') {
            bdname = name + 'res';
        }

        let url = GameConfig.miniGameUrl + 'remote/' + bdname;
        cc.log(`小游戏远程地址`, url);

        cc.assetManager.loadBundle(url, (err, bundle) => {
            // export class Bundle 搜索bundle类用
            if (err) {
                cc.error(err);

                if (this.loadCallBack) {
                    this.scheduleOnce(()=>{
                        cc.g.global.destoryWaiting();
                        this.loadCallBack(false, `小游戏模块${name}` + '下载失败');
                        this.loadCallBack = null;
                    }, 0.1);
                }

                return;
            }

            cc.log(`loadBundle ${name} 完成`, bundle);

            bundle.preloadScene(name, (error)=>{
                cc.log(`场景 ${name} 预加载结束`, error);

                this.mgd[name] = this.mgd[name] || true;
                cc.log('this.mgd', this.mgd);
                let mgdstr = JSON.stringify(this.mgd);
                cc.sys.localStorage.setItem('mini_game_data', mgdstr);

                this.scheduleOnce(()=>{
                    cc.g.global.destoryWaiting();
                    this.loadCallBack && this.loadCallBack(true, `小游戏模块${name}` + '下载成功');
                    this.loadCallBack = null;
                }, 0.1);
            });
        });
    },

    //
    loadGame (ID, cb, skipTip) {
        cc.log('SubGameMgr::loadGame');

        if (cc.g.hallMgr.curGameType == ID) {
            cb && cb(true, '客户端已经在游戏中  跳过重新加载子包的过程 curGameType ' + ID);
            return;
        }

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            cc.g.global.showWaiting('正在加载中');

            cc.g.utils.loadSubpackage(ID, (ok, ifo)=>{
                if (ok) {
                    let bdname = cc.g.utils.getMiniGameName(ID);
                    this.mgLoadBundle(bdname, cb);
                } else {
                    cc.g.global.destoryWaiting();
                }
            });
            
            return;
        }

        this.releaseGame();

        this.loadCallBack = cb;
        this.skipTip = skipTip;

        /*
            //拉取分包消息
            //@api:2402,@type:req
            message FenBaoReq{
                int32 configId = 1;//分包Id
            }
            //@api:2402,@type:resp
            message FenBaoResp{
                int32 configId = 1;//分包Id
                string gameName = 2;//游戏名
                string version = 3;//版本号
            }
        */
        let req = pbHelper.newReq(PB.PROTO.FEN_BAO);
        req.configId = ID;

        cc.g.networkMgr.send(PB.PROTO.FEN_BAO, req, (resp)=>{
            this.scheduleOnce(()=>{
                if(!resp.err || resp.err == PB.ERROR.OK) {
                    if (resp.configId!=ID) {
                        this.loadCallBack && this.loadCallBack(false, '子游戏类型不匹配');
                        this.loadCallBack = null;
                        return;
                    }
    
                    if (resp.version=='-1') {
                        this.loadCallBack && this.loadCallBack(true, '不是分包子游戏，应该是在主包里');
                        this.loadCallBack = null;
                        return;
                    }
    
                    this.checkSubGame(ID, resp.gameName, resp.version);
                } else {
                    this.loadCallBack && this.loadCallBack(false, '子游戏服务器查询失败');
                    this.loadCallBack = null;
                }
            }, 0.1);
        });
    },

    // 检查子游戏版本是否需要更新
    checkSubGame (ID, gameName, version) {
        cc.log('SubGameMgr::checkSubGame');

        this.task = '';

        let sg = this.sbd[ID];

        if (!sg) {
            if (this.skipTip) {
                this.skipTip = false;
                this.downLoadSubGame(ID, gameName, version);
            } else {
                cc.g.global.showMsgBox(MsgBoxType.YesOrNo, '提示', '没有该游戏，是否开始下载?', ()=>{
                    this.task = 'down';
                    this.downLoadSubGame(ID, gameName, version);
                });
            }
            
            return;
        }

        if (sg.ver != version) {
            if (this.skipTip) {
                this.skipTip = false;
                this.downLoadSubGame(ID, gameName, version);
            } else {
                cc.g.global.showMsgBox(MsgBoxType.YesOrNo, '提示', '该游戏有新版本，是否开始更新?', ()=>{
                    this.task = 'up';
                    this.downLoadSubGame(ID, gameName, version);
                });
            }

            return;
        }

        // 本地版本最新 直接加载
        this.task = 'load';
        this.downLoadSubGame(ID, gameName);
    },

    createGameDir(name) {
        if (cc.sys.os == cc.sys.OS_IOS) {
            let storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'gamecaches/' + name);
            if (!jsb.fileUtils.isDirectoryExist(storagePath)) {
                jsb.fileUtils.createDirectory(storagePath)
            }
        }
    },


    // 下载子游戏
    downLoadSubGame (ID, name, ver) {
        cc.log('SubGameMgr::downLoadSubGame');

        let url = GameConfig.subGameUrl + 'remote/' + name + '_' + (ver ? ver : this.sbd[ID].ver);
        cc.log(`子游戏远程地址`, url);

        this.loadOK = false;

        this.createGameDir(name)

        cc.assetManager.loadBundle(url, (err, bundle) => {
            // export class Bundle 搜索bundle类用
            if (err) {
                cc.log(`downLoadSubGame err`, err);

                cc.g.global.hideSubGameProDlg();

                if (this.loadCallBack) {
                    this.scheduleOnce(()=>{
                        if (this.task = 'down') {
                            this.loadCallBack(false, '子游戏下载失败');
                        } else if (this.task = 'up') {
                            this.loadCallBack(false, '子游戏更新失败');
                        } else if (this.task = 'load') {
                            this.loadCallBack(false, '子游戏加载失败');
                        }
                        
                        this.loadCallBack = null;
                    }, 0.1);
                }

                return;
            }

            this.lastBundle = bundle;

            cc.log(`loadBundle ${name}_${ver ? ver : this.sbd[ID].ver} 完成`, bundle);

            if (ver) {
                bundle.preloadScene(name, (error)=>{
                    cc.log(`场景 ${name} 预加载结束`, error);

                    this.sbd[ID] = this.sbd[ID] || {};
                    let sg = this.sbd[ID];
                    sg.name = name;
                    sg.ver = ver;
                    cc.log('this.sbd', this.sbd);
                    let sbdstr = JSON.stringify(this.sbd);
                    cc.sys.localStorage.setItem('sub_game_data', sbdstr);
        
                    this.loadOK = true;
                    this.progressEnd();
                });
            } else {
                this.scheduleOnce(()=>{
                    this.loadCallBack && this.loadCallBack(true, '子游戏加载成功');
                    this.loadCallBack = null;
                }, 0.1);
            }
        });

        if (ver) {
            this.progressStar();
        }
    },

    // 假进度前部分
    progressStar () {
        cc.log('SubGameMgr::progressStar');

        let time = cc.g.utils.randomInt(2, 5);//秒
        let max = cc.g.utils.randomInt(52, 78);//百分比
        cc.log(`time ${time}  max ${max}`);

        let t = 0;
        let schpro = ()=>{
            let tp = (t/time*100).toFixed(2);
            let tm = parseFloat((t/time * max).toFixed(2));

            cc.log(`time ${t}  max ${tm}`);

            cc.g.global.showSubGameProDlg(tm);

            if (t>=time) {
                this.unschedule(schpro);
                this.proStarOK = true;
                this.progressEnd();
            }

            t=parseFloat((t+0.1).toFixed(2));
        };

        this.proStarOK = false;
        this.schedule(schpro, 0.1);

        this.proTime = time;
        this.proMax = max;
    },
    // 假进度后部分
    progressEnd () {
        cc.log('SubGameMgr::progressEnd');

        if (!this.proStarOK || !this.loadOK) {
            return;
        }

        cc.log(`time ${1}  max ${100-this.proMax}`);

        let t = 0;
        let schpro = ()=>{
            let tm = parseFloat((t * (100-this.proMax)).toFixed(2));

            cc.log(`time ${t}  max ${this.proMax + tm}`);

            cc.g.global.showSubGameProDlg(this.proMax + tm);

            if (t>=1) {
                this.unschedule(schpro);

                if (this.loadCallBack) {
                    this.scheduleOnce(()=>{
                        cc.g.global.hideSubGameProDlg();
                        
                        if (this.task = 'down') {
                            this.loadCallBack(true, '子游戏下载成功');
                        } else if (this.task = 'up') {
                            this.loadCallBack(true, '子游戏更新成功');
                        }
                        
                        this.loadCallBack = null;
                    }, 0.2);
                }
            }

            t=parseFloat((t+0.1).toFixed(2));
        };
        this.schedule(schpro, 0.1);
    },
});
