import HummerCtrl from "./HummeCtrl";
import MoleCtrl from "./MoleCtrl";

export default class GameRoot extends Laya.Script {
  /** @prop {name:intType, tips:"整数类型示例", type:Int, default:1000}*/
  public intType: number = 1000;
  /** @prop {name:numType, tips:"数字类型示例", type:Number, default:1000}*/
  public numType: number = 1000;
  /** @prop {name:strType, tips:"字符串类型示例", type:String, default:"hello laya"}*/
  public strType: string = "hello laya";
  /** @prop {name:boolType, tips:"布尔类型示例", type:Bool, default:true}*/
  public boolType: boolean = true;
  // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0

  constructor() {
    super();
  }

  onAwake() {
    Laya.Scene3D.load(
      "res/scene/LayaScene_Main/Conventional/Main.ls",
      Laya.Handler.create(this, this.onLoadSceneFinish)
    );
  }

  //场景加载完成之后的回调方法，参数:加载完成后的场景
  onLoadSceneFinish(loadScene: Laya.Scene3D) {
    loadScene.zOrder = -1;
    Laya.stage.addChild(loadScene);
    var moles = loadScene.getChildByName("Moles");
    for (var i = 0; i < moles.numChildren; i++) {
      moles.getChildAt(i).getChildAt(0).addComponent(MoleCtrl);
    }
    var camera = loadScene.getChildByName("Main Camera");

    var effect = loadScene.getChildByName("Particle System") as Laya.Sprite3D;

    // 制作特效预制体
    var effectPrefab = Laya.Sprite3D.instantiate(effect);
    effect.active = false;
    loadScene
      .getChildByName("Hummer")
      .addComponent(HummerCtrl)
      .Init(camera, loadScene, effectPrefab);
  }
}
