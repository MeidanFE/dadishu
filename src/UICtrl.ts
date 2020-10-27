export default class UICtrl extends Laya.Script {
  /** @prop {name:txt_Time,tips:"倒计时显示文本",type:Node,default:null} */
  public txt_Time: Laya.Node = null;
  /** @prop {name:txt_Score,tips:"成绩显示文本",type:Node,default:null} */
  public txt_Score: Laya.Node = null;
  /** @prop {name:gameOverPanel,tips:"游戏结束",type:Node,default:null} */
  public gameOverPanel: Laya.Node = null;

  private score: number = 0;
  private timer: number = 0;
  private time: number = 60;

  constructor() {
    super();
    // 监听器，监听AddScore事件类型广播
    Laya.stage.on("AddScore", this, this.addScore);
  }

  onAwake() {
    this.gameOverPanel.getChildAt(0).on(Laya.Event.CLICK, this, this.againGame);
  }
  // 增加成绩
  addScore() {
    this.score++;
    // console.log(this.score);
    (this.txt_Score as Laya.Text).text = "Score:" + this.score;
  }
  onUpdate() {
    // 倒计时结束
    if (this.time <= 0) {
      this.gameOver();
      return;
    }

    this.timer += Laya.timer.delta / 1000;
    if (this.timer >= 1) {
      this.timer = 0;
      this.time--;
      (this.txt_Time as Laya.Text).text = "Time:" + this.time + "s";
    }
  }

  // 游戏结束
  gameOver() {
    // console.log("游戏结束了");
    (this.txt_Score as Laya.Text).visible = false;
    (this.txt_Time as Laya.Text).visible = false;
    (this.gameOverPanel as Laya.Text).visible = true;
    Laya.stage.event("GameOver");
  }

  againGame() {
    this.score = 0;
    this.time = 60;
    this.timer = 0;
    (this.txt_Score as Laya.Text).text = "Score:0";
    (this.txt_Score as Laya.Text).visible = true;
    (this.txt_Time as Laya.Text).text = "Time:60s";
    (this.txt_Time as Laya.Text).visible = true;
    (this.gameOverPanel as Laya.Text).visible = false;
    Laya.stage.event("AgainGame");
  }
}
