// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let MID:number = 0;

// 消息
// type Msg = cc.Class({
//     properties: {
//         id: -1,
//         name: '',
//         fun: null,
//         data: null,
//         tag: null,
//     },
// });

class Msg{
    id:number= -1;
    name:string =  '';
    fun:any =  null;
    data:any =  null;
    tag:any = null;
}


const {ccclass} = cc._decorator;

@ccclass
export default class TTpsMsgQueue extends cc.Component {
    queue:any[] = [];
    curMsg:any = null;
    isPause:boolean = null;
    dbgstr(info):string {
        let s = '消息队列';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    }

    msginfo(m:any):string{
        let s:string = m.name + '  ID ' + m.id;
        if (m.tag) {
            s += '  T: ' + m.tag;
        }
        s += '  消息数量 '+this.queue.length;

        return s + ' ';
    }

    // 初始化
    init() {
        cc.log(this.dbgstr('init'));

        this.queue = [];
        this.curMsg = null;
    }

    //
    begin() {
        this.clear();
        this.resume();
        this.schedule(this.do, 0.2);
    }

    //
    end() {
        this.clear();
        this.pause();
        this.unschedule(this.do);
    }

    
    do(elapsed) {
        if (this.isPause) {
            return;
        }

        if (this.curMsg) {
            return;
        }

        if (this.queue.length < 1) {
            return;
        }

        let m = this.curMsg = this.pop();
        
        if (m.fun) {
            cc.log(this.dbgstr('执行消息 ') + this.msginfo(m));

            m.fun(m.data);
        }
    }

    pop() {

        let a = this.queue[0];

        let nq = [];
        for (let i = 1; i < this.queue.length; ++i) {
            nq.push(this.queue[i]);
        }

        this.queue = nq;

        return a;
    }

    // 生成一个消息 可以指定是否立即添加到队列
    createMsg(name, fun, data, tag, add) {
        let m = new Msg();
        m.id = ++MID;
        m.name = name;
        m.fun = fun;
        m.data = data;
        m.tag = tag;

        if (add != -1) {
            this.add(m);
        }

        return m;
    }

    // 添加消息
    add(m) {
        this.queue.push(m);

        cc.log(this.dbgstr('添加消息 ') + this.msginfo(m));
    }

    // 移除消息  
    remove(id) {
        let str = this.dbgstr('移除消息 ');

        let nque = [];
        let idx = 0;

        this.queue.forEach(e => {
            ++idx;

            if (e.id == id) {
                str += e.name + ' idx' + idx;
                return;
            }

            nque.push(e);
        });

        this.queue = nque;

        cc.log(str+' 消息数量 '+this.queue.length);
    }

    // 结束当前消息
    finishMsg() {
        let m = this.curMsg;

        this.curMsg = null;

        if (!m) {
            cc.error(this.dbgstr('结束消息 找不到当前消息对象 请检查错误'));
            return;
        }

        cc.log(this.dbgstr('结束当前消息 ') + this.msginfo(m));
    }


    // 暂停
    pause() {
        this.isPause = true;
    }

    // 继续
    resume() {
        this.isPause = false;
    }

    // 清空
    clear() {
        this.curMsg = null;
        this.queue = [];
    }

    
    // 
    fun() {
    }
}
