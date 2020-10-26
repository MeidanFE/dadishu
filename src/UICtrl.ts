export default class UICtrl extends Laya.Script {
  /** @prop {name:txt_Time,tips:"倒计时显示文本",type:Node,default:null} */
  public txt_Time: Laya.Node = null;
  /** @prop {name:txt_Score,tips:"成绩显示文本",type:Node,default:null} */
  public txt_Score: Laya.Node = null;
  /** @prop {name:gameOverPanel,tips:"游戏结束",type:Node,default:null} */
  public gameoverPanel: Laya.Node = null;

  private score: number = 0;

  constructor() {
    super();
    // 监听器，监听AddScore事件类型广播
    Laya.stage.on("AddScore", this, this.addScore);
  }
  // 增加成绩
  addScore() {
    this.score++;
    console.log(this.score);
    (this.txt_Score as Laya.Text).text = "Score:" + this.score;
  }
}
