const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMain extends cc.Component {

   

    @property(cc.Prefab)
    cowPrefab:cc.Prefab 

    //是否开启游戏
    private isStartGame:boolean  = false;

    private cowArray:Array<cc.Node>


    @property(cc.Label)
    public timeLable : cc.Label;

    @property(cc.Label)
    public countLabel : cc.Label;

    @property(cc.Node)
    public checkOut : cc.Node

    private time:number = 0;
    private count:number = 0;

    
    _getCow(){
        let cow = cc.instantiate(this.cowPrefab);    
        cow.x = cc.winSize.width;
        cow.y = -100;
        cow.zIndex = 1000;
        this.node.addChild(cow);
        this.cowArray.push(cow);
        this.scheduleOnce(this._getCow.bind(this),Math.random() * 2 +3)
    }

    hitCow(){
        let cowType = -1;
        for(let cow of this.cowArray){
                //精确测量值
                if(cow.x >= 70 &&  cow.x <=130){
                    cowType = cow.getComponent("Cow").cowType;
                    cow.removeFromParent();
                    this.cowArray.splice(this.cowArray.indexOf(cow),1);
                    this._setCount(1);
                    //播放音乐
                    cc.audioEngine.play(cc.url.raw("resources/Sound/niu.mp3"),false,1)
                    return cowType;
                }
        }

        return -1;
    }

    removeCow(cow){
        let index = this.cowArray.indexOf(cow);
        this.cowArray.splice(index,1);
    }

    _setCount(count){
        this.count += count;
        this.countLabel.string =""+this.count;
    }   

    _onTimer(){
        this.time--;
        this.timeLable.string =""+this.time;      
        //游戏结束时间到
        if(this.time <= 0){
            this.unscheduleAllCallbacks();
            this.isStartGame = false;
            this._checkOut();
            return;
        }
        this.scheduleOnce(this._onTimer.bind(this),1);        
    }

    _checkOut(){

         //弹窗结算界面
         this.checkOut.active = true;
         let panelCountLabel = this.checkOut.getChildByName("panel").getChildByName("panelCount").getComponent(cc.Label);
         panelCountLabel.string = '' + this.count;

         let resTitle = this.checkOut.getChildByName("panel").getChildByName("resTitle").getComponent(cc.Label);
         let titleArray = [
             "情场空手",
             "情场新手",
             "情场高手",
             "情场大师",
            ];

            if(this.count <= 0){
                resTitle.string = titleArray[0];
            }
            else if(this.count <= 3){
                resTitle.string = titleArray[1];
            }
            else if(this.count <= 6){
                resTitle.string = titleArray[2];
            }
            else{
                resTitle.string = titleArray[3];
            }

            //清除掉在跑的牛
            
    
    }

    startGame(){
        if(this.isStartGame) return;               
        this.isStartGame = true;    
        
         this.unscheduleAllCallbacks();

         //初始化参数
         this.cowArray =  new Array<cc.Node>();
         this.time = 60;
         this.count = 0 ;
         this.timeLable.string = this.time+'';
         this.countLabel.string = this.count+'';
         this.checkOut.active = false;         

       
        //开启定时器
        this._onTimer();
        this._getCow();
    }

    onLoad () {
           

        //绳子高度
        let rope = this.node.getChildByName("rope");
        rope.zIndex = 2000;

        let btn = this.node.getChildByName("btn");
        btn.zIndex = 3000;        

       
        this.startGame();
            

    }

   

    // update (dt) {},
}
