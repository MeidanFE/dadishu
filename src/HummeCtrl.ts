import EffectAutoDestory from "./EffectAutoDestory";
import MoleCtrl from "./MoleCtrl";

export default class HummerCtrl extends Laya.Script {
  private ray: Laya.Ray;
  private hitResult: Laya.HitResult;
  private effect: Laya.Sprite3D;
  private camera: Laya.Camera;
  private scene: Laya.Scene3D;
  private physicsSimulation: Laya.PhysicsSimulation;

  private targetPos: Laya.Vector3;
  private isGameOver: boolean = false;

  constructor() {
    super();
  }

  //初始化方法
  Init(camera: Laya.Camera, scene: Laya.Scene3D, effect: Laya.Sprite3D) {
    this.camera = camera;
    this.scene = scene;
    this.effect = effect;
    this.physicsSimulation = scene.physicsSimulation;
  }

  onAwake() {
    //创建射线
    this.ray = new Laya.Ray(new Laya.Vector3(), new Laya.Vector3());
    //射线检测结果
    this.hitResult = new Laya.HitResult();

    //判断鼠标左键按下
    Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onDown);
    Laya.stage.on("GameOver", this, function () {
      this.isGameOver = true;
    });
    Laya.stage.on("AgainGame", this, function () {
      this.isGameOver = false;
    });
  }

  onDown() {
    if (this.isGameOver) {
      return;
    }

    // 将屏幕坐标转化为射线
    this.camera.viewportPointToRay(
      new Laya.Vector2(Laya.stage.mouseX, Laya.stage.mouseY),
      this.ray
    );

    if (this.physicsSimulation.rayCast(this.ray, this.hitResult)) {
      const target = this.hitResult.collider.owner as Laya.Sprite3D;
      if (target.transform.localPosition.y >= 2) {
        this.targetPos = target.transform.position;
        this.targetPos.y = 0.35;

        (this.owner as Laya.Sprite3D).transform.position = new Laya.Vector3(
          this.targetPos.x,
          7,
          this.targetPos.z
        );
        Laya.Tween.from(
          (this.owner as Laya.Sprite3D).transform,
          {
            localPositionX: this.targetPos.x,
            localPositionY: this.targetPos.y,
            localPositionZ: this.targetPos.z,
          },
          200,
          Laya.Ease.linearIn,
          Laya.Handler.create(this, () => {
            this.hitResult.collider.owner.getComponent(MoleCtrl).Knock();
            // 生成特效
            var temp = Laya.Sprite3D.instantiate(
              this.effect,
              this.scene,
              false,
              this.targetPos
            ).addComponent(EffectAutoDestory);
            // console.log(Laya.stage.event("AddScore"));
            Laya.SoundManager.playSound("res/audio/hit.mp3");
            // temp.transform.position = this.targetPos;
            Laya.Tween.from(
              (this.owner as Laya.Sprite3D).transform,
              {
                localPositionX: this.targetPos.x,
                localPositionY: 7,
                localPositionZ: this.targetPos.z,
              },
              200,
              Laya.Ease.linearIn,
              Laya.Handler.create(this, function () {}),
              0,
              true
            );
          }),
          0,
          true
        );
      }
    }
  }
}
