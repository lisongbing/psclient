import TTPSDef from "./ttpsDef";


let DEF = new TTPSDef();
let dir = 'ttps' + '/';

let sex = ['', 'nan', 'nv'];

let mp3 = name => dir + 'ttps_' + name + '.mp3';

let codesType = (name, s) => mp3(sex[s] + '_' + name);

/* =================================================================================================================== */

export default class TTPSAudio  {

    curBGM:string = '';
    effid:number = null; //
    // dbgstr
    dbgstr(info:any):string {
        let s = '拼十音乐'

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    }

    init() {
        cc.log(this.dbgstr('init')); 
        this.curBGM = '';
    }


    /* =================================================================================================================== */
    // 游戏背景音乐
    bgmGame() {
        if (!cc.g.audioMgr.isBGMOn) {
            return;
        }

        if (this.curBGM == '1'){
            return;
        }

        this.curBGM = '1';
        cc.g.audioMgr.playBGM(mp3('bg'));
    }

    //
    stop() {
        this.curBGM = '';
    }

    play(name) {
        cc.g.audioMgr.playSFX(mp3(name));
    }
    
    /* =================================================================================================================== */
    //按钮按下
    btnEnter(){
        this.play('nn_start');
    }
    // 发牌
    faPai() {
        cc.g.audioMgr.playSFX(mp3('send_card'));
    }

    //随机庄家
    randomDealer(){
        let url = cc.g.audioMgr.getUrl(mp3('nn_bankerrandom')); 
        cc.resources.load(url, cc.AudioClip,  (err, asset:cc.AudioClip)=> {
            this.effid = cc.audioEngine.playEffect(asset, true);
        });
    }

    stopRandomDealer(effid:number){
        cc.audioEngine.stop(effid);
    }

    //dz
    dingzhuan() {
        cc.g.audioMgr.playSFX(mp3('nn_banker'));
    }

    //nn
    niu(n:number){
        cc.g.audioMgr.playSFX(mp3('nn_' + n));
    }

    flyGold(){
        cc.g.audioMgr.playSFX(mp3('nn_coins'));
    }

    bqz() {
        cc.g.audioMgr.playSFX(mp3('bq'));
    }

    qz() {
        cc.g.audioMgr.playSFX(mp3('qz'));
    }

    tz() {
        cc.g.audioMgr.playSFX(mp3('tz'));
    }
}
