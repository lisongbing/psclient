import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;
import TeaBmsp from "./tea_gold_bmsp";
import TeaClass from "../tea";

@ccclass
export default class TeaGoldZdjfItem extends cc.Component {

    @property(cc.Label)
    private index_Label: cc.Label = null;

    @property(cc.Sprite)
    private Sprite_head: cc.Sprite = null;

    @property(cc.Label)
    private nameText: cc.Label = null;

    @property(cc.Label)
    private id_Label: cc.Label = null;

    @property(cc.Label)
    private xinyu: cc.Label = null;

    @property(cc.Button)
    private jjx_Button: cc.Button = null;

    @property(cc.Button)
    private xinyu_Button: cc.Button = null;

    @property(cc.Button)
    private bxx_Button: cc.Button = null;

    @property(cc.Button)
    private jilu_Button: cc.Button = null;

    public setData(data: any, index: number) {
        this.createCyCrDatas(data, index+1)
    }

    public createCyCrDatas(pItem: any, index: number) {
        // @ts-ignore 头像
        cc.log('createCyCrDatas');
        
        // 排名
        this.index_Label.string = index + '';

        // @ts-ignore 头像
        cc.g.utils.setHead(this.Sprite_head, pItem.icon);

        // 名字
        // @ts-ignore
        this.nameText.string = cc.g.utils.getFormatName(pItem.name, 5*2)
        // @ts-ignore ID
        this.id_Label.string = ''+i64v(pItem.userId);

        // 信誉值
        // @ts-ignore
        this.xinyu.string = cc.g.utils.realNum1(pItem.credit);

        // 警戒线 裁判 踢出比赛 //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
        // 馆主 超管==>>队长
        
        let p0 = TeaClass.instance.position;
        let p1 = pItem.position;
        let showjjx = false;
        if (p0==71||p0==61) {
            if (p1==41) {
                showjjx = true;
            }
        } else if (p0==41) {
            if (p1==41||p1==31) {
                showjjx = true;
            }
        } else if (p0==31) {
            if (p1==31||p1==21) {
                showjjx = true;
            }
        } else if (p0==21) {
            if (p1==21||p1==11) {
                showjjx = true;
            }
        } else if (p0==11) {
            if (p1==11) {
                showjjx = true;
            }
        }
        this.jjx_Button.node.active = showjjx;
        // @ts-ignore
        if (this.jjx_Button.node.active) {
            // @ts-ignore
            cc.g.utils.removeClickAllEvent(this.jjx_Button);
            // @ts-ignore 按钮事件
            cc.g.utils.addClickEvent(this.jjx_Button, TeaBmsp.instance, 'tea_gold_bmsp', 'onBtnZdxyXinyujilu', {jjx:true, itm:pItem});
        }

        if (!pItem.power) {
            this.xinyu_Button.node.active = false;
        } else {
            this.xinyu_Button.node.active = true;
            // @ts-ignore
            cc.g.utils.removeClickAllEvent(this.xinyu_Button);
            // @ts-ignore 按钮事件
            cc.g.utils.addClickEvent(this.xinyu_Button, TeaBmsp.instance, 'tea_gold_bmsp', 'onBtnZdxyXinyujilu', {xinyu:true, itm:pItem});
        }

        // @ts-ignore BXX
        if (!eq64(pItem.userId, cc.g.userMgr.userId)) {
            this.bxx_Button.node.active = false;
        } else {
            this.bxx_Button.node.active = true;
            // @ts-ignore
            cc.g.utils.removeClickAllEvent(this.bxx_Button);
            // @ts-ignore 按钮事件
            cc.g.utils.addClickEvent(this.bxx_Button, TeaBmsp.instance, 'tea_gold_bmsp', 'doShowBaoxxDialog');
        }

        if (1) {
            this.jilu_Button.node.active = false;
        } else {
            // @ts-ignore
            cc.g.utils.removeClickAllEvent(this.jilu_Button);
            // @ts-ignore
            cc.g.utils.addClickEvent(this.jilu_Button, TeaBmsp.instance, 'tea_gold_bmsp', 'onBtnZdxyXinyujilu', {xinyu:false, itm:pItem});
        }
    }
}