export default class MoleCtrl extends Laya.Script {
  public isUp: boolean = false;
  public isDown: boolean = false;

  constructor() {
    super();
  }

  onAwake() {
    this.randomUp();
  }

  onUpdate() {
    const owner = this.owner as Laya.Sprite3D;
    if (this.isUp) {
      // 沿着y轴正方向移动
      owner.transform.translate(new Laya.Vector3(0, 0.1, 0));
      if (owner.transform.localPosition.y >= 2.5) {
        this.isUp = false;
        owner.transform.localPosition = new Laya.Vector3(0, 2.5, 0);
        Laya.timer.once(1000, this, function () {
          this.isDown = true;
        });
      }
    }

    if (this.isDown) {
      owner.transform.translate(new Laya.Vector3(0, -0.1, 0));
      if (owner.transform.localPosition.y <= 0) {
        this.isDown = false;
        owner.transform.localPosition = new Laya.Vector3();
        this.randomUp();
      }
    }
  }

  randomUp() {
    var value = Math.random();
    Laya.timer.once(value * 8000, this, function () {
      this.isUp = true;
    });
  }

  //当底数被敲击之后调用
  Knock() {
    (this.owner as Laya.Sprite3D).transform.localPosition = new Laya.Vector3();
    this.isUp = false;
    this.isDown = false;
    // this.randomUp();
  }
}
